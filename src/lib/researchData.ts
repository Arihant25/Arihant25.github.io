export interface ResearchData {
    slug: string;
    title: string;
    year: number;
    venue: string;
    description: string;
    paperLink: string;
    codeLink?: string;
    coverImage: string;
    audioSummary: string;
    pageImageExtension?: 'png' | 'jpg';
    pageCount: number;
}

export const researchData: ResearchData[] = [
    {
        slug: 'dark-patterns-quick-commerce',
        title: 'Dark Patterns in Indian Quick Commerce Apps: A Student Perspective',
        year: 2026,
        venue: 'Bridge Over Troubled Water (CHI 2026 Workshop), Barcelona',
        description: "Our paper looks at how dark patterns show up in quick commerce apps, and the awareness-action gap where users notice the manipulation but still go along with it.",
        paperLink: 'https://arxiv.org/abs/2604.02257',
        coverImage: 'cover.jpg',
        audioSummary: 'overview.m4a',
        pageImageExtension: 'jpg',
        pageCount: 11
    },
    {
        slug: 'swenergy',
        title: 'SWEnergy: An Empirical Study on Energy Efficiency in Agentic Issue Resolution Frameworks with SLMs',
        year: 2026,
        venue: 'AGENT 2026 (ICSE Workshop)',
        description: 'We compare the energy efficiency of 4 frameworks from SWE-Bench, and find out the factors that impact energy consumption the most.',
        paperLink: 'http://arxiv.org/abs/2512.09543',
        codeLink: 'https://github.com/sa4s-serc/swenergy',
        coverImage: 'cover.png',
        audioSummary: 'overview.mp3',
        pageCount: 8
    }
];