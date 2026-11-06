# Violette Hanna — Photographer Portfolio

موقع بورتفوليو لمصوّرة، تخطيطه وحركاته على طراز قالب Wildora، بمحتوى وصور وهوية خاصة بـ Violette.
مبني بنفس تنظيم Portfolio-Me: Angular 21 مع standalone components وsignals وzoneless وLenis للسكرول.

## التشغيل

```bash
npm install
npm start        # http://localhost:4200
npm run build    # الناتج في dist/violette-hanna/browser
```

## الهيكل

```
src/app/
  core/      scene (الحركة مع السكرول), smooth-scroll, nav, seo
  data/      site (التواصل والروابط) · work (الصور والخطوات والآراء) · posts (المقالات)
  sections/  navbar, hero, statement, story, collection, process, gallery, blog-section, testimonials, footer
  pages/     home, blogs, blog-post, contact, legal
  shared/    forest, leaves, lens, logo, page-hero, post-card, icon, reveal
```

## المطلوب قبل النشر

دوّر على `TODO(violette)` في الكود.

| المطلوب | المكان |
|---|---|
| الصور: كلها مؤقتة من Wikimedia Commons، ولازم تتبدل بصور Violette (التفاصيل في `IMAGE-CREDITS.md`) | `public/assets/img/` |
| الإيميل، الهاتف، العنوان، المواعيد، السوشيال | `src/app/data/site.data.ts` |
| مفاتيح EmailJS (لحد ما تتحط، الفورم بيفتح برنامج الإيميل) | `src/app/data/site.data.ts` |
| آراء عملاء حقيقية | `src/app/data/work.data.ts` |
| لوجوهات العملاء في الشريط البني | `src/app/sections/hero.ts` |
| المقالات والتواريخ | `src/app/data/posts.data.ts` |
| مراجعة نصوص الخصوصية والشروط | `src/app/pages/legal.ts` |
| الدومين الحقيقي بدل `violette-hanna.vercel.app` | `index.html`, `site.data.ts`, `sitemap.xml`, `robots.txt` |
