// Music releases data
export interface MusicRelease {
    coverImage: string;
    title: string;
    description: string;
    year: string;
    slug: string;
    spotifyEmbed: string;
    extendedDescription: string;
    type: 'EP' | 'Album' | 'Single';
}

export const musicReleases: MusicRelease[] = [
    {
        coverImage: '/music_covers/total_eclipse_of_the_heart.jpeg',
        title: 'Total Eclipse of the Heart',
        description: 'A wistful duet cover of the 80s hit',
        year: '2024',
        slug: 'total-eclipse-of-the-heart',
        spotifyEmbed: 'https://open.spotify.com/embed/track/0YQrTbDBT9L75OLaPwjFsY?utm_source=generator',
        extendedDescription: "This song is particularly special to me because it's a duet between me and my then-girlfriend, Ira. She had recommended the original (Bonnie Tyler's classic 80s hit) and we both loved it. I thought it would be a great idea to do a duet cover, and somehow managed to convince her to sing it with me. It ended up being her debut in the music industry. We recorded our parts separately from our respective homes, and I had the pleasure of producing the track. Honestly, I think she far outshines me on this one. I used Ableton Live to produce the track, and added as many instruments as I could to keep it faithful to the original song.",
        type: 'Single'
    },
    {
        coverImage: '/music_covers/tu_hi_re.jpeg',
        title: 'Tu Hi Re',
        description: 'A soulful melody in Hindi',
        year: '2023',
        slug: 'tu-hi-re',
        spotifyEmbed: 'https://open.spotify.com/embed/track/6BfcrgoQu3GfIVGNvG5Y3a?utm_source=generator',
        extendedDescription: "This track was the idea of my friend, Harsita, who suggested I cover this beautiful song from the movie \"Bombay\". I was initially hesitant, having no experience with Hindi music, but I decided to give it a shot. She recorded the vocals with her good ol' wired earphones, and I was blown away by her talent. I produced the track with Ableton Live as always, and added simple guitar, piano, bass, and drums to complement her voice. I hope you enjoy it as much as we enjoyed making it.",
        type: 'Single'
    },
    {
        coverImage: '/music_covers/dancing_with_your_ghost.jpeg',
        title: 'Dancing with Your Ghost',
        description: 'An emotional ballad about loss and memory',
        year: '2022',
        slug: 'dancing-with-your-ghost',
        spotifyEmbed: 'https://open.spotify.com/embed/track/1Q9ewo6PDk16VAKwy8U6Ca?utm_source=generator',
        extendedDescription: 'Tired of hearing my own voice on most songs of mine, I decided to try something different. I had been listening to this song by Sasha Alex Sloane quite a lot and was inspired by her style. I contacted my friend, Harsita, who is a very talented singer, and asked her to sing this song. I produced the track with Ableton Live, adding guitar, piano, bass, and drums to create a rich soundscape, and send her the backing track. Harsita recorded her vocals with a pair of wired earphones, and it took a few takes to get it right. I then combined the two and mixed them. The final result almost makes it sound more professional than what I just described.',
        type: 'Single'
    },
    {
        coverImage: '/music_covers/looking_for_you.jpeg',
        title: 'Looking for You',
        description: 'AI vocals before AI was a thing',
        year: '2021',
        slug: 'looking-for-you',
        spotifyEmbed: 'https://open.spotify.com/embed/track/6FEybuWkEUpLWiotvembb9?utm_source=generator',
        extendedDescription: 'This song was created using Vocaloid, a vocal synthesis software. I was experimenting with the software and decided to create a song that captures the feeling of searching for someone special. Ironically, the singer does not exist. The song is in the EDM style and features a catchy melody and upbeat production.',
        type: 'Single'
    },
    {
        coverImage: '/music_covers/sweet_16.jpeg',
        title: 'Sweet 16',
        description: 'The debut album of a young artist',
        year: '2021',
        slug: 'sweet-16',
        spotifyEmbed: 'https://open.spotify.com/embed/album/2BcEU4Jp7w3ppTV5p7NuB9?utm_source=generator',
        extendedDescription: 'This was my debut full length album, released on my 16th birthday. It was a labor of love, featuring a mix of genres and styles that reflect my musical journey up to that point, drawing inspiration from the random assortment of artists and genres I had been listening to. The album contains a variety of songs, from gritty rock songs like Fly to Space, to haunting stories like Lost, and ending with a sorrowful ballad like My Time Has Come. It even features with fellow artist and a junior from school, Zady, on the poetic track Oblivion, whose lyrics were written by a friend who wished to remain anonymous. I recorded some songs with my phone from that time, and some with the iPad Air\'s microphone. I produced the album using a mix of Garageband and Ableton Live, and it was a great learning experience for me as a young artist.',
        type: 'Album'
    },
    {
        coverImage: '/music_covers/covers_one.jpeg',
        title: 'Covers One',
        description: 'A collection of covers of popular songs',
        year: '2020',
        slug: 'covers-one',
        spotifyEmbed: 'https://open.spotify.com/embed/album/7Hu2HsEM2D7xwEdXz8m302?utm_source=generator',
        extendedDescription: 'This EP features stripped-down acoustic versions of popular songs, reimagined with unique arrangements and intimate vocals. The piano for each track was played by me, and then I added the other instruments using the MIDI editor. Each track brings a personal touch to well-loved classics from various genres.',
        type: 'EP'
    },
    {
        coverImage: '/music_covers/one_day.jpeg',
        title: 'One Day',
        description: 'A journey from morning to night',
        year: '2020',
        slug: 'one-day',
        spotifyEmbed: 'https://open.spotify.com/embed/album/2IdH2wPrPUvtAhaYBmJS8l?utm_source=generator',
        extendedDescription: 'An introspective EP exploring the passage of time. All the tracks are instrumental, and were mostly unplanned jamming sessions where I just connected my iPad (Garageband) to my piano, hit record and played impromptu.',
        type: 'EP'
    },
    {
        coverImage: '/music_covers/light_the_fire.jpeg',
        title: 'Light the Fire',
        description: 'An uplifting rock song with slick guitar riffs',
        year: '2020',
        slug: 'light-the-fire',
        spotifyEmbed: 'https://open.spotify.com/embed/track/5IlJ3TyOpj1A50SQrFOwxz?utm_source=generator',
        extendedDescription: 'Being my first release ever, this energetic single captures the spirit of perseverance and inner strength. With driving rhythms and powerful vocals, it encourages listeners to pursue their passions and overcome obstacles. The chord progression for this had been in my mind for a year or so, I just had to finetune the lead and vocals for this, and then I set out to start my musical journey. Piano played by hand by me, then guitar derived from it in software, and the guitar solo was created in Sibelius.',
        type: 'Single'
    }
];
