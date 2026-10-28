# Riaz Homoeo Clinic

```
riaz-homoeo-clinic/
├── backend/    Express + MongoDB API (.env yahin hai) — pehle jaisa
└── frontend/   React (Vite) — website + admin panel
```

## Backend
```
cd backend && npm install && npm start      # http://localhost:3000
```
(.env mein JWT_SECRET, ADMIN_USER, ADMIN_PASS zaroor badlein)

## Frontend (React)
```
cd frontend && npm install && npm run dev   # http://localhost:5173
npm run build                               # production build -> dist/
```
- Admin panel: http://localhost:5173/admin
- Backend address: `frontend/.env` mein `VITE_API_BASE` (default http://localhost:3000, example `.env.example` mein).
- Netlify deploy: `public/_redirects` pehle se maujood hai (/admin route ke liye).

## Main product ki 15s hover video
`frontend/src/config/featuredVideo.js` kholein — wahan commented placeholder hai.
Video `src/assets/` ya `public/videos/` mein rakhein, line uncomment karein. Bas.

## Urdu
Navbar mein "اردو" button. Poori Urdu Jameel Noori Kasheeda mein; sirf headings Noto Nastaliq Urdu (600) mein, Zaidi Homoeo Clinic jaisi.
Body font file `frontend/public/fonts/JameelNooriNastaleeqKasheeda.ttf` mein rakhein.
Dawaon ke Urdu naam: `frontend/src/data/productsUr.js`.
Text `src/i18n/ur.js` mein hai.

## Structure
```
src/
├── App.jsx, main.jsx, index.css, admin.css
├── context/StoreContext.jsx   products, cart, checkout, lightbox
├── components/                Navbar, Hero, About, FeaturedProduct, Products, ProductCard,
│                              ImageSlider, DxnSection, Gallery, OrderSection, LocationSection,
│                              Footer, CartSidebar, InfoModal, Lightbox
├── pages/Admin.jsx            admin.html ka React version
├── config/featuredVideo.js    hover video placeholder
└── data/gallery.js            gallery images
```

## Admin panel (v18 changes)
- `/admin` ab sidebar wala dashboard hai: Overview, Orders, Appointments, Products, Comments, Gallery. Settings tab hata diya gaya.
- **Comments**: admin sab comments dekh aur delete kar sakta hai (Comments tab).
- **Products par comments band** hain. Website par alag Comments section hai (`components/CommentsSection.jsx`, API `/api/bulk-comments`).
- **+ button** (neeche right): image upload karein ya gallery se chunein — website ki Gallery mein dikhti hain. Product form mein bhi "Add" se wahi picker khulta hai.
- Uploaded images MongoDB mein save hoti hain (`Media` model), koi naya package install nahi karna. Pehli dafa server chalne par `gallery.json` ki images library mein aa jati hain.

## Vercel deploy (2 alag projects)
1. **Backend** project: Root Directory = `backend`. Env vars: `MONGO_URI`, `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASS`, `CLIENT_URL` (frontend ka URL, end mein `/` ke baghair).
2. **Frontend** project: Root Directory = `frontend`, Framework = Vite. Env var: `VITE_API_BASE` = backend ka Vercel URL (end mein `/` ke baghair).
3. Dono ke `vercel.json` pehle se maujood hain. Env vars badalne ke baad Redeploy karein.
