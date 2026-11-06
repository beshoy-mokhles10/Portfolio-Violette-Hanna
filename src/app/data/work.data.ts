export interface Print {
  image: string;
  title: string;
  note: string;
}

/**
 * TODO(violette): placeholders from Wikimedia Commons (see IMAGE-CREDITS.md).
 * Replace every image with her own photograph before publishing.
 */
export const COLLECTION: Print[] = [
  { image: 'assets/img/w-bride-field.jpg', title: 'The Quiet Before', note: 'A bride alone with her bouquet, a minute before everything starts.' },
  { image: 'assets/img/p-woman-profile.jpg', title: 'Side Light', note: 'A portrait in profile, shaped by nothing more than a bright window.' },
  { image: 'assets/img/c-watch.jpg', title: 'Time Piece', note: 'One watch on a dark ground, lit to show the texture of the dial.' },
  { image: 'assets/img/n-lake-peak.jpg', title: 'High Water', note: 'A still mountain lake holding the whole sky for a moment.' },
  { image: 'assets/img/p-elder.jpg', title: 'A Long Story', note: 'Every line in a face, kept in rather than retouched out.' },
  { image: 'assets/img/w-bride-veil.jpg', title: 'Caught by the Wind', note: 'The veil decided where this picture was going.' },
  { image: 'assets/img/c-cosmetics.jpg', title: 'Morning Shelf', note: 'A clean product set, arranged so each piece can breathe.' },
  { image: 'assets/img/n-valley.jpg', title: 'The Far Ridge', note: 'Layers of valley and cloud under a slow afternoon.' },
  { image: 'assets/img/p-studio.jpg', title: 'Full Colour', note: 'A studio portrait built around the colour of what she wore.' },
  { image: 'assets/img/w-rings.jpg', title: 'Small Things', note: 'Two rings, one open hand: the detail people ask for years later.' },
  { image: 'assets/img/n-acacia.jpg', title: 'Last Light', note: 'One tree against the end of the day, and no reason to hurry.' }
];

export const WALL: { image: string; alt: string }[] = [
  { image: 'assets/img/n-snow.jpg', alt: 'Snow-capped mountains above green farmland' },
  { image: 'assets/img/p-elder-2.jpg', alt: 'Black-and-white portrait of an older man' },
  { image: 'assets/img/n-still-lake.jpg', alt: 'A calm lake below a pine-covered shore' },
  { image: 'assets/img/c-band.jpg', alt: 'A black fitness band on a neutral ground' },
  { image: 'assets/img/e-stage.jpg', alt: 'A performer silhouetted against stage lights' },
  { image: 'assets/img/n-palms.jpg', alt: 'Palm trees silhouetted at sunset' },
  { image: 'assets/img/n-lake-pines.jpg', alt: 'Pine trees along a blue mountain lake' },
  { image: 'assets/img/w-reeds.jpg', alt: 'A bride among tall reeds by the water' },
  { image: 'assets/img/p-classic.jpg', alt: 'A classic black-and-white studio portrait' },
  { image: 'assets/img/e-celebration.jpg', alt: 'Guests in flower garlands at a celebration' },
  { image: 'assets/img/n-forest.jpg', alt: 'Sunlight breaking through a dark forest' },
  { image: 'assets/img/c-still.jpg', alt: 'Cosmetics arranged on a blue surface' },
  { image: 'assets/img/w-shore.jpg', alt: 'A bride on a wooden pier beside a lake' }
];

export const STEPS = [
  {
    title: 'Listen',
    text: 'Every shoot starts with a conversation: who it is for, what it should feel like, and what a good result looks like to you.'
  },
  {
    title: 'Plan',
    text: 'We settle the place, the light and the timing, and for commercial work the shot list, so the day itself can stay relaxed.'
  },
  {
    title: 'Capture',
    text: 'On the day I direct gently and watch closely, leaving room for the unplanned moment that turns out to be the best one.'
  },
  {
    title: 'Deliver',
    text: 'A careful selection, edited to stay true to the light it was shot in, and delivered ready to print, post or publish.'
  }
];

/**
 * TODO(violette): only real words from real clients belong here. The names,
 * photos and text below are stand-ins so the section can be reviewed.
 */
const SAMPLE_QUOTE =
  'This space is for a real message from a client: a few sentences in their own words about how the shoot felt, how they were looked after, and what it was like to see the photographs for the first time.';

export const TESTIMONIALS = [
  { role: 'Wedding client', avatar: 'w-bride-field' },
  { role: 'Portrait client', avatar: 'p-woman-profile' },
  { role: 'Brand client', avatar: 'p-elder' },
  { role: 'Event client', avatar: 'w-bride-veil' },
  { role: 'Wedding client', avatar: 'p-studio' },
  { role: 'Portrait client', avatar: 'p-classic' },
  { role: 'Product client', avatar: 'p-elder-2' },
  { role: 'Landscape print client', avatar: 'w-reeds' },
  { role: 'Event client', avatar: 'w-shore' },
  { role: 'Wedding client', avatar: 'e-celebration' }
].map(({ role, avatar }) => ({
  name: 'Client Name',
  role,
  avatar: `assets/img/${avatar}.jpg`,
  quote: SAMPLE_QUOTE
}));
