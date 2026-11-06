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

export type WallCategory = 'Portraits' | 'Weddings' | 'Commercial' | 'Landscape' | 'Events';

/** TODO(violette): titles and categories are sample ones; set them to her own. */
export const WALL: { image: string; alt: string; title: string; category: WallCategory }[] = [
  { image: 'assets/img/n-snow.jpg', alt: 'Snow-capped mountains above green farmland', title: 'First Snow', category: 'Landscape' },
  { image: 'assets/img/p-elder-2.jpg', alt: 'Black-and-white portrait of an older man', title: 'A Long Story', category: 'Portraits' },
  { image: 'assets/img/n-still-lake.jpg', alt: 'A calm lake below a pine-covered shore', title: 'Still Water', category: 'Landscape' },
  { image: 'assets/img/c-band.jpg', alt: 'A black fitness band on a neutral ground', title: 'Everyday Carry', category: 'Commercial' },
  { image: 'assets/img/e-stage.jpg', alt: 'A performer silhouetted against stage lights', title: 'Stage Lights', category: 'Events' },
  { image: 'assets/img/n-palms.jpg', alt: 'Palm trees silhouetted at sunset', title: 'Last Light', category: 'Landscape' },
  { image: 'assets/img/n-lake-pines.jpg', alt: 'Pine trees along a blue mountain lake', title: 'Blue Hour Shore', category: 'Landscape' },
  { image: 'assets/img/w-reeds.jpg', alt: 'A bride among tall reeds by the water', title: 'Among the Reeds', category: 'Weddings' },
  { image: 'assets/img/p-classic.jpg', alt: 'A classic black-and-white studio portrait', title: 'Classic', category: 'Portraits' },
  { image: 'assets/img/e-celebration.jpg', alt: 'Guests in flower garlands at a celebration', title: 'Garlands', category: 'Events' },
  { image: 'assets/img/n-forest.jpg', alt: 'Sunlight breaking through a dark forest', title: 'Forest Light', category: 'Landscape' },
  { image: 'assets/img/c-still.jpg', alt: 'Cosmetics arranged on a blue surface', title: 'Morning Shelf', category: 'Commercial' },
  { image: 'assets/img/w-shore.jpg', alt: 'A bride on a wooden pier beside a lake', title: 'The Pier', category: 'Weddings' }
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

export interface Package {
  name: string;
  tagline: string;
  price: string;
  length: string;
  features: string[];
  featured?: boolean;
}

/** TODO(violette): sample packages and prices. Replace with her own, and keep the FAQ below in step. */
export const PACKAGES: Package[] = [
  {
    name: 'Mini Session',
    tagline: 'A short, relaxed shoot for one moment.',
    price: 'From $000',
    length: '1 hour',
    features: ['One location', '15 edited photographs', 'Private online gallery', 'Print release']
  },
  {
    name: 'Signature Session',
    tagline: 'The one most people choose.',
    price: 'From $000',
    length: '2.5 hours',
    features: ['Up to two locations', '40 edited photographs', 'Private online gallery', 'Three fine-art prints', 'Print release'],
    featured: true
  },
  {
    name: 'The Full Story',
    tagline: 'A whole day, from first light to last.',
    price: 'From $000',
    length: 'Half a day',
    features: ['As many locations as fit the day', '80 or more edited photographs', 'Private online gallery', 'A printed album', 'Print release']
  }
];

export const EVERY_SESSION = [
  { title: 'A planning call', text: 'We talk through the light, the place and what you want to remember.' },
  { title: 'Careful editing', text: 'Every photograph is colour-graded by hand, never filtered in bulk.' },
  { title: 'A private gallery', text: 'Yours to view, share and download, kept online for a year.' },
  { title: 'A reply in 24 hours', text: 'Every message is answered personally.' }
];

export const FAQ = [
  { q: 'How do I book?', a: 'Send a request through the booking form. Choose the kind of shoot and when you are thinking of it, and I will reply within 24 hours to confirm the details.' },
  { q: 'When will I get my photographs?', a: 'Usually within two weeks of the shoot. Weddings and larger projects take a little longer, and I will tell you the date up front.' },
  { q: 'What if it rains?', a: 'We move the shoot to another day at no cost. Soft, grey light can be beautiful too, so we decide together on the day.' },
  { q: 'Do you travel?', a: 'Yes. Shoots in the city are included, and further places are arranged with a small travel fee agreed beforehand.' },
  { q: 'Do you offer weddings and commercial work?', a: 'Both, and each is quoted on its own, because no two are alike. Send a request and describe what you have in mind.' }
];
