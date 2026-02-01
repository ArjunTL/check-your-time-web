import React from "react";

const stats = [
  { id: 1, name: "Daily Visitors", value: "5,000+" },
  { id: 2, name: "Results Updated", value: "7 days/week" },
  { id: 3, name: "Fast Updates", value: "< 1 min" },
  { id: 4, name: "Kerala Lotteries", value: "All draws" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden">
        <div className="absolute inset-0">
          <img
            alt="Bhagya Neram background"
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-600 to-transparent opacity-80" />
        </div>

        <div className="relative z-10 max-w-screen-lg px-6 py-16 sm:px-12 sm:py-24 lg:px-24">
          <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-200/40">
            Bhagya Neram • Kerala Lottery Companion
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Check Kerala Lottery{" "}
            <span className="text-yellow-300">results instantly</span> with
            Bhagya Neram.
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-emerald-50/90 leading-relaxed">
            Bhagya Neram brings all official Kerala lottery results to one
            simple, fast and mobile‑friendly place. Search by date, name or code
            and find your result in seconds.
          </p>

          {/* Stats */}
          <dl className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col gap-y-1 border-l-4 border-emerald-200 pl-4"
              >
                <dt className="text-xs sm:text-sm font-medium text-emerald-50/80">
                  {stat.name}
                </dt>
                <dd className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Primary CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/result"
              className="inline-flex items-center justify-center rounded-lg bg-yellow-300 px-6 py-3 text-sm sm:text-base font-semibold text-emerald-900 shadow-lg shadow-yellow-500/30 transition hover:bg-yellow-200"
            >
              View Latest Results
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-100/70 bg-emerald-900/20 px-6 py-3 text-sm sm:text-base font-semibold text-emerald-50 hover:bg-emerald-900/40"
            >
              How Bhagya Neram works
            </a>
          </div>
        </div>
      </div>

      {/* Section: Highlight */}
      <section
        className="relative w-full bg-gray-50 py-20 px-4 sm:px-8 lg:px-16"
        id="how-it-works"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <img
              alt="Bhagya Neram preview"
              src="https://placehold.co/600x400/EEF7F3/0F172A?text=Bhagya+Neram+Preview"
              className="w-full max-w-lg rounded-2xl shadow-xl ring-1 ring-emerald-100"
            />
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
              Bhagya Neram keeps you in sync with every Kerala lottery draw.
            </h2>
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              See today’s winning numbers, scan past results and stay ready for
              upcoming draws. Designed for Kerala lottery players who value
              clarity, speed and a clean interface.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <span className="text-emerald-700 text-lg">📅</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Today&apos;s Results
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Open Bhagya Neram after draw time and see the latest
                    official results in one tap.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-amber-700 text-lg">⏱️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming & Past
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Browse previous draws or check upcoming lottery schedules in
                    a clean, searchable view.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom section */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bhagya Neram makes checking results{" "}
            <span className="text-emerald-600">simple</span>.
          </h2>
          <p className="mt-3 text-sm sm:text-lg text-gray-600">
            No clutter, no confusion. Just Kerala lottery results, organised
            beautifully for mobile and desktop.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <div className="max-w-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <span className="text-lg">🧭</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Clean navigation
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Jump between today, past results and upcoming draws without
                getting lost.
              </p>
            </div>

            <div className="max-w-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                <span className="text-lg">📂</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Results archive
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Browse historical Kerala lottery results whenever you need to
                verify a ticket.
              </p>
            </div>

            <div className="max-w-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                <span className="text-lg">🔍</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Smart search
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Search by lottery name, draw code or date and reach your result
                in one step.
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/result"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Open Bhagya Neram
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3 text-sm sm:text-base font-semibold text-gray-500 hover:text-gray-700"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
