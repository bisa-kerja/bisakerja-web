"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Marquee, { type CardT } from "@/components/ui/demo";
import { Features } from "@/components/blocks/features";

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const steps = [
  "Find jobs that match your interests and experience.",
  "Filter opportunities by job type, salary, location, and level.",
  "Review your CV with AI to make your application stand out.",
  "Save the best jobs and proceed with the application process.",
];

const testimonialRows: CardT[][] = [
  [
    {
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      name: "Nadia Putri",
      handle: "Fresh Graduate",
      quote:
        "I found out which vacancies are realistic for entry-level, as well as the parts of my CV that need to be improved before applying.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      name: "Arman Rizky",
      handle: "Frontend Developer",
      quote:
        "The job filter is neat. I can directly compare remote, hybrid, and salary ranges without jumping to other platforms.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      name: "Sekar Ayu",
      handle: "Career Switcher",
      quote:
        "AI CV Analyzer really helped connect my past experience to a new, more relevant role.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      name: "Dimas Pratama",
      handle: "Product Designer",
      quote:
        "Profile recommendations helped me quickly see which vacancies are worth prioritizing.",
    },
  ],
  [
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80",
      name: "Raka Mahendra",
      handle: "Backend Engineer",
      quote:
        "The detailed skill match helped me understand why one role makes more sense than another.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
      name: "Ayu Lestari",
      handle: "Data Analyst",
      quote:
        "I was able to rearrange my CV more confidently because the recommendations felt very practical.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      name: "Maya Sari",
      handle: "Marketing Associate",
      quote:
        "BisaKerja makes the job search process feel more directed, especially when having to choose from many vacancies.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      name: "Laras Wibowo",
      handle: "UI Designer",
      quote:
        "The CV analysis section helped me highlight the most relevant projects for a design position.",
    },
  ],
];

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col bg-white text-gray-950"
      style={{ colorScheme: "light" }}
    >
      <Navbar />

      <main className="flex-1">
        <section
          className="overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: "url(/bg-dotted.svg)",
            backgroundRepeat: "repeat",
          }}
        >
          <ContainerScroll
            titleComponent={
              <div className="mx-auto max-w-4xl px-6 lg:pt-10 pt-54 md:px-8">
                <h1 className="text-5xl font-bold leading-tight text-gray-950 sm:text-5xl lg:text-[4rem]">
                  Let AI Find The Jobs That{" "}
                  <span className="relative inline-block whitespace-nowrap">
                    Best Match
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-full w-full overflow-visible"
                      viewBox="0 0 280 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 10.5C25 3.5 50 13 75 7C100 1 125 12 150 6C175 0 200 11 225 5C247 0 263 9.5 278 7"
                        stroke="#2563EB"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>{" "}
                  With Your CV.
                </h1>
                <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                  BisaKerja helps you find relevant vacancies, understand your
                  CV quality, and make application decisions more confidently.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row mb-24">
                  <Link
                    href="/jobs"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-blue-700"
                  >
                    <SearchIcon />
                    Search Jobs
                  </Link>
                  <Link
                    href="/ai-cv-analyzer"
                    className="inline-flex h-12 items-center bg-white justify-center gap-2 rounded-lg border border-gray-200 px-5 text-sm font-semibold text-blue-700 no-underline transition-colors hover:bg-white/20"
                  >
                    Free CV Analysis
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            }
          >
            <div className="relative h-full w-full">
              <video
                src="/screenshots/hero.MOV"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute -bottom-0 -right-10 hidden sm:block">
                <Image
                  src="/maskots/wave.png"
                  alt="BisaKerja Statistics Mascot"
                  width={220}
                  height={220}
                  priority
                  className="drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))" }}
                />
              </div>
            </div>
          </ContainerScroll>
        </section>
        <section className="bg-white px-6 py-14 md:px-8">
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">
                Built for a more focused application process.
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                From exploring vacancies to evaluating your CV, every step is
                designed so you know what to do next.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-lg border border-gray-200 bg-white p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-gray-800">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Features />

        <section className="bg-white px-6 py-14 md:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <h2 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">
                  User stories that Feeling more prepared when choosing
                  opportunities.
                </h2>
              </div>
            </div>
            <div className="mt-8 overflow-hidden">
              <Marquee row1={testimonialRows[0]} row2={testimonialRows[1]} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
