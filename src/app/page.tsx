import React from "react";

const stats = [
  { id: 1, name: "Active Users", value: "500+" },
  { id: 2, name: "Results Updated Daily", value: "24x7" },
  { id: 3, name: "Live Update Guarantee", value: "99.9%" },
  { id: 4, name: "Stay Anonymous", value: "100%" },
];

export default function Example() {
  return (
    <div className="min-h-screen bg-white">
      {/* First Section with Background */}
      <div className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden">
        {/* Full-Screen Background with Subtle Gradient */}
        <div className="absolute inset-0">
          <img
            alt="Background"
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-transparent opacity-50"></div>
        </div>

        {/* Main Content Section Inside Gradient */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-24 max-w-screen-lg py-16 sm:py-24 lg:py-20">
          <p className="mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Trusted by thousands of People <br /> in Kerala
          </p>
          <p className="mt-6 text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed">
            Trusted by thousands, our app delivers fast and accurate lottery
            results. Your journey to winning starts here.
          </p>

          {/* Stats Section */}
          <dl className="mt-12 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col gap-y-2 border-l-4 border-white pl-4"
              >
                <dt className="text-sm sm:text-base lg:text-lg font-medium text-gray-300">
                  {stat.name}
                </dt>
                <dd className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-20">
            <button className="w-50 px-6 py-3 text-sm sm:text-base outline outline-white text-white font-semibold rounded-lg shadow-md hover:bg-gray-100">
              Check
            </button>
            <button className="w-50 px-6 py-3 text-sm sm:text-base bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-200">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Second Section */}
      <div className="relative w-full bg-gray-50 py-28 px-4 sm:px-8 lg:px-16 flex items-center">
        <div className="max-w-full mx-auto grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex justify-center">
            <img
              alt="Placeholder Image"
              src="https://placehold.co/600x400/EEE/31343C"
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
              Stay Updated with the Latest Lottery Results at Your Fingertips
            </h3>
            <p className="mt-14 text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Stay up-to-date with the most recent lottery results. Check your
              numbers and see if you're a winner!
            </p>

            {/* Two-Column Structure */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="flex items-start gap-x-4">
                <div className="p-4 bg-indigo-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Today's Results
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Discover the latest winning numbers for today.
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="flex items-start gap-x-4">
                <div className="p-4 bg-purple-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Upcoming Draws
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Stay informed about the next exciting lottery draws.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white py-12">
        {/* Title and Subtitle Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Discover Your Lottery Results <br/> Instantly
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
          Our website offers a user-friendly experience for checking lottery results. Access the <br/> latest updates anytime, anywhere with our mobile-friendly design.
          </p>
        </div>

        {/* Columns Section */}
        <div className="flex flex-wrap justify-between text-center m-6 pt-10">
          {/* First Column */}
          <div className="flex flex-col items-center flex-1 px-4 mb-8">
            <img
              src="icon1.png"
              alt="Icon 1"
              className="w-12 h-12 mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">Easy Navigation for Quick <br/> Results</h3>
            <p className="text-sm text-gray-600 mt-4">Finding your lottery results has never been easier.</p>
          </div>

          {/* Second Column */}
          <div className="flex flex-col items-center flex-1 px-4 mb-8">
            <img
              src="icon2.png"
              alt="Icon 2"
              className="w-12 h-12 mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">Stay Updated with Past <br/> Results Archive</h3>
            <p className="text-sm text-gray-600 mt-4">Explore our comprehensive archive for previous draws.</p>
          </div>

          {/* Third Column */}
          <div className="flex flex-col items-center flex-1 px-4 mb-8">
            <img
              src="icon3.png"
              alt="Icon 3"
              className="w-12 h-12 mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">Search Function for Your <br/> Convenience</h3>
            <p className="text-sm text-gray-600 mt-4">Quickly find specific results using our search tool.</p>
          </div>
        </div>
      
        <div className="flex justify-center space-x-4 gap-10 mt-10">
      {/* Learn More Button */}
      <button className="px-6 py-3 text-sm sm:text-base text-gray-400 font-semibold rounded-lg  border border-gray-400  hover:text-gray-500 hover:border-gray-500">
        Learn More
      </button>

      {/* Sign Up Button */}
      <button className="px-6 py-3 text-sm sm:text-base text-gray-400 font-semibold rounded-lg  hover:text-gray-500">
      Sign Up
    </button>

    </div>
      

      </div>

    </div>
  );
}
