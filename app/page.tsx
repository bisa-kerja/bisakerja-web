"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/public/assets/workspace.png";
import analyzerImage from "@/public/assets/design-tool.png";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

const stats = [
  { value: "10K+", label: "Lowongan aktif" },
  { value: "800+", label: "Perusahaan mitra" },
  { value: "92%", label: "Rekomendasi lebih relevan" },
];

const features = [
  {
    title: "Lowongan yang mudah disaring",
    description: "Temukan pekerjaan berdasarkan posisi, tipe kerja, level pengalaman, dan urutan gaji tanpa membuka banyak tab.",
    icon: <BriefcaseIcon />,
  },
  {
    title: "AI CV Analyzer",
    description: "Unggah CV untuk melihat bagian yang perlu diperkuat, kata kunci yang hilang, dan rekomendasi peran yang cocok.",
    icon: <ChartIcon />,
  },
  {
    title: "Pencarian lebih pasti",
    description: "Simpan lowongan, cek detail pekerjaan, lalu lanjutkan proses lamaran dengan informasi yang lebih lengkap.",
    icon: <ShieldIcon />,
  },
];

const steps = [
  "Cari lowongan yang sesuai dengan minat dan pengalamanmu.",
  "Saring peluang berdasarkan tipe kerja, gaji, lokasi, dan level.",
  "Periksa CV dengan AI agar lamaranmu lebih tajam.",
  "Simpan pekerjaan terbaik dan lanjutkan proses apply.",
];

const jobCategories = [
  "Software Engineer",
  "Data Analyst",
  "UI/UX Designer",
  "Product Manager",
  "Digital Marketing",
  "Customer Success",
];

const testimonials = [
  {
    name: "Nadia Putri",
    role: "Fresh Graduate",
    quote: "Aku jadi tahu lowongan mana yang realistis buat entry-level, sekaligus bagian CV yang harus diperbaiki sebelum apply.",
  },
  {
    name: "Arman Rizky",
    role: "Frontend Developer",
    quote: "Filter pekerjaannya rapi. Bisa langsung bandingin remote, hybrid, dan range gaji tanpa bolak-balik platform lain.",
  },
  {
    name: "Sekar Ayu",
    role: "Career Switcher",
    quote: "AI CV Analyzer bantu banget buat nyambungin pengalaman lama ke role baru yang lebih relevan.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-950" style={{ colorScheme: "light" }}>
      <Navbar />

      <main className="flex-1">
        <section className="overflow-hidden bg-white">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-6 py-12 md:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                Platform karir untuk pencari kerja Indonesia
              </div>
              <h1 className="text-4xl font-bold leading-tight text-gray-950 sm:text-5xl lg:text-[58px]">
                Cari kerja lebih fokus, dari CV sampai lowongan yang cocok.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
                BisaKerja membantu kamu menemukan lowongan relevan, memahami kualitas CV, dan mengambil keputusan apply dengan lebih percaya diri.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/loker"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-blue-700"
                >
                  <SearchIcon />
                  Cari Lowongan
                </Link>
                <Link
                  href="/ai-cv-analyzer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-sm font-semibold text-blue-700 no-underline transition-colors hover:bg-blue-50"
                >
                  Analisis CV Gratis
                  <ArrowRightIcon />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
                {stats.map((item) => (
                  <div key={item.label}>
                    <p className="text-2xl font-bold text-gray-950">{item.value}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-blue-950">
              <Image
                src={heroImage}
                alt="Pencari kerja menggunakan BisaKerja untuk mencari lowongan"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-lg bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,0.2)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Rekomendasi hari ini</p>
                    <p className="mt-1 text-lg font-bold text-gray-950">Frontend Developer</p>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">87% cocok</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Remote", "Full-time", "Entry Level"].map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-gray-200 bg-gray-50">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-3 px-6 py-5 md:grid-cols-6 md:px-8">
            {jobCategories.map((category) => (
              <Link
                key={category}
                href="/loker"
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 no-underline transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white px-6 py-14 md:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Fitur utama</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">Semua yang kamu butuhkan sebelum apply.</h2>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-gray-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-6 py-14 md:px-8">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Alur pencarian</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">Dibuat untuk proses apply yang lebih terarah.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Mulai dari eksplorasi lowongan sampai evaluasi CV, setiap langkah dibuat agar kamu tahu apa yang perlu dilakukan berikutnya.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div key={step} className="rounded-lg border border-gray-200 bg-white p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-gray-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-14 md:px-8">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={analyzerImage}
                alt="Analisis CV dengan rekomendasi karir"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">AI CV Analyzer</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">Perbaiki CV sebelum peluang bagus lewat.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Dapatkan penilaian menyeluruh untuk struktur CV, pengalaman, pencapaian, kata kunci, dan rekomendasi karir yang sesuai profilmu.
              </p>
              <div className="mt-6 grid gap-3">
                {["Analisis bagian penting CV", "Saran kata kunci sesuai role", "Rekomendasi karir yang bisa ditindaklanjuti"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <CheckIcon />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href="/ai-cv-analyzer"
                className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-blue-700"
              >
                Coba AI CV Analyzer
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-6 py-14 md:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Cerita pengguna</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">Lebih siap saat memilih peluang.</h2>
              </div>
              <Link href="/register" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-blue-700 no-underline hover:bg-blue-50">
                Mulai Sekarang
                <ArrowRightIcon />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article key={testimonial.name} className="rounded-lg border border-gray-200 bg-white p-6">
                  <p className="text-sm leading-7 text-gray-700">&quot;{testimonial.quote}&quot;</p>
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <p className="font-bold text-gray-950">{testimonial.name}</p>
                    <p className="mt-1 text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-blue-600 px-6 py-14 md:px-8">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Siap menemukan pekerjaan berikutnya?</h2>
              <p className="mt-3 text-base leading-7 text-blue-50">
                Jelajahi lowongan terbaru dan gunakan AI untuk membuat lamaranmu lebih kuat.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/loker" className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-5 text-sm font-bold text-blue-700 no-underline hover:bg-blue-50">
                Lihat Lowongan
              </Link>
              <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg border border-blue-300 px-5 text-sm font-bold text-white no-underline hover:bg-blue-700">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
