# GoTicket Next.js Demo

Demo Next.js de deploy len Vercel, gom 3 giao dien:

- Customer portal
- Admin dashboard
- Vendor portal

Tat ca du lieu trong demo la fake data, duoc tao theo object tu backend (`back-end/app/Models` va `back-end/database/migrations`).

## Cac route demo

- `/` : Front-end goc (dist)
- `/book`, `/sign-in`, `/sign-up`, `/check-out`, `/about`, `/profile` : Front-end goc (react-router)
- `/admin` : Admin dashboard goc (dist)
- `/vendor` : Vendor dashboard goc (EJS render static)
- `/legacy` : Thong tin source copy tu 3 thu muc goc

## Fake API da them

Tat ca endpoint chay tren cung domain Vercel qua prefix `/api`:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/myinfo`
- `PUT /api/auth/myinfo`
- `GET /api/routes/location`
- `GET /api/trips/search`
- `GET /api/trips/:id`
- `GET /api/trips/:id/stops`
- `POST /api/bookings/initiate`
- `POST /api/bookings/confirm`
- `GET /api/blogs`
- `GET /api/blogs/:id`

## Tai khoan demo mac dinh

- Customer: `customer@demo.local` / `123456`
- Admin: `admin@demo.local` / `123456`
- Vendor: `vendor@demo.local` / `123456`

Ban co the dang ky tai khoan moi bang API `POST /api/auth/register`.

## Source copy theo yeu cau

Da copy toan bo vao:

- `nextjs-demo/legacy/front-end`
- `nextjs-demo/legacy/admin-dashboard`
- `nextjs-demo/legacy/vendor-front-end`

## Chay local

```bash
npm install
npm run dev
```

## Build kiem tra deploy

```bash
npm run build
```

## Deploy Vercel

1. Push `nextjs-demo` len GitHub.
2. Import project vao Vercel.
3. Framework preset: Next.js.
4. Build command: `npm run build`.
5. Output: `.next` (mac dinh Next.js).
