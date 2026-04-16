# Idarah Wali Ul Aser Management Portal

Official management portal for Idarah Wali Ul Aser and Maktab Wali Ul Aser, Chattergam Kashmir.
This portal supports student records, fee management, attendance tracking, academic schedules, notifications, and administrative reporting.

## Key Features

- User management for students, teachers, admins, and super-admins
- Fee tracking, receipt approval, and payment summaries
- Attendance management and schedule planning
- Notes upload and academic exam tracking
- Admin logs and system-level access control
- Firebase authentication and Firestore backend

## Tech Stack

- React 19
- Vite
- TypeScript
- Firebase Authentication + Firestore
- Material UI
- Recharts
- Tailwind CSS

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

This project reads Firebase settings from `firebase-applet-config.json`.
Ensure the file contains your Firebase project configuration, including the Firestore database ID.

If you need a new config file, copy the existing template or add your project values in `firebase-applet-config.json`.

### 3. Run the app locally

```bash
npm run dev
```

The app will start with Vite and should be available at `http://localhost:3000` by default.

## Scripts

- `npm run dev` — start development server
- `npm run build` — build production bundle
- `npm run preview` — preview production build locally
- `npm run clean` — remove `dist` output
- `npm run lint` — type check with TypeScript

## Notes

- Firebase rules are defined in `firestore.rules`.
- App authentication is handled via `src/firebase.ts` and `src/context/AuthContext.tsx`.
- Roles include `student`, `teacher`, `admin`, and `super-admin`.
