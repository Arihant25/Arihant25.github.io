<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import quotes from '$lib/quotes';
	import { hapticTap, hapticStep } from '$lib/haptics';

	function calculateDuration(startDateStr: string, endDateStr: string): string {
		const startMonthYear = startDateStr.split(' ');
		const endMonthYear = endDateStr.split(' ');

		const months: { [key: string]: number } = {
			Jan: 0,
			Feb: 1,
			Mar: 2,
			Apr: 3,
			May: 4,
			Jun: 5,
			Jul: 6,
			Aug: 7,
			Sep: 8,
			Oct: 9,
			Nov: 10,
			Dec: 11
		};

		const startDate = new Date(parseInt(startMonthYear[1]), months[startMonthYear[0]]);
		let endDate: Date;

		if (endDateStr.toLowerCase() === 'present') {
			endDate = new Date(); // Current date
		} else {
			endDate = new Date(parseInt(endMonthYear[1]), months[endMonthYear[0]]);
		}

		// Adjust endDate to be the end of the month for duration calculation if it's not 'Present'
		// For 'Present', we use the current date as is.
		// For past roles, if a role ended in "Mar 2025", it means it lasted until the end of March 2025.
		if (endDateStr.toLowerCase() !== 'present') {
			endDate.setMonth(endDate.getMonth() + 1);
			endDate.setDate(0);
		}

		let years = endDate.getFullYear() - startDate.getFullYear();
		let numMonths = endDate.getMonth() - startDate.getMonth();

		if (endDate.getDate() < startDate.getDate() && endDateStr.toLowerCase() !== 'present') {
			numMonths--;
		}

		if (numMonths < 0) {
			years--;
			numMonths += 12;
		}

		// If the role is very short (e.g., same month and year), ensure duration is at least 1 month.
		if (
			years === 0 &&
			numMonths === 0 &&
			startDate.getFullYear() === endDate.getFullYear() &&
			startDate.getMonth() === endDate.getMonth() &&
			endDateStr.toLowerCase() !== 'present'
		) {
			numMonths = 1;
		} else if (
			years === 0 &&
			numMonths === 0 &&
			endDateStr.toLowerCase() === 'present' &&
			startDate.getTime() <= endDate.getTime()
		) {
			// If it's 'Present' and started this month, show as '1 mo' or similar if it just started
			const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
			if (dayDiff <= 31) return '< 1 mo'; // Or handle as needed for very recent starts
		}

		let durationStr = '';
		if (years > 0) {
			durationStr += `${years} year${years > 1 ? 's' : ''}`;
		}
		if (numMonths > 0) {
			if (durationStr.length > 0) {
				durationStr += ' ';
			}
			durationStr += `${numMonths} month${numMonths > 1 ? 's' : ''}`;
		}

		if (durationStr === '') {
			// Handle cases like a 1-month internship within the same month
			return '1 mo';
		}

		return durationStr;
	}

	// The quote card is a deck: every click draws a fresh quote, no repeats
	// until you've seen them all — and the deck knows when you have.
	let quote = $state('');
	let deck: string[] = [];
	let deckFinished = false;

	function shuffleDeck() {
		deck = [...quotes];
		for (let i = deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
	}

	function drawQuote() {
		if (deck.length === 0) {
			if (quote && !deckFinished) {
				deckFinished = true;
				quote = `…and that’s every quote in the deck — all ${quotes.length} of them. Thank you for listening this closely.`;
				return;
			}
			deckFinished = false;
			shuffleDeck();
		}
		quote = deck.pop()!;
	}

	function handleQuoteClick() {
		hapticTap();
		drawQuote();
	}

	// THE PERIOD. It ends the first sentence of the site, and it can take
	// a surprising amount of enthusiasm.
	let periodPops = $state(0);
	let periodAnim = $state<'' | 'pop' | 'somersault'>('');

	function popPeriod() {
		hapticStep();
		periodPops++;
		// Retrigger the animation even on rapid clicks
		periodAnim = '';
		requestAnimationFrame(() => {
			periodAnim = periodPops % 5 === 0 ? 'somersault' : 'pop';
		});
	}

	// Draw the first quote when the component mounts
	onMount(() => {
		drawQuote();
	});

	const siteUrl = 'https://arihant25.github.io';
	const description =
		"I'm a Computer Science student and researcher at IIIT Hyderabad. Here you'll find my blog, projects, music, photos, and research.";

	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Arihant',
		url: siteUrl,
		image: `${siteUrl}/avatar.png`,
		sameAs: [
			'https://github.com/Arihant25',
			'https://open.spotify.com/artist/1Jtf3PGZ3Z6NwLyD7RGxjS'
		],
		jobTitle: 'Computer Science Student & Researcher',
		affiliation: {
			'@type': 'CollegeOrUniversity',
			name: 'IIIT Hyderabad'
		},
		description: description
	};
