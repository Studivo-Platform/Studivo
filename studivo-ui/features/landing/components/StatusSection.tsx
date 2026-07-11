"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const stats = [
  { value: "12K+", label: "Active Students" },
  { value: "800+", label: "Verified Sellers" },
  { value: "15K+", label: "Requests Fulfilled" },
  { value: "9.9K+", label: "5-Star Reviews" },
];

export default function StatsSection() {
  return (
    <section id="sellers" className="border-y border-slate-200/80 dark:border-slate-800/80 py-12 bg-white/50 dark:bg-[#060913]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 4 }
          }}
          loop
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
        >
          {stats.map(({ value, label }) => (
            <SwiperSlide key={label}>
              <div className="text-center space-y-1">
                <p className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-cyan-400">
                  {value}
                </p>
                <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400">{label}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}