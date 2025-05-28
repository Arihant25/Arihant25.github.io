export interface Project {
    name: string;
    codeUrl: string;
    deployedUrl?: string;
    coverImage: string;
    screenshots?: string[];
    description: string;
    shortDescription: string;
    year: number;
    technologies?: string[];
    slug: string;
}

export const projects: Project[] = [
    {
        name: "boxed",
        codeUrl: "https://github.com/Arihant25/boxed",
        deployedUrl: "https://arihant25.github.io/boxed/",
        coverImage: "/projects/boxed/boxed1.png",
        screenshots: ["https://arihant25.github.io/boxed/light.png", "https://arihant25.github.io/boxed/dark.png"],
        description: "I thought... \"What if there were an editor so simple that there was no friction between thoughts in your head, and on the screen?\" So I made boxed, a markdown editor with as little clutter as possible. In fact, there's not even a save button! It's done via Ctrl+S and Ctrl+O to open files. I did provide a timer though at the request of a friend Ira, so that you feel the need to get work done. And there's a prompts feature that gives a random fiction or non-fiction prompt to get you started.",
        shortDescription: "A brutally minimalist markdown editor",
        year: 2025,
        technologies: ["Rust", "Tauri", "Markdown", "HTML", "CSS", "JavaScript"],
        slug: "boxed"
    },
    {
        name: "Food@IIIT",
        codeUrl: "https://github.com/Arihant25/food-iiit",
        deployedUrl: "https://food-iiit.vercel.app",
        coverImage: "/projects/foodiiit/foodiiit1.png",
        screenshots: ["/projects/foodiiit/foodiiit2.png", "/projects/foodiiit/foodiiit3.png"],
        description: "IIIT Hyderabad introduced a new mess system in 2025, which involves each student getting a QR code which they show to avail a meal in the messes. But, sometimes, people just don't want to eat in the mess, and it's too late to cancel. Worry not, because Food@IIIT is here! Students can list their meals, and the site uses the MessAPI of IIIT-H to get the status of the meal, and once verified puts it up on the listings page. Anyone can bid for the meal, and the seller can choose a bidder to send the QR to. The site has detailed analytics for your purchases and sales, and even a leaderboard. This is just half the site though. The other half is focussed on canteens, and acts as a platform where anyone can cast votes on their favourite canteen food, and downvote the bad ones. Everything has search, sort and filtering features. On the technical side, this site was my first interaction with PostgreSQL databases in the form of Supabase, which allowed votes, bids, listings, etc. to be shown in real-time across the site. Whenever someone casts a vote, everyone on the site is notified by a toast notification. I also tried for a radically different design from the usual websites, hence I opted for the Neobrutalist design style. It also includes tasteful haptic feedback for specific buttons.",
        shortDescription: "One stop shop to manage your mess and canteen food",
        year: 2025,
        technologies: ["Next.js", "Supabase", "TypeScript", "TailwindCSS"],
        slug: "food-at-iiit"
    },
    {
        name: "IHS Marks Analyzer",
        codeUrl: "https://github.com/Arihant25/ihs-marks-analyzer",
        deployedUrl: "https://ihs-marks-analyzer.vercel.app",
        coverImage: "/projects/ihs-marks-analyzer/ihs-marks-analyzer1.png",
        screenshots: ["/projects/ihs-marks-analyzer/ihs-marks-analyzer2.png", "/projects/ihs-marks-analyzer/ihs-marks-analyzer3.png", "/projects/ihs-marks-analyzer/ihs-marks-analyzer4.png", "/projects/ihs-marks-analyzer/ihs-marks-analyzer5.png"],
        description: "Some people who took the Introduction to Human Sciences Spring 2025 course at IIIT-H felt that the paper correction was unfair, and that some Teaching Assistants, were biased towards giving more marks, while others were the opposite. This was concerning, so to set the record straight, we made this website to ask people to upload their marks, so we can analyse them and show the results here. We used a modern Web 3.0-esque design style with a pure black dark mode and neon colors. This was made in collaboration with Mohit Kumar Singh.",
        shortDescription: "Data analysis of people's grades in Introduction to Human Sciences course",
        year: 2025,
        technologies: ["Next.js", "TailwindCSS", "TypeScript"],
        slug: "ihs-marks-analyzer"
    },
    {
        name: "SERC Website",
        codeUrl: "https://github.com/avi1o1/SERC-Website",
        deployedUrl: "https://serc.iiit.ac.in/",
        coverImage: "/projects/serc-website/serc-website1.png",
        screenshots: ["/projects/serc-website/serc-website2.png", "/projects/serc-website/serc-website3.png", "/projects/serc-website/serc-website4.png", "/projects/serc-website/serc-website5.png"],
        description: "The previous SERC website was outdated and built with a drag-and-drop editor, which did not reflect the standards of IIIT Hyderabad's premier software engineering lab. Recognizing this, we undertook a complete redesign from the ground up, focusing on modern aesthetics and robust design principles. The result is a visually appealing, user-friendly, and technically sound website that better represents the lab's mission and activities. This project was a collaborative effort with Aviral Gupta and Mohit Kumar Singh.",
        shortDescription: "Official website of the Software Engineering Research Center",
        year: 2025,
        technologies: ["Next.js", "Typescript", "ESLint", "TailwindCSS"],
        slug: "serc-website"
    },
    {
        name: "YADA",
        codeUrl: "https://github.com/Arihant25/yada",
        coverImage: "/projects/yada/yada1.png",
        screenshots: ["/projects/yada/yada2.png", "/projects/yada/yada3.png", "/projects/yada/yada4.png", "/projects/yada/yada5.png", "/projects/yada/yada6.png", "/projects/yada/yada7.png"],
        description: "This was an assignment for the Design and Analysis of Software Systems Spring 2025 course at IIIT-H. We had to make a diet manager app with several features like calorie tracking, meal database management, daily food logs, etc. We also had to make documentation for it in terms of UML diagrams. This was made in collaboration with Mohit Kumar Singh.",
        shortDescription: "Yet Another Diet Assistant in Rust",
        year: 2025,
        technologies: ["Rust"],
        slug: "yada"
    },
    {
        name: "Saathi",
        codeUrl: "https://github.com/Arihant25/saathi",
        deployedUrl: "https://saathi-eight.vercel.app/",
        coverImage: "/projects/saathi/saathi1.png",
        screenshots: [
            "/projects/saathi/saathi2.png",
            "/projects/saathi/saathi3.png",
            "/projects/saathi/saathi4.png",
            "/projects/saathi/saathi5.png",
            "/projects/saathi/saathi6.png",
            "/projects/saathi/saathi7.png",
            "/projects/saathi/saathi8.png"
        ],
        description: "This was our winning submission for the HackIIIT Hackathon organised by the Open Source Developers' Group of IIIT Hyderabad. It is a mental health wellness platform that consists of gamification, anonymous community forums, meditation and yoga sessions, book and music recommendations, and all of this is powered by an agentic AI system. The agentic AI system remembers the user's mood progression throughout time, and the apps theme subtly changes to accommodate for it too. The framework for the agentic AI is MOYA, made by the startup MontyCloud, who also sponsored the event and set the problem statements. My team consisted of Aviral Gupta, Inesh Dheer, Shreyas Deb, and Shreyas Mehta. We won the prize for Best Product in the hackathon, and internship offers at MontyCloud.",
        shortDescription: "Agentic AI mental health wellness app",
        year: 2025,
        technologies: ["Next.js", "FastAPI", "GPT-4"],
        slug: "saathi"
    },
    {
        name: "Treasure Trove",
        codeUrl: "https://github.com/Arihant25/treasure-trove",
        deployedUrl: "https://treasure-trove-iiit.vercel.app",
        coverImage: "/projects/treasure-trove/treasure-trove1.png",
        screenshots: [
            "/projects/treasure-trove/treasure-trove2.png",
            "/projects/treasure-trove/treasure-trove3.png",
            "/projects/treasure-trove/treasure-trove4.png",
            "/projects/treasure-trove/treasure-trove5.png",
            "/projects/treasure-trove/treasure-trove6.png",
            "/projects/treasure-trove/treasure-trove7.png",
            "/projects/treasure-trove/treasure-trove8.png"
        ],
        description: "In the course Design and Analysis of Software Systems Spring 2025 at IIIT-H, our first assignment was to make a buy/sell listing website for IIIT. I may have gotten slightly overboard with the design though, and added dynamic listing creation, seller reviews and ratings, image zoom on hover, share buttons, skeleton loaders, and so on. Which explains why I got full marks for this, not to brag or anything though. In fact the skeleton loaders were the first time I did something like that, so I may or may not have added a fake delay on some pages just so people can enjoy their beauty. And there's an AI chatbot powered by Claude, that may not work because I do not have the API key set anymore. The site was designed using ShadCN, another first. I also decided for a pirate theme because I liked the idea.",
        shortDescription: "Pirate themed buy and sell web app",
        year: 2025,
        technologies: ["React", "Express", "MongoDB", "Tailwind CSS"],
        slug: "treasure-trove"
    },
    {
        name: "Wikimedia Communities Activity Alert System",
        codeUrl: "https://github.com/indictechcom/community-activity-alerts",
        deployedUrl: "https://community-activity-alerts-system.toolforge.org/",
        coverImage: "/projects/wikimedia-alert/wikimedia-alert1.png",
        description: "Built for the Wikimedia Hackathon 2024, this dashboard helps Wikimedia community members monitor unusual website traffic and take action, such as organizing events or analyzing impact. I developed the website while my collaborator, Navya Sri Kalli, handled the Python data analysis.",
        shortDescription: "Unusual traffic monitoring system for Wikimedia",
        year: 2024,
        technologies: ["Flask", "MediaWiki API", "DuckDB", "Pandas"],
        slug: "wikimedia-alert"
    },
    {
        name: "Sports Council Website",
        codeUrl: "https://github.com/Arihant25/sports-council-iiith",
        deployedUrl: "https://sports.iiit.ac.in",
        coverImage: "/projects/sports-council/sports-council1.png",
        screenshots: ["/projects/sports-council/sports-council2.png", "/projects/sports-council/sports-council3.png", "/projects/sports-council/sports-council4.png"],
        description: "The official website of the Sports Council at IIIT Hyderabad was developed and released (during my tenure as one of the two people in its Tech Team) to serve as a comprehensive platform for all sports-related activities on campus. It features detailed event information, team rosters, announcements, and resources for students and faculty. The site is designed to be visually engaging and user-friendly, ensuring that visitors can easily find schedules, results, and updates about ongoing and upcoming tournaments. The project was built using SvelteKit, FastAPI, MongoDB, TailwindCSS, and TypeScript, ensuring a modern and scalable architecture (it has to be, it is used by 1000+ users every year after all). This website was made in collaboration with Mohit Kumar Singh and Aaditya Vardhan Narain.",
        shortDescription: "Official website of Sports Council at IIITH",
        year: 2024,
        technologies: ["SvelteKit", "FastAPI", "MongoDB", "TailwindCSS", "TypeScript"],
        slug: "sports-council-website"
    },
    {
        name: "AdvantEdge NFS",
        codeUrl: "https://github.com/avi1o1/AdvantEdge",
        coverImage: "/projects/advantedge-nfs/advantedge1.png",
        screenshots: ["/projects/advantedge-nfs/advantedge2.png", "/projects/advantedge-nfs/advantedge3.png",],
        description: "This was the course project of Operating Systems and Networks in Monsoon 2024, at IIIT-H. It is a network file system, that has three components - clients, naming servers, and storage servers. The naming server facilitates the connection between multiple clients and storage servers. This has redundancy built in, so data is backed up across storage servers. It is also scalable and can accommodate a huge number of servers. It can even stream files over the network. This was made in collaboration with Anirudh Sankar, Aviral Gupta, and Mohit Kumar Singh.",
        shortDescription: "A scalable network file system written in C",
        year: 2024,
        technologies: ["C", "Linux", "Makefile", "Doxygen", "Network Programming"],
        slug: "advantedge-nfs"
    },
    {
        name: "arihant.sh",
        codeUrl: "https://github.com/Arihant25/arihant.sh",
        coverImage: "/projects/arihant.sh/arihant.sh1.png",
        description: "A custom shell implemented in low-level C, supporting pipes, redirection, and common shell operations. This was an individual assignment for the Operating Systems and Networks Monsoon 2024 course, and I took 60 hours to complete it.",
        shortDescription: "A custom shell in low level C",
        year: 2024,
        technologies: ["C", "Operating Systems", "Unix"],
        slug: "arihant-shell"
    },
    {
        name: "Fallen Guys",
        codeUrl: "https://github.com/Arihant25/fallen-guys",
        deployedUrl: "https://arihant25.github.io/fallen-guys/src/html/index.html",
        coverImage: "/projects/fallen-guys/fallen-guys1.png",
        description: "A fall detection system using IoT devices that alerts caregivers when a fall is detected for elderly care. Our system detects falls in real-time and alerts caregivers. It includes an accelerometer and GPS sensors under the hood, and has a custom designed 3D printed case, which won an award in a 3D design competition in college. This was the course project of the course Embedded Systems Workshop Monsoon 2024 at IIIT Hyderabad. This was made in collaboration with Anirudh Sankar, Aviral Gupta, and Mohit Kumar Singh. ",
        shortDescription: "A fall detection system using IoT",
        year: 2024,
        technologies: ["ESP32", "HTML", "CSS", "JavaScript"],
        slug: "fallen-guys"
    },
    {
        name: "GradR",
        codeUrl: "https://github.com/Arihant25/gradr",
        deployedUrl: "https://gradr-iiit.vercel.app",
        coverImage: "/projects/gradr/gradr1.png",
        screenshots: ["/projects/gradr/gradr5.png", "/projects/gradr/gradr2.png", "/projects/gradr/gradr3.png", "/projects/gradr/gradr4.png"],
        description: "This is a website made in React in the Neuromorphic design style. It contains most of the courses of the first two years at IIIT Hyderabad, and allows you to enter your marks in each course. It then calculates your course total, because different components have different weightages. The weightages are crowdsourced from students, and the website is open-source so anyone can submit any modifications. It also has a feature to calculate your CGPA and SGPA. This was made in collaboration with Aviral Gupta. We made it because we were tired of using a calculator and manually entering the weightages for each course.",
        shortDescription: "Crowdsourced marks calculator tool for any course at IIIT",
        year: 2024,
        technologies: ["Next.js", "TailwindCSS", "TypeScript"],
        slug: "gradr"
    },
    {
        name: "Fiery",
        codeUrl: "https://github.com/unignoramus11/fiery",
        deployedUrl: "https://unignoramus11.github.io/fiery/src/html/index.html",
        coverImage: "/projects/fiery/fiery1.png",
        description: "Fire detection system using IoT sensors and to provide early warnings and alerts. It consisted of an ESP32 microcontroller, connected to various sensors like smoke sensor, flame sensor, etc. I contributed to this project by making the dashboard, which contained the metrics from all the sensors, and alerted users in case of fire. It was the course project for Introduction to IoT Sprint 2024. This was made in collaboration with Karthik Malavathula, Aviral Gupta, and Mohit Kumar Singh.",
        shortDescription: "Fire detection system using IoT",
        year: 2024,
        technologies: ["ESP32", "IoT", "HTML", "CSS", "JavaScript"],
        slug: "fiery"
    },
    {
        name: "Fuse",
        codeUrl: "https://github.com/Arihant25/fuse",
        deployedUrl: "https://fuse-wqrs.onrender.com/",
        coverImage: "/projects/fuse/fuse1.png",
        screenshots: ["/projects/fuse/fuse2.png"],
        description: "This was a course project for the course Introduction to Software Systems in Spring 2024. It takes in images in any format, and outputs a video in a variety of formats and resolutions. One can add sounds from the library, or upload their own, and also diverse transitions between images. It uses FFMPEG under the hood to process videos in parallel, but the real selling point of this application is its UI and UX. This was made in collaboration with Team Code Fusion, consisting of Aviral Gupta and Mohit Kumar Singh. A hilarious bug caused all images to be widened, and we left it in because it made every video 10x better.",
        shortDescription: "Image to video convertor in vanilla web technologies",
        year: 2024,
        technologies: ["Flask", "HTML", "CSS", "JavaScript"],
        slug: "fuse"
    },
    {
        name: "inkvent",
        codeUrl: "https://github.com/Arihant25/inkvent",
        deployedUrl: "https://arihant25.github.io/inkvent/",
        coverImage: "/projects/inkvent/inkvent1.png",
        screenshots: ["/projects/inkvent/inkvent2.png"],
        description: "My friend Ira is a prolific writer, so I thought to present her with a blog that she can use to showcase her writing to the world. It is made such that articles can be written in simple Markdown, and later are converted to HTML pages for the static site. At her request, every article includes a related song meant to be listened to while reading the contents.",
        shortDescription: "A blog I made for a friend",
        year: 2023,
        technologies: ["JavaScript", "MarkDown", "HTML", "CSS"],
        slug: "inkvent"
    },
    {
        name: "Chooseplay",
        codeUrl: "https://github.com/Arihant25/chooseplay",
        deployedUrl: "https://arihant25.github.io/chooseplay/",
        coverImage: "/projects/chooseplay/chooseplay_1.png",
        description: "This is a single page website made in vanilla HTML, CSS, and JS that takes in a list of players, and divides them into two teams randomly. I made this because every time I played football or basktetball with friends, we had to spend a significant amount of time and bickering on who gets to be in which team. This solved it fair and square.",
        shortDescription: "A simple web tool to distribute players across 2 teams.",
        year: 2022,
        technologies: ["HTML", "CSS", "JavaScript"],
        slug: "chooseplay"
    },
    {
        name: "Class Link Check",
        codeUrl: "https://github.com/AmiMappy/class-link-check",
        deployedUrl: "https://amimappy.github.io/class-link-check/",
        coverImage: "/projects/class_link_check/clc1.jpg",
        screenshots: [
            "/projects/class_link_check/clc2.jpg",
            "/projects/class_link_check/clc3.jpg",
        ],
        description: "Class Link Check is a browser extension that monitors your Google Classroom page and notifies you as soon as the online class (Google Meet) link is released. The idea was conceived by my friend AmiMappy, who wrote the JavaScript logic, while I handled the frontend in HTML and CSS, as well as the website and marketing material. This tool was especially helpful during the pandemic, ensuring students never missed the start of an online class by providing timely browser notifications and alerts. It also served as a great introduction to building browser extensions. What's more, at its peak it had over 2000 active users, according to the Chrome Web Store statistics.",
        shortDescription: "A browser extension to notify when online class starts",
        year: 2021,
        technologies: ["JavaScript", "Chrome Extension API", "HTML", "CSS"],
        slug: "class-link-check"
    }
];
