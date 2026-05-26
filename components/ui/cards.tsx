import { cn } from "@/lib/utils";

const BLOG_CARDS = [
  {
    image:
      "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60",
    title: "Color Psychology in UI: How to Choose the Right Palette",
    category: "UI/UX design",
  },
  {
    image:
      "https://images.unsplash.com/photo-1714974528646-ea024a3db7a7?w=1200&h=800&auto=format&fit=crop&q=60",
    title: "Understanding Typography: Crafting a Visual Voice for Your Brand",
    category: "Branding",
  },
  {
    image:
      "https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60",
    title: "Design Thinking in Practice: How to Solve Real User Problems",
    category: "Product Design",
  },
];

export default function Example() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="flex w-full flex-col items-center font-['Poppins',sans-serif]">
        <h1 className="text-3xl font-semibold">Latest Blog</h1>
        <p className="mt-2 max-w-lg text-center text-sm text-slate-500">
          Stay ahead of the curve with fresh content on code, design, startups,
          and everything in between.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {BLOG_CARDS.map((card) => (
            <div
              key={card.title}
              className={cn(
                "w-full max-w-72 transition duration-300 hover:-translate-y-0.5",
              )}
            >
              <img className="rounded-xl" src={card.image} alt="" />
              <h3 className="mt-3 text-base font-medium text-slate-900">
                {card.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-indigo-600">
                {card.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