</script>

<svelte:head>
	<title>Arihant's Corner</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={siteUrl} />
	<meta property="og:title" content="Arihant's Corner" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:image" content="{siteUrl}/avatar.png" />
	<meta name="twitter:title" content="Arihant's Corner" />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{siteUrl}/avatar.png" />
	{@html `<script type="application/ld+json">${JSON.stringify(personSchema)}</script>`}
</svelte:head>

<div class="md:mx-4">
	<!-- HERO -->
	<div class="mx-auto flex flex-col items-center p-4 pt-20 pb-12 sm:px-6 md:flex-row lg:px-8">
		<div class="w-full text-center md:text-left">
			<h1
				class="font-ibm-plex-serif mb-6 font-bold"
				style="font-size: min(10vw, 10rem); line-height: 1.2;"
			>
				Hi, I am <span class="whitespace-nowrap"
					>Arihant<button
						class="period orange"
						class:pop={periodAnim === 'pop'}
						class:somersault={periodAnim === 'somersault'}
						onclick={popPeriod}
						aria-label="The period at the end of the sentence. It does not mind being pressed."
						>.</button
					></span
				>
			</h1>
		</div>
		<p class="max-w-2xl text-justify text-lg leading-relaxed font-light md:ml-24">
			I’m a Computer Science student and researcher at IIIT Hyderabad. I care about learning things
			properly and building with clarity and purpose. I like working on projects that feel
			meaningful, and I’m still figuring out what that means for me long-term. I’m also interested
			in sustainable development, since it is our duty to save our planet’s future. Outside of code,
			I enjoy reading, playing and listening to music, discovering new things, and watching the
			waves crash on the shore.
		</p>
	</div>

	<!-- QUOTE DECK -->
	<div class="mx-4 my-12 max-w-3xl sm:mx-auto">
		<button
			type="button"
			class="quote-section relative block w-full cursor-pointer rounded-lg border bg-black p-8 pb-10 text-left shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 dark:bg-slate-800"
			onclick={handleQuoteClick}
			aria-live="polite"
		>
			<div
				class="font-ibm-plex-serif orange absolute -top-9 left-4 text-9xl font-black"
				aria-hidden="true"
			>
				“
			</div>
			{#key quote}
				<p
					class="font-ibm-plex-serif relative z-10 text-center text-2xl leading-relaxed text-white italic"
					in:fly={{ y: 8, duration: 300 }}
				>
					{quote}
				</p>
			{/key}
			<span
				class="quote-hint font-space-mono absolute right-4 bottom-3 text-xs text-white/40"
				aria-hidden="true"
			>
				one more ↻
			</span>
		</button>
	</div>

	<!-- WORK EXPERIENCE -->
	<div class="work-section mx-auto mt-16 items-center space-y-16 p-4 py-12 sm:px-6 lg:px-8">
		<h1 class="text-center text-6xl">Where I Worked</h1>

		<!-- OSDG, IIIT Hyderabad -->
		<div class="flex flex-col items-center gap-12 md:flex-row md:justify-between">
			<div class="order-1 flex justify-center md:order-1 md:w-1/2">
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7u0wMKb82XPecYpwI62YkRk7rndyLN12hdQ&s"
					alt="OSDG, IIIT Hyderabad Logo"
					class="h-70 w-70 rounded-lg object-contain shadow-lg"
					loading="lazy"
				/>
			</div>
			<div class="order-2 md:order-2 md:w-1/2">
				<h2 class="mb-2 text-3xl font-bold">Open Source Developers’ Group, IIIT Hyderabad</h2>
				<p class="text-lg font-semibold">
					Coordinator
					<span class="font-normal">
						Mar 2025 — Mar 2026 · {calculateDuration('Mar 2025', 'Mar 2026')}
					</span>
				</p>
				<p class="text-lg font-semibold">
					Tech/Events Team Member
					<span class="font-normal">
						Feb 2024 — Mar 2025 · {calculateDuration('Feb 2024', 'Mar 2025')}
					</span>
				</p>
				<p class="mt-2 text-justify text-lg leading-relaxed font-light">
					I didn't want to stretch myself out too thin joining too many clubs and societies, and
					ending up not contributing to any of them. So I looked at all the clubs, and I looked at
					my skills and interests, and decided that I would have the most impact at the Open Source
					Developers’ Group. Hence this has been the only club I applied to and got in in my entire
					time at IIIT. As part of the Events team, I took a session on Introduction to Open Source,
					open at all but aimed primarily at freshers. As part of the Tech team, I helped create the
					Team Members section of the Club website, making that my first experience with Next.js. In
					my second year, I got promoted to the position of Club Coordinator. As a Coordinator, I
					was managing the development of various projects under the club, and trying to come up
					with new events that will take the club to new heights. Some of the events I helped
					organise include HackIIIT '26, Build2Break at Infinium, Worst UI Hackathon, Build With AI,
					Intro to GSoC, Intro to Git
				</p>
			</div>
		</div>

		<!-- Software Engineering Research Center, IIIT Hyderabad -->
		<div class="flex flex-col items-center gap-12 md:flex-row md:justify-between">
			<div class="order-2 md:order-1 md:w-1/2">
				<h2 class="mb-2 text-3xl font-bold">
					Software Engineering Research Center, IIIT Hyderabad
				</h2>
				<p class="text-lg font-semibold">
					Undergraduate Researcher
					<span class="font-normal">
						Mar 2025 — Present · {calculateDuration('Mar 2025', 'Present')}
					</span>
				</p>
				<p class="mt-2 text-justify text-lg leading-relaxed font-light">
					I joined SERC because I was drawn by my interest in sustainable technology and the impact
					of software on the world. Under the guidance of Dr. Karthik Vaidhyanathan, I am exploring
					ways to make software and AI systems more energy-efficient and environmentally friendly.
					My work here is helping me understand how even small changes in code and design can make a
					big difference for our planet. More information as research progresses!
				</p>
			</div>
			<div class="order-1 flex justify-center md:order-2 md:w-1/2">
				<img
					src="serc.jpg"
					alt="Software Engineering Research Center, IIIT Hyderabad Logo"
					class="h-83 w-110 rounded-lg object-contain shadow-lg"
					loading="lazy"
				/>
			</div>
		</div>

		<!-- Wikimedia Foundation -->
		<div class="flex flex-col items-center gap-12 md:flex-row md:justify-between">
			<div class="order-1 flex justify-center md:order-1 md:w-1/2">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/WTS_2024_Group_Photo.jpg/1920px-WTS_2024_Group_Photo.jpg"
					alt="Wikimedia Foundation Logo"
					class="h-70 w-120 rounded-lg object-cover shadow-lg"
					loading="lazy"
				/>
			</div>
			<div class="order-2 md:order-2 md:w-1/2">
				<h2 class="mb-2 text-3xl font-bold">Wikimedia Foundation</h2>
				<p class="text-lg font-semibold">
					Technical Talk and Participant Session Coordinator
					<span class="font-normal">
						Jul 2024 — Oct 2024 · {calculateDuration('Jul 2024', 'Oct 2024')}
					</span>
				</p>
				<p class="mt-2 text-justify text-lg leading-relaxed font-light">
					I had the opportunity to help organize technical talks and coordinate sessions for a
					Wikimedia event held at Hotel Hyatt in Hyderabad in 2024. It was exciting to work with
					speakers and participants from all over, making sure everything ran smoothly and everyone
					got the most out of the experience. This role taught me a lot about teamwork,
					communication, and the open-source community. The most surprising thing from this entire
					experience was actually getting to meet so many of the invisible people that keep
					Wikimedia and its various projects running, and how selflessly they contribute to make
					knowledge accessible to all.
				</p>
			</div>
		</div>

		<!-- Infosys -->
		<div class="flex flex-col items-center gap-12 md:flex-row md:justify-between">
			<div class="order-2 md:order-1 md:w-1/2">
				<h2 class="mb-2 text-3xl font-bold">Infosys</h2>
				<p class="text-lg font-semibold">
					Internship Trainee
					<span class="font-normal">
						May 2019 — May 2019 · {calculateDuration('May 2019', 'May 2019')}
					</span>
				</p>
				<p class="mt-2 text-justify text-lg leading-relaxed font-light">
					When I was in ninth grade in school, we got to hear about a program that Infosys was
					running. Students from various schools who were recommended by their teachers had to give
					an entrance exam, and if they passed, they would get to go to the Infosys campus in the
					summer for 10 days, and learn about various technologies used there. I was lucky enough to
					get selected, and I got to learn about HTML, CSS, JavaScript, Python, and machine learning
					on Microsoft Azure. I also got to visit a software company's campus for the first time,
					which was a great experience.
				</p>
			</div>
			<div class="order-1 flex justify-center md:order-2 md:w-1/2">
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJE44xfCFx7DuvvShEQw5r9koO1M-kcxx28w&s"
					alt="Infosys Logo"
					class="h-60 w-80 rounded-lg object-contain shadow-lg"
					loading="lazy"
				/>
			</div>
		</div>
	</div>

	<!-- EDUCATION -->
	<div class="education-section mx-auto mt-16 items-center space-y-16 p-4 py-12 sm:px-6 lg:px-8">
		<h1 class="text-center text-6xl">Where I Studied</h1>
		<!-- School Section -->
		<div class="flex flex-col items-center gap-12 md:flex-row md:justify-between">
			<div class="order-2 md:order-1 md:w-1/2">
				<h2 class="mb-2 text-3xl font-bold">SAI International School, Bhubaneswar</h2>
				<p class="text-justify text-lg leading-relaxed font-light">
					I joined SAI International in kindergarten, just a year after it was made, in 2009, and
					left only when I finished my 12th grade, in 2023. From the outside it looks just like an
					ordinary CBSE school, but little did I know that I would make some of the best memories of
					my life in the 14 years I spent at this very place. My teachers and friends have
					profoundly shaped my life in ways I couldn't have even imagined, whether in academics,
					sports, music, or just life in general.
				</p>
			</div>
			<div class="order-1 flex justify-center md:order-2 md:w-1/2">
				<img
					src="https://assets.odishabytes.com/wp-content/uploads/2021/07/SAI-International-School.jpg"
					alt="SAI International School"
					class="h-70 w-120 rounded-lg object-cover shadow-lg"
					loading="lazy"
				/>
			</div>
		</div>

		<!-- College Section -->
		<div class="flex flex-col items-center gap-12 md:flex-row md:justify-between">
			<div class="flex justify-center md:w-1/2">
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/1/11/IIIT_Hyderabad.jpg"
					alt="IIIT Hyderabad"
					class="h-70 w-120 rounded-lg object-cover shadow-lg"
					loading="lazy"
				/>
			</div>
			<div class="md:w-1/2">
				<h2 class="mb-2 text-3xl font-bold">IIIT Hyderabad</h2>
				<p class="text-justify text-lg leading-relaxed font-light">
					I joined IIIT Hyderabad in 2023, after getting an All India Rank of 1 in the UGEE exam. It
					felt like this college was different from the others, like it was calling out to me, and I
					knew I had to be here. The campus is beautiful, and the people are even better. Yes, it is
					not always easy. But easy gets boring over time. As they say, “If you’re the smartest
					person in the room, you’re in the wrong room.” I can’t wait to see what the future holds
					for me here. I am enrolled in the Computer Science dual degree (CSD) programme, so I
					expect to graduate in 2028.
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	/* The period: typographically identical to a span, until you press it */
	.period {
		display: inline-block;
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		line-height: inherit;
		cursor: pointer;
		transform-origin: 50% 100%;
	}

	.period.pop {
		animation: period-pop 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97);
	}

	/* Every fifth press earns a somersault */
	.period.somersault {
		animation: period-somersault 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes period-pop {
		30% {
			transform: translateY(-0.18em) scale(1.25, 0.75);
		}
		60% {
			transform: translateY(0) scale(0.85, 1.2);
		}
		80% {
			transform: scale(1.05, 0.95);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes period-somersault {
		40% {
			transform: translateY(-0.6em) rotate(180deg);
		}
		70% {
			transform: translateY(0) rotate(360deg) scale(1.15, 0.85);
		}
		100% {
			transform: rotate(360deg) scale(1);
		}
	}

	.quote-hint {
		opacity: 0.5;
		transition: opacity 0.2s ease;
	}

	.quote-section:hover .quote-hint,
	.quote-section:focus-visible .quote-hint {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.period.pop,
		.period.somersault {
			animation: none;
		}
	}
</style>
