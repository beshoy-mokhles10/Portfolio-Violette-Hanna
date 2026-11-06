# Violette Hanna — Photographer Portfolio

موقع بورتفوليو لمصوّرة، بمحتوى وصور وهوية خاصة بـ Violette. تصميم وتطوير Beshoy Mokhles.
مبني بـ Angular 21 مع standalone components وsignals وzoneless وLenis للسكرول، وبيتنشر على Vercel.

## التشغيل

```bash
npm install
npm start        # http://localhost:4200
npm run build    # الناتج في dist/violette-hanna/browser
```

كل push على فرع `main` بيتنشر تلقائيًا على Vercel (الإعدادات في `vercel.json`).

## الهيكل

```
src/app/
  core/      scene (الحركة مع السكرول), smooth-scroll, nav, intro, seo
  data/      site (التواصل والروابط) · work (الصور والتصنيفات والآراء) · posts (المقالات)
  sections/  navbar, hero, statement, story, collection, process,
             gallery (صورة كبيرة بتتغير لوحدها + تصنيفات), blog-section, testimonials, footer
  pages/     home, blogs, blog-post, contact, booking-form (فورم الحجز بـ 3 خطوات), legal
  shared/    lightbox (عارض الصور), forest, leaves, lens, logo, page-hero, post-card, icon, reveal
public/
  og-image.jpg   صورة معاينة اللينك على واتساب وفيسبوك (1200×630)
```

## ملاحظات

- معاينة اللينك (Open Graph) معرّفة في `src/index.html`، والدومين الحالي `portfolio-violette-hanna.vercel.app`.
- الجاليري بيعرض صور `WALL` في `work.data.ts`، وكل صورة ليها `title` و`category`، والضغط عليها بيفتح الـ Lightbox.
- فورم الحجز بيبعت عن طريق EmailJS لو المفاتيح موجودة في `site.data.ts`، وإلا بيفتح برنامج الإيميل عند الزائر.

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
| لو اتغير الدومين: حدّث كل مكان فيه `portfolio-violette-hanna.vercel.app` | `index.html`, `site.data.ts`, `sitemap.xml`, `robots.txt` |
| صورة المعاينة الخاصة بيها بدل صورة الـ Hero | `public/og-image.jpg` |
| أسماء وتصنيفات صور الجاليري | `src/app/data/work.data.ts` (`WALL`) |
