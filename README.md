# YiwuCommerce

Static HTML5, CSS3, and vanilla JavaScript rebuild for YiwuCommerce. The site is deployable to Vercel, cPanel, or any static host.

## Implementation map

- Pages: Home, About, Products, Product Details, Industries, Manufacturing, Quality Control, Logistics, News, FAQ, Careers, Contact, Request Quote, Download Center, Privacy Policy, Terms, Sitemap, and the protected Admin Dashboard.
- Home sections: hero, certification strip, company introduction, catalog categories, featured products, competitive advantages, industries served, supply-chain CTA, and global footer.
- Navigation: shared header links to About, Products, Industries, Company/Manufacturing, News, FAQ, Contact, and Request Quote. Footer adds Careers, Download Center, legal pages, and category links.
- Shared functions: header/footer rendering, responsive menu, product cards/grid, search and category filtering, product detail lookup, FAQ accordion, newsletter notice, contact/quote form notice.
- Data: `data/site-content.js` contains editable public copy, while `data/product-catalog-fallback.js` embeds the complete 122-product catalog. The site uses the CSV when available, then local storage, then the embedded catalog for offline or restricted environments.
- Backend contract: `supabase/schema.sql`, `supabase/policies.sql`, and `supabase/seed.sql` define PostgreSQL tables, RLS policies, storage buckets, and starter records.

## Run locally

Open `index.html` directly, or run `npm start` with Node.js installed. The static fallback catalog and forms work without configuration.

## cPanel deployment

1. In cPanel File Manager, open the domain document root, usually `public_html`.
2. Upload the project contents, preserving the `assets`, `css`, `data`, `js`, and `supabase` folders. Keep `admin.html` at the document root.
3. Enable HTTPS through cPanel SSL/TLS before using the admin page or collecting forms.
4. Copy the values from your Supabase project settings into `data/admin-config.js`: use the project URL and public anon key only. Never place a service-role key in this static site.
5. Run `supabase/schema.sql`, then `supabase/policies.sql`, then `supabase/seed.sql` in the Supabase SQL editor.
6. Create the first administrator in Supabase Auth, then set that user's `profiles.role` to `admin`. Open `/admin.html` to monitor live products, inquiries, and contact messages.

The dashboard is client-side but protected by Supabase Auth and RLS. A user without an `admin` profile role cannot read the monitoring tables. The public website continues to work with its embedded catalog when Supabase or the CSV is unavailable.

## Supabase setup

Create a project, run the SQL files in order, and expose only the project URL and public anonymous key through your hosting configuration. The service role key must remain server-side. Replace the demo form handler in `js/app.js` with Supabase REST requests after the project credentials are available.

## Asset note

The public runtime uses local assets under `assets/images`; no external asset host is required.
