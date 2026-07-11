// app/page.tsx
"use client"; 
// حولناها لـ Client component عشان نستخدم الهوك بتاع الترجمة التفاعلي، ولأننا بنستخدم جافا سكريبت تفاعلي مع المستخدم جوه المتصفح

import LandingPage from "../features/landing/index";

export default function HomePage() {
  return (
    <>
      <LandingPage />
    </>
  );
}
//#572fd7