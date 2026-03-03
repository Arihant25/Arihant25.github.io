const e={blogs:[{coverImage:"https://s3-ap-southeast-2.amazonaws.com/content-prod-529546285894/2020/03/tf.png",title:"Porting TerraMetrics to Python: A 5,594-Block Validation",description:"I ported the TerraMetrics Terraform quality metrics tool from Java to Python and validated it against 5,594 blocks — here is what I found.",date:"3 March 2026",slug:"porting-terrametrics-to-python",content:`TerraMetrics is an open-source research tool for measuring Infrastructure-as-Code quality in Terraform. In practice, it parses \`.tf\` files—the configurations used to define cloud infrastructure on AWS, Google Cloud, Azure, and similar platforms—and computes around 100 structural and quality metrics from their Abstract Syntax Trees.

I came across TerraMetrics while hunting for metrics I could use as reward signals to fine-tune LLMs with reinforcement learning, with the goal of getting them to generate better Terraform code. It fit the use case perfectly, except for one annoying detail: my entire fine-tuning pipeline was in Python, and TerraMetrics was a Java \`.jar\` that had to be invoked externally. Calling it as a subprocess technically worked, but the whole setup felt brittle, so I ported the tool to Python, eliminated the external dependency, and kept the logic as faithful as possible to the original implementation.

Claude Sonnet 4.6 and I got it done in a couple of hours. Since AI-generated code shouldn't be taken on faith, I validated it rigorously using the same dataset as the original paper—5,594 Terraform blocks—comparing outputs block by block to verify behavioral equivalence.

**pyterametrics** is available on PyPI:

[https://pypi.org/project/pyterametrics/](https://pypi.org/project/pyterametrics/)

\`\`\`bash
pip install pyterametrics
\`\`\`

## What Exactly Was Validated?

The original TerraMetrics paper introduced a Java implementation that computes roughly 100 metrics per Terraform block, with each block identified by its relative file path, block identifiers, and line range. For validation, I ran both implementations against three pinned git tags: terraform-aws-eks at v19.20.0 (871 blocks across 57 files), terraform-google-kubernetes-engine at v29.0.0 (3,391 blocks across 445 files), and caf-terraform-landingzones at 5.7.7 (1,332 blocks across 231 files)—5,594 blocks in total.

For every matched block, I compared every numeric metric directly between the two implementations. For the understandability classification from the paper, I replicated the same rule: low complexity for \`sumMccabeCC < 20\`, moderate for 20–50, and high for anything above 50, then computed Cohen's Kappa between the Java and Python labels. Cohen's Kappa is a standard statistical measure of how well two systems agree with each other, accounting for the possibility that some agreement might happen by chance—a score of 1.0 means perfect agreement, while 0 means no better than random.

## Automated Comparison Results

### Block Matching

| Repository | Java | Python | Matched | Match Rate |
|---|---|---|---|---|
| aws-eks | 871 | 871 | 871 | 100% |
| google-kubernetes-engine | 3,391 | 3,371 | 3,260 | 96.14% |
| caf-landingzones | 1,332 | 1,328 | 1,328 | 99.70% |
| **TOTAL** | **5,594** | **5,570** | **5,459** | **97.59%** |

Nearly 98% of blocks matched by identity (file + block + line range), though raw matching percentage doesn't tell the whole story.

## Understandability Classification

For every matched block, the complexity label matched exactly—Cohen's Kappa of 1.0 across all three repositories. Not a single block was classified differently between the two implementations.

## Investigating the 246 Unmatched Blocks

There were 246 unmatched blocks in total—135 that appeared only in the Java output and 111 that appeared only in Python. I manually investigated every one of them, and all were fully accounted for. They fall into four categories.

**Trailing blank line differences (10 GKE blocks).** These are cases where both implementations agree on the block's start line but disagree on its end line. For example, \`resource google_container_cluster primary\` shows up at lines 22–397 in the Java output but 22–393 in Python. The reason is that Java counts trailing blank lines before the closing \`}\` as part of the block, while the Python lark-based parser stops before them. The blocks are semantically identical, all metrics match exactly, and the discrepancy is purely cosmetic.

**Cascading line-shift (222 GKE blocks).** This one is subtle. In large \`variables.tf\` files containing 100+ blocks, a single small end-line difference early in the file causes every subsequent block's line range to shift by a consistent offset. This cascaded across 18 files, and despite the large number of "unmatched" blocks it produced on paper, there were zero metric mismatches—only whitespace boundary differences that affected how blocks were identified, not what they measured.

**Version skew in the ground truth (3 GKE blocks).** Three blocks appear in the Java output but simply can't be found anywhere in the repository at the pinned tag v29.0.0. Running \`grep\` on the cloned repo confirms the relevant strings are absent. The most plausible explanation is that the Java ground truth was generated from a slightly newer commit before the tag was pinned. This isn't a parser issue on either side—it's a version mismatch in the reference data.

**A real grammar bug in python-hcl2 (4 CAF blocks).** One file in the caf-terraform-landingzones repo—\`caf_solution/add-ons/terraform_cloud/main.tf\`—failed to parse entirely, throwing an \`UnexpectedToken\` error at line 52. The culprit is a trailing comma before a closing parenthesis in a function call, which is perfectly valid HCL2 syntax but happens to trip up a grammar limitation in python-hcl2 v6's lark parser. This is an upstream bug rather than anything in pyterametrics itself; the tool correctly flags the file as unparseable and skips metric generation for those four blocks. They represent 0.07% of the total dataset, and fixing it would require a patch to the upstream parser.

## Performance

Measured wall-clock time on the same machine (Windows, JVM pre-warmed, Python 3.13 via uv):

| Repository | Java | Python | Ratio |
|---|---|---|---|
| aws-eks (871 blocks) | 1.82s | 3.13s | 1.72× slower |
| GKE (3,391 blocks) | 4.92s | 7.73s | 1.57× slower |
| CAF (1,332 blocks) | 2.59s | 3.79s | 1.46× slower |

Python runs about 1.5–1.7× slower than Java, which is unsurprising when you look at what each runtime is actually doing. Java uses a just-in-time compiler, which means it watches the code as it runs and optimizes the hot paths—like repeatedly walking a syntax tree—on the fly. Python has no equivalent of that, and it's also limited by the Global Interpreter Lock, a design constraint that prevents Python threads from running truly in parallel. On top of that, the parsing library pyterametrics uses under the hood—lark—is written in pure Python, whereas the original Java tool uses a compiled parser generated by a tool called ANTLR, which is considerably faster. That said, analyzing all 445 Terraform files in the GKE repo still completes in under 8 seconds, which is more than fast enough for research workflows or CI pipelines where you're running this as a one-off analysis rather than in a tight loop.

## Final Verdict

pyterametrics achieves a 97.59% block identity match overall—100% for aws-eks—with zero metric discrepancies on every matched block and perfect replication of the paper's understandability classification at κ = 1.0. The 246 unmatched blocks all have mundane explanations: whitespace counting conventions, a version mismatch in the ground truth, and a single upstream parser bug affecting four files. If your pipeline is already in Python and you want Terraform quality metrics without keeping a \`.jar\` around, the port does the job faithfully.

*Note: The original paper was titled "Terrametrics," but the GitHub repository used the spelling "terametrics." I followed the repository naming and called the port pyterametrics.*`},{coverImage:"https://cdn-images-1.medium.com/v2/resize:fit:2000/1*nIW0oS1lqs5g_bH4S2T02Q.png",title:"Cursor vs Copilot: Let the Results Speak",description:"A data-driven comparison of AI coding assistants using SWE-Bench Verified.",date:"17 July 2025",slug:"cursor-vs-copilot",content:`I have been a long-time user of Github Copilot, ever since it became available through the Github Student Developer Pack, where it felt like a small but useful coding speed boost for basic autocomplete scenarios. Over time, the tool evolved from simple Tab completions to a more agentic mode that could handle full tasks, which was heavily inspired by another editor called Cursor. Until recently, I had not properly explored Cursor, mostly because Copilot was good enough for my everyday needs.

Things changed when Copilot introduced a new pricing structure, limiting premium requests to 300 per month and charging extra for additional calls to models like Claude Sonnet and Gemini. At the same time, Copilot had started to feel noticeably sluggish in my workflow. Since I had already heard a lot of positive opinions about Cursor from friends and on social media, I finally decided to give it a serious try to see how it compared.

Right from the start, Cursor felt significantly faster in practice. The design also struck me as more refreshing, partly because I have been staring at the same VS Code interface for years, and the slight change in layout made a surprising difference in how fresh the experience felt. However, the free Tab completions ran out quickly, which was frustrating, but I decided not to rely on gut feelings alone. I wanted to actually measure and compare these AI tools properly, instead of basing my impressions on subjective experience.

## Benchmarking AI Coding Assistants with SWE-Bench Verified

For a meaningful test, I needed a dataset that represents real-world coding tasks rather than toy examples. That is when I turned to SWE-Bench Verified, a benchmark I had seen referenced multiple times in large language model release blog posts. SWE-Bench contains thousands of bugs from real open-source repositories like Django and Sympy, and the Verified subset consists of 500 carefully curated issues selected by OpenAI for quality and realism.

The evaluation process is straightforward but rigorous. Each task consists of a GitHub issue describing a real bug. The AI agent is expected to modify the codebase to resolve it. The changes are captured as a git diff, which is saved as the system's prediction. After generating all the diffs, each patch is individually applied to the base repository, and the project's test suite is executed. If all tests pass, the issue is considered resolved. Otherwise, it counts as a failure.

## Automating the Test Pipeline

To run the experiment efficiently, I wrote a Python script that uses multiple parallel threads to open both editors, retrieve the bug descriptions from the dataset, and paste them into the AI input panes of each tool. The agents then perform the fix autonomously and signal completion by creating a file called fixed.txt. Once the task is marked as done, the script collects the git diff, resets the repository to its original state, and proceeds to the next task in the list.

For this comparison, I used Github Copilot configured with the GPT 4.1 model, while Cursor ran in Auto mode, which are their default settings and are available without requiring a paid subscription.

## The Results: Cursor Is Faster, Copilot Solves More Bugs

After completing all 500 SWE-Bench Verified tasks with both agents, the results came in as follows.

Cursor was noticeably faster, finishing tasks in an average of 62.95 seconds compared to Copilot's 89.91 seconds. This matches the initial impression I had during day-to-day usage where Cursor felt more responsive and lightweight. However, in terms of successful resolutions, Copilot came out ahead by solving 283 of the tasks, whereas Cursor successfully resolved 258. This translates to a 56.5 percent resolution rate for Copilot, versus 51.7 percent for Cursor.

Both systems encountered one agentic error each, where the AI failed to produce any meaningful fix or output. However, Copilot had an additional issue where it sometimes generated empty patches (essentially submitting a diff that made no changes to the codebase). This happened four times in my run, when GPT 4.1 kept reading the same file over and over again and time out after 15 mins. Cursor, by contrast, never submitted an empty patch, which suggests it is more inclined to at least attempt a solution, even if that solution occasionally does not work.

![A graph of the results](https://cdn-images-1.medium.com/v2/resize:fit:2000/1*nIW0oS1lqs5g_bH4S2T02Q.png)

## What This Means

If your primary concern is raw speed and you prefer an AI coding assistant that consistently returns some output for every task, even if it is sometimes incorrect, Cursor provides a better experience. On the other hand, if your goal is to maximize the number of successful resolutions, Copilot remains slightly ahead, although it occasionally returns nothing at all for certain tasks.

## A Note on Windsurf

As a side experiment, I also tried running Windsurf on the same benchmark. Integrating it into my script proved challenging because it frequently threw errors like invalid tool calls and claimed the fixed.txt file already existed, preventing new task completions. Despite these issues, I managed to get Windsurf to run for 90 test cases. I have not yet processed the evaluation for Windsurf, but if you are interested, feel free to run the rest of the benchmark and submit a pull request to the repository.

You can find the code and results here:
[https://github.com/Arihant25/mayday](https://github.com/Arihant25/mayday)`},{coverImage:"https://img.freepik.com/free-vector/pencil-round-smooth-style_78370-7571.jpg?semt=ais_hybrid&w=740",title:"I, Pencil",description:"A pencil has something to say.",date:"19 December 2019",slug:"i-pencil",content:"Hello everyone! I am a pencil, as you might have guessed already. ![](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*_tTHbN5t0v8E_wWsrL9Qqw.png) The life of a pencil isn’t very easy, as most of you think. First of all, I have to wake up every day with my owner at 5 AM to do homework. Then, in school, I remain in constant fear of being dropped accidentally and losing my sharp nib. Yes, my owner always keeps me sharpened. Sometimes, during long exams, I become very exhausted, yet I have to keep on writing. What scares me is that once I become short, I will be thrown away. Oh, how I wish I could have refills like a pen!"},{coverImage:"https://m.media-amazon.com/images/I/71JzMrFUxIL._AC_UF1000,1000_QL80_.jpg",title:"Oscar’s Adventures",description:"The story of Oscar, a dog adopted from an orphanage, and his life with his new family.",date:"9 February 2020",slug:"oscars-adventures",content:`Hello everyone! It’s Oscar here. I am 5 years old. I was brought into my current home from an orphanage a few weeks ago.

![](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*uFKxHLRqt56uC6WZjrGwOg.jpeg)

I was just lying on my back and staring at the sky when I heard footsteps coming toward me. I jumped up with excitement and started yelping loudly. I saw a little human boy of fewer than 10 years of age approach toward me. I could see the freckles on his cheeks. He smiled at me and showed me his pearly white teeth. We looked at each other longingly for a moment, and then he called out to his parents, who were talking with the owner of the orphanage. “I like this one!”, the boy exclaimed happily. The boy’s parents smiled at him approvingly and signalled to the owner. He came over to my cage and opened it, upon which I rushed over to the boy and jumped onto his open arms. “Careful, Max!”, his mother called out to him. Max was a little startled because of my weight, but in a few moments held me comfortably, as if we had been doing this for years. They took me home in their small but cosy car. I looked at the scenery outside for the first time. It was a small and dainty town. There were very few cars and other vehicles on the road. There were beautiful parks with colourful flowers everywhere. I was mesmerised, seeing all this for the first time. I never knew a world like this existed outside of my orphanage. After a few hours, we reached my new home. It was a tiny house. It had a small garden on the front and a garage where Max’s father parked the car. Max took me inside the room and showed me all the rooms. He also showed me his toys. Everything was so complicated and confusing. There was a black box on a table, which sometimes showed colourful pictures when there were people sitting in front of it. There was a weird circular thing on the wall, which made ticking noises all the time! There was a tall box (which was bigger than the previous black box), which had all kinds of delicious food in it. It made my mouth water just by looking at it. I was happy to finally be in a family who loved me!

But everything changed after a few weeks.

---
I was just getting used to my new life in the house. The regular walks with Max, the delicious meals I got to eat, the wonderful new things I got to see, all of it. I thought it would last forever. But then misfortune struck. Max fell ill. He became bed-ridden. He couldn’t play with me anymore. He spent most of his time lying and closing his eyes. Relatives from all over came to see him. Many doctors came too. But they all left with sad and sullen faces. All around the house, there were whispers of only one word, ‘*Cancer’*.

I didn’t know what it meant then, and I still don’t now. But at that time, it meant I couldn’t enjoy my life with Max anymore. One day, I felt something weird. I was lying half-asleep on the floor of Max’s room. It was a dark and cloudy day. I barked loudly at Max, but he didn’t respond. He didn’t so much as stir on his bed. I rushed to his parents and barked hurriedly at them. They immediately knew something was wrong. They followed me to Max’s room.

He lay very still.

I still live with Max’s parents now. They take good care of me, just like before. I am the only thing stopping them from falling to the depths of depression and misery. I am their only hope now.`},{coverImage:"https://miro.medium.com/v2/resize:fit:1400/0*34gM4z8Y40JhcoCr.jpg",title:"A Morning At The Balcony",description:"Reflections from a balcony during a quiet morning in the city.",date:"20 June 2020",slug:"a-morning-at-the-balcony",content:`As I sit on my tiny island of concrete and look at the world below, I can’t help but wonder at the magnificence of it all. Very few people are out on the streets at this early morning hour. And besides, ever since the virus outbreak started, the number of people outside has gone considerably lower. Are we humans the ones who are controlling the world, or is it merely an illusion we have created to satisfy our restless minds?

![](https://miro.medium.com/v2/resize:fit:1400/0*34gM4z8Y40JhcoCr.jpg)

*This **isn’t** my balcony, although I wish it were…*

Suddenly, a pigeon, sitting quietly like an assassin on one of our neighbouring windows, takes off, breaking me away from my melancholy thoughts. I look at it as it flaps it’s majestic grey wings, soaring over the high rise buildings of the various apartments. Once, it would have looked out of place in the sprawling cities, but now everyone is so used to seeing pigeons that no one even sees them properly anymore. That’s one of the major flaws present in every city, no matter the country. Most people are so involved in their lives that they don’t even glance at what’s around them. I bet you could paint a giant sign beside them while they’re walking outside with their phones and they won’t even notice it! Ironically enough, I’m guilty of being like that myself sometimes, which is why I decided to be more mindful of my present. A minuscule spider crawls tentatively towards me. My survival instincts kick in at the moment my eyes register its shiny black body. My legs scream at me to fight it or get up and run from there. But I’m frozen in place. I look at it as it waves its white arms (or antennae?) towards me. I consider it as a friendly gesture and decide to stay awhile. A freight train whistles and chugs along on the tracks beside my house. A slight breeze picks up, gently pushing the giant wind chimes in my home to and fro. They create a deep sound, which seems like it resonates with the universe itself. Somehow, it’s in tune with the calming piano music flitting in and out of the background. I never understood how it did it, that wind chime. It always manages to be in tune with whatever song is playing at the moment.

> It’s easy to see why some people think we are just pawns in the grand scheme of the cosmos…

As minutes turn into hours, the sun rises from behind its usual hiding spot. Light falls on rooftops everywhere. The trees on the ground seem happier than usual to get the light. From my balcony on the eleventh floor, I look at the tiny cars zooming on the road and think about all the people in them. I wonder about their lives, where they could be heading this early in the morning, and why. From this high up, it’s easy to see why some people think we are just pawns in the grand scheme of the cosmos. I wish I could stay here for the whole day, but as more and more people appear on the roads, I realise it’s time for me to get back to my life too.`},{coverImage:"https://static.vecteezy.com/system/resources/previews/011/143/527/large_2x/set-of-pets-animals-free-vector.jpg",title:"On Pet Choices",description:"A look at people's pet preferences and the factors influencing them.",date:"1 October 2020",slug:"on-pet-choices",content:`![A pie chart of people’s pet preferences](https://miro.medium.com/v2/resize:fit:996/1*6bF5S9hteL4zVg8qfLlJ4w.png)

The above pie chart shows the preferences of people for various pets. Pets provide enjoyment and companionship for everyone in the family, and also teach children the value of responsibility. There are numerous factors which influence the choice of an animal. Money is one such factor. Different animals have different needs and require varying amounts of money to keep. For example, fish are cheaper than dogs and cats. Hence, 16% of people own a fish or bird as a pet. Time is another factor. Some pets, like dogs, need to spend a lot of time with their owners to be happy. Nowadays, it can be difficult to fit in time in our busy lives to care and look after a pet. Therefore, 33% of people don’t own any pets, while 26% keep a dog, and only 15% have a cat. Probably the most important factor while choosing a pet in cities is space. There is a huge lack of space in apartments to keep bigger animals. That may be the reason why only 10% of people are able to keep both a dog and a cat in their home.`},{coverImage:"https://miro.medium.com/v2/resize:fit:2000/format:webp/1*sxdQ0xWn3lGX18jjPcfhiQ.jpeg",title:"How I Got into IIIT Hyderabad with AIR 1",description:"My journey through entrance exams, Boards, and UGEE to IIIT Hyderabad.",date:"19 July 2023",slug:"how-i-got-into-iiit-hyderabad-with-air-1",content:`Entrance exams are hard. I learnt it the hard way. See, no one told me that there would be such a big *gap* between the difficulty level of class 10 and class 11.

Nah, scratch that — many people told me. Told me to steer clear of the science stream and take *anything* else. But I chose to ignore them, if it wasn’t evident already, and here we are now. How could I have avoided the life changing pursuit of Science? The only reason humanity has progressed from the Stone Age to the Modern age is because people dared to push boundaries, discover and invent new stuff constantly. Little did I know that the vision of Science I had in my fantasies and the reality of entrance exams were poles apart. My parents are dentists, so it would have made perfect sense for me to take the Medical stream too. But I’ve been in a steady long-term relationship with Computer Science for a while now (it’s going great, thanks for asking), so I couldn’t settle for anything else.

![A graph comparing the difficulty of class 10 vs 11.](https://miro.medium.com/v2/resize:fit:1400/0*S1Um9ZYHdGa2DTay)

Remember that two-week long holiday the schools gave us, starting March 13, 2020, because of some ‘coronavirus’ causing havoc in China? Yeah, that didn’t last two weeks. Two years, more like. Our 10th Boards got cancelled due to the pandemic. So, I just jumped from reading 10th grade trigonometry one day to starting 11th grade Units and Dimensions in physics the next. At first, the chapters were somewhat easy; then, like a shadow act with higher stakes, they slowly crept up on me menacingly, catching me unaware in the process. In my defence, though, I kept studying regularly despite the hurdles (even if for just a couple hours on some days). Online classes were just not as effective as the real deal.

Then, in twelfth grade, schools finally opened. Like that one English chapter in the class 9 NCERT, The Fun They Had, we had spent a long time adjusting to Zoom screens and frequent “Am I audible sir’s?”. (“I am Narcissus and my little Zoom square is my lake.”) I was very relieved to head back there, as I had been missing my school life for two years. Once school started, I fell into a rhythm of waking up early, attending classes regularly, and revising what was taught in the class. I didn’t have to think much about what to study because the school’s timetable was enough. It became muscle memory after a point.

One eternity later, it was December. Preboards were almost upon us, and that was also when the NTA (National Testing Agency) declared the JEE (Joint Entrance Examination) dates, which were to be held in January and April. I had expected they would be held in April and after, so I was once again caught off-guard. I tried to prioritise both Boards and JEE, but figured since I only had one chance to give the Boards, I should make the most of it. In the end, I scored 94.2% in Boards (with a full 100 in CS). Not bad, if I do say so myself. My subjects were Physics, Chemistry, Maths, Computer Science and Painting.

![My marks in school tests.](https://miro.medium.com/v2/resize:fit:1400/0*UEY58sayz5vl5MZe)

![My percentages in the same tests.](https://miro.medium.com/v2/resize:fit:1400/0*5pIiI6bnsDTy0TDG)

After a relatively dismal performance in the first JEE (91.88 percentile), and even worse in the second (90.2), I still didn’t lose hope — because in the November of 2022, I had found out about the UGEE (Undergraduate Entrance Examination) and had that as my main goal. In fact, I was intermittently giving UGEE mock tests alongside JEE mock tests even before the April session of JEE. Then, I finally gave UGEE on May 6, and it went well (95/150). The cutoff was 90. Truth be told, I relaxed after that and didn’t prepare *that* seriously for BITSAT (Birla Institute of Technology and Science Admission Test for BITS Pilani). I scored 209 there in the first attempt and even less in the second. (Something of a trend there…)

In VIT I had got a rank of around 8000, in Manipal and KIIT, somewhere around 700–800. I had qualified for JEE Advance but couldn’t clear the cutoff for IITs. I was getting VIT Vellore CS with specialisation in Information Security, which I was keeping as my backup, and Manipal and KIIT CS too.

Then, on 13th June, I had my interview for IIIT Hyderabad. There I was asked a couple Science questions which I answered more or less correctly, and after a week, I found out my rank. I had chosen B Tech + MS in Computer Science as my first preference, so that’s what I got.

![IIIT Hyderabad campus.](https://miro.medium.com/v2/resize:fit:2000/1*sxdQ0xWn3lGX18jjPcfhiQ.jpeg)

Now, coming to one of the primary reasons I wrote this article. During the class 11 final exams, I decided to track the amount of time I spent studying, so I could procrastinate less and find out where all my time actually goes. I did my research and found out about an app called Toggl Track (not sponsored, sadly) that did exactly what I wanted. I stopped tracking my time one day before the Preboards and before I started giving any mock tests for JEE.

The total tracked time is 1291 hours, 21 minutes, and 3 seconds.

Below are the results from this entire exercise, in the hope that future students might analyse these and find them useful. One such interesting insight I found is that my average time of one sitting is just 38 minutes.

These are divided subject wise:

![Chemistry](https://miro.medium.com/v2/resize:fit:1400/0*yhIKVPIcsyv2M0ns)

![Maths](https://miro.medium.com/v2/resize:fit:1400/0*4QcQDfT8XBaW6MMt)

![Physics](https://miro.medium.com/v2/resize:fit:1400/0*UHZFTqvKO0NzYGx6)

And below is a PDF containing detailed information about the amount of time spent studying each chapter of each subject. If there’s one link you click in this entire article, I highly recommend it to be this one. Maybe you’ll get surprised by what you see?

[Chapter-wise](https://www.slideshare.net/ArihantTripathy/class-12-projectpdf?source=post_page-----a90ce331deeb---------------------------------------) — Here you can find the amount of time I studied each chapter and resource.

These are the CSV files so that you can analyse them yourself:

[Click here for the chapter-wise entries](https://pastebin.com/8TxbnJBc).

[Click here for the individual entries](https://pastebin.com/aTpkZ45T).

Bonus: In the course of my studies, I found two chapters very intriguing — class 11’s Structure of Atom and Chemical Bonding in Chemistry. To understand them better, I made my own notes for them by consulting various sources. It took almost an entire week to write each chapter’s notes. The good thing was that since the chapters are related, they also helped me in class 12’s Atoms and Nuclei in Physics.

Here are the notes so you might benefit from them as much as I did:

[Structure of Atom Notes — Google Docs](https://docs.google.com/document/d/1dvKK93sYTtLZQQJih9W_BtfxPTvSGSPMmTMiqBddUNE/edit#heading=h.nrnw03t7conb)

[Chemical Bonding and Molecular Structure Notes — Google Docs](https://docs.google.com/document/d/1mCGMxgkuluedfA7RqP2qgmU9kuYW27D0CL5uaoyqNac/edit#heading=h.nrnw03t7conb)

---

*Acknowledgement: I owe a debt of gratitude to Ira Rath, who somehow managed to turn my ramblings into this masterpiece you just devoured.*

---

**Update:** A lot of people are asking me how best to prepare for UGEE. Well, I can’t really advise you specifically, because everyone has their own style and what worked for me may not work for you. However, what I can tell you is that I did not study anything extra for the SUPR part of UGEE. The Boards syllabus was more or less enough, with maybe a concept or two I learned throughout my JEE preparation. Also, in my time there was no negative marking in SUPR, so I could guess whenever I was unsure. It more of a game of speed than of accuracy. And finally, for REAP, I felt like all the questions required just common sense. There wasn’t much to prepare for there. One thing I would suggest you though, is to give mock tests. As many as you can. Now I could tell you exactly which mock tests to do, but since you’re planning on doing a research degree, you should be able to search up on your own. Besides, you can’t go wrong with any one because they’re more or less the same. You just need an idea of how prepared you are, and work accordingly.`}]};export{e as b};
