import React from "react";

export default function Admin() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Analytics Overview
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Click below to view detailed visitor statistics on Google Analytics.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="https://analytics.google.com/analytics/web/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Open Google Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
