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
    pageCount: number;
}

export const researchData: ResearchData[] = [
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