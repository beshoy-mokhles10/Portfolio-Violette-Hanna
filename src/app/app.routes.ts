import { Routes } from '@angular/router';
import { BlogPost } from './pages/blog-post';
import { Blogs } from './pages/blogs';
import { Contact } from './pages/contact';
import { Home } from './pages/home';
import { Legal } from './pages/legal';
import { Packages } from './pages/packages';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'blogs', component: Blogs },
  { path: 'blogs/:slug', component: BlogPost },
  { path: 'packages', component: Packages },
  { path: 'contact-us', component: Contact },
  { path: 'privacy-policy', component: Legal, data: { doc: 'privacy' } },
  { path: 'terms-and-conditions', component: Legal, data: { doc: 'terms' } },
  { path: '**', redirectTo: '' }
];
