# 🎓 Studivo — Smart Service Marketplace

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Live_Demo-Coming_Soon-black?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🗂️ Architectural Breakdown

```
studivo/
├── app/                        # Next.js 15 App Router root
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx              # Root layout (theme + locale providers)
│   └── page.tsx                # Entry page
│
├── features/                   # Domain-driven feature modules
│   ├── marketplace/            # Core marketplace logic & UI
│   └── orders/                 # Order management flows
│
├── public/                     # Static assets
│
└── shared/                     # Cross-cutting concerns
    ├── components/
    │   ├── LangToggle.tsx      # Arabic / English switcher
    │   ├── ThemeProvider.tsx   # next-themes provider wrapper
    │   └── ThemeToggle.tsx     # Dark / Light mode toggle
    ├── hooks/
    │   └── useTranslation.ts   # Locale-aware translation hook
    └── lib/
        └── translations.ts     # Static translation map (i18n keys)
```

---

## 📖 About The Project

**Studivo** flips the traditional service-marketplace model on its head.

On conventional platforms, providers list their services and clients browse passively. Studivo reverses this dynamic: **the student or client defines exactly what they need**, specifying requirements, parameters, and constraints — and the intelligent dispatch core matches those requirements against a pool of verified service providers in real time.

This demand-first architecture eliminates irrelevant listings, reduces negotiation overhead, and puts precision at the center of every transaction. Whether a student needs a custom tutoring plan, a design asset, or a technical deliverable, Studivo surfaces the right provider for the exact job — not a generic approximation.

---

## ✨ Core Features Implemented

- **🌗 Dynamic Theme Switching** — Seamless Dark / Light mode powered by `next-themes` and Tailwind v4's CSS variable system. A skeleton loader wrapper prevents hydration layout shift (FOUC) on first paint.

- **🌐 Full Bilingual Localization (i18n)** — Complete Arabic and English support following the `next-intl` architectural pattern. Layout direction flips automatically between RTL (Arabic) and LTR (English) at the root layout level, ensuring typographically correct rendering in both languages.

- **🏗️ Feature-Driven Architecture** — The codebase is organized around three clear zones: `app/` owns routing and global providers, `features/` encapsulates isolated domain logic (marketplace, orders), and `shared/` houses reusable components, hooks, and utilities consumed across all features. This separation enforces low coupling and high cohesion as the product scales.

---

## 🛠️ Tech Stack

| Technology | Icon | Primary Responsibility |
|---|---|---|
| **Next.js 15** | ![Next.js](https://img.shields.io/badge/-000000?logo=nextdotjs&logoColor=white&style=flat-square) | App Router, SSR, routing, layout system |
| **Tailwind CSS v4** | ![Tailwind](https://img.shields.io/badge/-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square) | Utility-first styling, CSS variables, RTL support |
| **TypeScript** | ![TypeScript](https://img.shields.io/badge/-3178C6?logo=typescript&logoColor=white&style=flat-square) | Static typing across the entire codebase |
| **next-themes** | ![next-themes](https://img.shields.io/badge/-000000?logo=vercel&logoColor=white&style=flat-square) | Dark / Light theme provider with SSR safety |
| **next-intl** | ![next-intl](https://img.shields.io/badge/-0A7EA4?logo=googletranslate&logoColor=white&style=flat-square) | i18n architecture, locale routing, RTL/LTR switching |
| **Lucide React** | ![Lucide](https://img.shields.io/badge/-F56565?logo=lucide&logoColor=white&style=flat-square) | Consistent, accessible icon system |

---

## 🚀 Local Installation & Setup

Follow these steps to run Studivo locally:

```bash
# 1. Navigate into the project directory
cd graduation-project

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Status

> 🚧 **Active Development** — Core architecture is stable. Marketplace and order dispatch features are currently being built out.

---

<p align="center">
  Built with intention by <a href="https://portfolio-woad-three-36.vercel.app/">Eyad Makboul</a> · AI-assisted development workflow
</p>
