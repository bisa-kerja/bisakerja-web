import { Card, CardContent, CardHeader } from '@/components/ui/card'

import Image from 'next/image'

const trustedSources = [
    {
        name: 'Indeed',
        src: '/company-logo/indeed.png',
        width: 1280,
        height: 345,
    },
    {
        name: 'LinkedIn',
        src: '/company-logo/linkedin.png',
        width: 3475,
        height: 1075,
    },
    {
        name: 'Glints',
        src: '/company-logo/glints.png',
        width: 2000,
        height: 1000,
    },
    {
        name: 'JobStreet',
        src: '/company-logo/jobstreet.png',
        width: 1395,
        height: 275,
    },
    {
        name: 'Kalibrr',
        src: '/company-logo/kalibrr.png',
        width: 1395,
        height: 275,
    },
]

export function Features() {
    return (
        <section className="bg-white py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                        Everything you need, in one platform.
                    </h2>
                    <p className="mt-4 text-base text-gray-600">
                        From job search to CV evaluation — BisaKerja is here for every step of your career journey.
                    </p>
                </div>

                <div className="mx-auto grid gap-2 sm:grid-cols-5">
                    {/* Card 1: AI CV Analyzer - large left */}
                    <Card className="group overflow-hidden shadow-black/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl border-black/5">
                        <CardHeader>
                            <div className="md:p-6">
                                <p className="font-bold text-lg">AI-Powered CV Analysis</p>
                                <p className="text-muted-foreground mt-3 max-w-sm text-sm">
                                    Upload your CV and get a match score, suggestions for improvement, and highlights of sections that need updates — all instantly.
                                </p>
                            </div>
                        </CardHeader>

                        <div className="relative h-fit pl-6 md:pl-12">
                            <div className="absolute -inset-6 [background:radial-gradient(75%_95%_at_50%_0%,transparent,hsl(var(--background))_100%)]"></div>

                            <div className="bg-black overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2 border-black/5 ">
                                {/* Placeholder for AI CV Analyzer screenshot */}
                                <Image
                                    src="/screenshots/ai-cv-analyzer.png"
                                    alt="AI CV Analyzer"
                                    width={1280}
                                    height={345}
                                    className="w-full object-contain rounded-tl-sm"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Card 2: Smart Filters - small right */}
                    <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl border-black/5 flex flex-col justify-between">
                        <p className="mx-auto my-6 max-w-md text-balance px-6 text-center text-lg font-semibold sm:text-2xl md:p-6">
                            Save your favorite jobs and track applications all in one place.
                        </p>

                        {/* <CardContent className="mt-auto h-fit">
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 [background:radial-gradient(50%_75%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                                <div className="aspect-76/59 overflow-hidden rounded-r-lg border border-black/5 bg-gradient-to-br from-indigo-50 to-violet-100">
                                    <div className="flex h-full min-h-40 items-center justify-center">
                                        <div className="text-center">
                                            <SlidersHorizontal className="mx-auto mb-2 size-10 text-indigo-400" />
                                            <p className="text-xs font-medium text-indigo-600">Filter Tipe Kerja, Gaji &amp; Lokasi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent> */}

                            <div className="relative h-fit pr-6 md:pr-12">
                            <div className="absolute -inset-6  [background:radial-gradient(75%_95%_at_50%_0%,transparent,hsl(var(--background))_100%)]"></div>

                            <div className="bg-black overflow-hidden rounded-tr-lg border-t pr-2 pt-2 border-black/5 ">
                                {/* Placeholder for AI CV Analyzer screenshot */}
                                <Image
                                    src="/screenshots/tracker-saved.png"
                                    alt="AI CV Analyzer"
                                    width={1280}
                                    height={345}
                                    className="w-full object-cover h-[280px] rounded-tr-sm"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Card 4: Integrations / Sources */}
                    <Card className="border-black/5 group relative shadow-black/5 sm:col-span-5 sm:rounded-none sm:rounded-br-xl">
                        <CardHeader className="p-6 md:p-12">
                            <p className="font-bold text-2xl">Jobs from trusted sources</p>
                            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                                BisaKerja aggregates job listings from various platforms so you don&apos;t have to keep switching.
                            </p>
                        </CardHeader>
                        <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
                            <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                                {trustedSources.map((source) => (
                                    <div
                                        key={source.name}
                                        className="rounded-(--radius) bg-muted/50 flex rounded-md items-center justify-center border border-black/5 p-3"
                                    >
                                        <Image
                                            src={source.src}
                                            alt={`${source.name} logo`}
                                            width={source.width}
                                            height={source.height}
                                            sizes="150px"
                                            className="max-h-10 w-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
