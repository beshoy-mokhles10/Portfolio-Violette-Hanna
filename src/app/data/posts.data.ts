export interface Post {
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  minutes: number;
  image: string;
  /** The second, wider photo inside the article. */
  inset: string;
  intro: string[];
  stats: { value: string; label: string }[];
  sections: { heading: string; text: string; rulesTitle?: string; rules?: string[] }[];
  quote: string;
}

/** TODO(violette): sample articles with sample dates. Replace with her own, and keep sitemap.xml in step. */
export const POSTS: Post[] = [
  {
    slug: 'portraits',
    category: 'Portraits',
    excerpt: 'How to feel at ease in front of a camera, even if you never have before.',
    date: 'Oct 28, 2026',
    minutes: 4,
    image: 'assets/img/p-woman-profile.jpg',
    inset: 'assets/img/p-classic.jpg',
    intro: [
      'Almost everyone arrives at a portrait session with the same worry: they don’t know what to do with their hands, their face, or themselves.',
      'That isn’t your job. A portrait session is mostly a conversation with a camera nearby, and the good pictures tend to arrive once you stop waiting for them.'
    ],
    stats: [
      { value: '10', label: 'Minutes to settle in' },
      { value: '2', label: 'Outfits is plenty' },
      { value: '0', label: 'Poses to memorise' }
    ],
    sections: [
      { heading: 'Start With Talking', text: 'The first few minutes are not really for photographs. We talk, the room gets familiar, and the camera stops being the most interesting thing in it.' },
      {
        heading: 'What Makes It Work',
        text: 'A good portrait is usually simple. Soft light, a background that stays out of the way, and someone who feels they can just be there.',
        rulesTitle: 'A few things that help',
        rules: ['Wear something you already feel good in.', 'Bring a second option, in a different colour.', 'Sleep well and drink water the day before.', 'Tell me which angle of yourself you dislike.']
      },
      { heading: 'Choosing The Frames', text: 'The picture you like least in the moment is often the one everyone else loves. We look through the selection together, and your opinion comes first.' }
    ],
    quote: 'Nobody needs to know how to pose. That is my job.'
  },
  {
    slug: 'weddings-events',
    category: 'Weddings & Events',
    excerpt: 'Planning the timeline of a big day so the photographs can take care of themselves.',
    date: 'Oct 12, 2026',
    minutes: 5,
    image: 'assets/img/w-bride-veil.jpg',
    inset: 'assets/img/e-celebration.jpg',
    intro: [
      'A wedding or a big event moves quickly, and it never pauses for the camera. The best thing you can do for your photographs happens weeks before the day.',
      'A little planning around light and time leaves everyone free to enjoy themselves while the pictures happen around them.'
    ],
    stats: [
      { value: '30', label: 'Spare minutes to plan in' },
      { value: '1', label: 'Family list, in writing' },
      { value: '1', label: 'Person to help gather guests' }
    ],
    sections: [
      { heading: 'Build Around The Light', text: 'If there is one thing to plan the day around, it is the last hour before sunset. Fifteen minutes outside at that time can give you the frames you’ll print.' },
      {
        heading: 'Keep The Day Moving',
        text: 'Everything runs a little late, and that’s fine if the schedule expects it. Small buffers keep the mood easy, and an easy mood is what shows in the pictures.',
        rulesTitle: 'Worth sorting out early',
        rules: ['Share the timeline a week before the day.', 'Write down the family groupings you want.', 'Ask one friend to help round people up.', 'Check any rules the venue has about photography.']
      },
      { heading: 'Let It Happen', text: 'Once the day begins, forget the camera. The reactions nobody planned are what you’ll go back to, and they only happen when no one is performing.' }
    ],
    quote: 'The moments you will keep are the ones nobody scheduled.'
  },
  {
    slug: 'products-commercial',
    category: 'Products & Commercial',
    excerpt: 'What to prepare so a product shoot gives your brand images it can really use.',
    date: 'Sep 24, 2026',
    minutes: 4,
    image: 'assets/img/c-watch.jpg',
    inset: 'assets/img/c-still.jpg',
    intro: [
      'A product photograph has one job: to make someone understand and want the thing in front of them. That starts with knowing where the image is going to live.',
      'A website banner, a social post and a printed catalogue all ask for different framing, so the brief matters as much as the lighting does.'
    ],
    stats: [
      { value: '3', label: 'Formats to plan for' },
      { value: '1', label: 'Clear brief' },
      { value: '2', label: 'Spare samples, if possible' }
    ],
    sections: [
      { heading: 'Begin With The Brief', text: 'Before any lights go up we agree on the audience, the channels and the feeling of the brand. A short list of references does more than a long description.' },
      {
        heading: 'Prepare The Product',
        text: 'A camera sees every scratch and fingerprint. A few minutes of preparation saves far more time in editing, and keeps the final image honest.',
        rulesTitle: 'Before the shoot',
        rules: ['Send clean, undamaged samples.', 'List every format and size you’ll need.', 'Share your brand colours and fonts.', 'Leave room in the frame for your text.']
      },
      { heading: 'Think In A Set', text: 'A single hero image is rarely enough. Planning a set with close-ups, details and context gives your team material for months rather than one launch.' }
    ],
    quote: 'Know where an image will live before you decide how to light it.'
  },
  {
    slug: 'nature-landscape',
    category: 'Nature & Landscape',
    excerpt: 'Why the best landscape pictures are mostly a matter of arriving early and staying late.',
    date: 'Sep 3, 2026',
    minutes: 3,
    image: 'assets/img/n-valley.jpg',
    inset: 'assets/img/n-lake-pines.jpg',
    intro: [
      'A landscape can’t be directed. You can’t ask a cloud to move or a sunset to wait, so the whole craft comes down to being there when it happens.',
      'That means checking the weather and walking the location, and then doing the hardest part, which is standing still for a long time.'
    ],
    stats: [
      { value: '2', label: 'Good hours in a day' },
      { value: '1', label: 'Scouting walk first' },
      { value: '10', label: 'Minutes more than you’d think' }
    ],
    sections: [
      { heading: 'Scout First', text: 'Walk the place the evening before if you can. Knowing where the sun will come up means you spend the good light shooting instead of searching.' },
      {
        heading: 'Stay A Little Longer',
        text: 'Most people pack up as the sun drops. The colour that arrives ten minutes later is often the best of the day, and you’ll have it to yourself.',
        rulesTitle: 'Simple habits',
        rules: ['Check the forecast, then expect it to be wrong.', 'Keep the horizon level.', 'Put something near the lens for depth.', 'Leave the place exactly as you found it.']
      },
      { heading: 'Leave It Better', text: 'A photograph of a place is also an invitation to it. Stay on the paths, take your rubbish with you, and leave the landscape ready for the next person.' }
    ],
    quote: 'You can’t direct a landscape. You can only be there when it happens.'
  }
];
