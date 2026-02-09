import React from "react";

export default function Contact() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">
            Get in Touch
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact Us
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We are at an early stage and would love to hear your feedback to
            improve our service.
          </p>

          <div className="mt-10 max-w-xl mx-auto space-y-8">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              <a
                href="mailto:alphaneram@gmail.com"
                className="mt-2 text-emerald-600 hover:text-emerald-500"
              >
                alphaneram@gmail.com
              </a>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
              <a
                href="https://www.instagram.com/alpha.neram/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-emerald-600 hover:text-emerald-500"
              >
                @alpha.neram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
