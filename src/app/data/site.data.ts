/** TODO(violette): every contact value here is a placeholder. Fill in the real ones. */
export const SITE = {
  name: 'Violette Hanna',
  shortName: 'Violette',
  /** The real domain goes here, in index.html, sitemap.xml and robots.txt. */
  url: 'https://portfolio-violette-hanna.vercel.app',
  tagline: ['Every Frame Tells Someone’s Story.', 'See the world through the lens of Violette Hanna.'],
  email: 'hello@example.com',
  phone: '01123301880',
  location: '[Street, City, Country]',
  days: '[Working days]',
  hours: '[Working hours]',
  socials: [
    { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1CP7QZUk2h/' },
    { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/violette.bluegreenred' },
    { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' }
  ],
  /**
   * EmailJS keys for the contact form. While any is empty, the form opens the
   * visitor's mail client with their message filled in instead.
   */
  emailjs: { serviceId: '', templateId: '', publicKey: '' }
} as const;

export interface HomeLink {
  label: string;
  /** Section id on Home, or a route starting with '/'. */
  to: string;
}

export const QUICK_LINKS: HomeLink[] = [
  { label: 'About', to: 'about' },
  { label: 'Collection', to: 'collection' },
  { label: 'Process', to: 'process' },
  { label: 'Gallery', to: 'gallery' },
  { label: 'Blogs', to: '/blogs' },
  { label: 'Contact', to: '/contact-us' }
];

export const MENU_LINKS: (HomeLink & { note: string; image: string; icon: string })[] = [
  {
    label: 'About',
    to: 'about',
    icon: 'info',
    note: 'The photographer behind the lens, and how she works with whoever is in front of it.',
    image: 'assets/img/menu-about.jpg'
  },
  {
    label: 'Collection',
    to: 'collection',
    icon: 'book',
    note: 'Portraits, weddings, commercial work and landscapes, chosen frame by frame.',
    image: 'assets/img/w-bride-veil.jpg'
  },
  {
    label: 'Process',
    to: 'process',
    icon: 'aperture',
    note: 'What happens from the first message to the finished gallery.',
    image: 'assets/img/c-watch.jpg'
  },
  {
    label: 'Gallery',
    to: 'gallery',
    icon: 'image',
    note: 'More frames from every kind of shoot, on one curved wall.',
    image: 'assets/img/n-snow.jpg'
  },
  {
    label: 'Blogs',
    to: '/blogs',
    icon: 'layout',
    note: 'Notes on light, people, and getting ready for the camera.',
    image: 'assets/img/p-elder.jpg'
  }
];
