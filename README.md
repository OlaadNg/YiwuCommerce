# YiwuCommerce

Static HTML5, CSS3, and vanilla JavaScript rebuild for YiwuCommerce. The site is deployable to Vercel, cPanel, or any static host.

## Implementation map

- Pages: Home, About, Products, Product Details, Industries, Manufacturing, Quality Control, Logistics, News, FAQ, Careers, Contact, Request Quote, Download Center, Privacy Policy, Terms, and Sitemap.
- Home sections: hero, certification strip, company introduction, catalog categories, featured products, competitive advantages, industries served, supply-chain CTA, and global footer.
- Navigation: shared header links to About, Products, Industries, Company/Manufacturing, News, FAQ, Contact, and Request Quote. Footer adds Careers, Download Center, legal pages, and category links.
- Shared functions: header/footer rendering, responsive menu, product cards/grid, search and category filtering, product detail lookup, FAQ accordion, newsletter notice, contact/quote form notice.
- Data: `data/site-content.js` contains editable public copy and fallback records. CSV exports remain available as source material for a full import.
- Backend contract: `supabase/schema.sql`, `supabase/policies.sql`, and `supabase/seed.sql` define PostgreSQL tables, RLS policies, storage buckets, and starter records.

## Run locally

Open `index.html` directly, or run `npm start` with Node.js installed. The static fallback catalog and forms work without configuration.

## Supabase setup

Create a project, run the SQL files in order, and expose only the project URL and public anonymous key through your hosting configuration. The service role key must remain server-side. Replace the demo form handler in `js/app.js` with Supabase REST requests after the project credentials are available.

## Asset note

The public runtime uses local assets under `assets/images`; no external asset host is required.
