import React from "react";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { StarIcon } from '@heroicons/react/20/solid'

const stats = [
  { id: 1, name: "Active Users", value: "500+" },
  { id: 2, name: "Results Updated Daily", value: "24x7" },
  { id: 3, name: "Live Update Guarantee", value: "99.9%" },
  { id: 4, name: "Stay Anonymous", value: "100%" },
];

const files = [
  {
    title: 'Seed 1',
    size: '100',
    source:
      '/Home Img.png',
  },
  {
    title: 'Seed 2',
    size: '200',
    source:
      '/Home Img 2.png',
  },
  {
    title: 'Seed 3',
    size: '300',
    source:
      '/Home Img 3.png',
  },
  {
    title: 'Seed 3',
    size: '300',
    source:
      '/Home Img 4.png',
  },
  // More files...
]


export default function Example() {
  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-linear-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-0 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                     
              <h1 className="mt-10 text-5xl font-semibold tracking-widest text-pretty text-gray-900 sm:text-7xl">
              100% ORGANIC SEEDS
              </h1>

                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-md bg-Primary w-32 text-center px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Products
                  </a>
                  
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div
              className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 md:-mr-20 lg:-mr-36"
              aria-hidden="true"
            />
            <div className=" md:rounded-3xl inline-block overflow-hidden">
            
              <div
                className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-white ring-inset md:ml-20 lg:ml-36"
                aria-hidden="true"
              />
              
              {/* Add Images in Here */}
              <img src="Logo.png" className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl" />
           
          </div>

          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-0 mt-10">

      <div className="flex items-center mb-16 justify-center">
  <div className="flex-grow h-px bg-gray-300 mr-6"></div> {/* Line on the left */}
  <h2 className="text-xl font-semibold text-Primary mx-6 mb-5 whitespace-nowrap">Best Sellers</h2> {/* Title centered */}
  <div className="flex-grow h-px bg-gray-300 ml-6"></div> {/* Line on the right */}
</div>


      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
  {files.map((file) => (
    <li key={file.source} className="relative text-center">
      <div className="group overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-Primary focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
        <img
          alt=""
          src={file.source}
          className="pointer-events-none aspect-10/7 object-cover group-hover:opacity-75"
        />
        <button type="button" className="absolute inset-0 focus:outline-hidden">
          <span className="sr-only">View details for {file.title}</span>
        </button>
      </div>

      {/* Wrapper to make the background width same as the image */}
      <div className="mt-2 inline-block w-full max-w-full">
        <div className="bg-Primary rounded-2xl py-3 px-6  text-center mt-4">
          <p className="pointer-events-none block text-lg  font-bold text-white">{file.title}</p> {/* Increased font size */}
          {/*<p className="pointer-events-none block text-sm font-medium text-black-800">{file.size}</p>*/}
        </div>
      </div>
    </li>
  ))}
</ul>

</div>

<div className="bg-gray-100 w-full pt-10 sm:pt-10 pb-24 sm:pb-32 mt-20">

  {/* Title Centered */}
  <h2 className="text-3xl font-semibold text-gray-900 text-center mb-15">
      Our Happy Customers
    </h2>

  <section className="px-6 lg:px-8">
    <figure className="mx-auto max-w-2xl">
      <p className="sr-only">5 out of 5 stars</p>
      <div className="flex gap-x-1 text-Primary">
        <StarIcon aria-hidden="true" className="size-5 flex-none" />
        <StarIcon aria-hidden="true" className="size-5 flex-none" />
        <StarIcon aria-hidden="true" className="size-5 flex-none" />
        <StarIcon aria-hidden="true" className="size-5 flex-none" />
        <StarIcon aria-hidden="true" className="size-5 flex-none" />
      </div>
      <blockquote className="mt-10 text-xl/8 font-semibold tracking-tight text-gray-900 sm:text-2xl/9">
        <p>
          “Qui dolor enim consectetur do et non ex amet culpa sint in ea non dolore. Enim minim magna anim id minim eu
          cillum sunt dolore aliquip. Amet elit laborum culpa irure incididunt adipisicing culpa amet officia
          exercitation. Eu non aute velit id velit Lorem elit anim pariatur.”
        </p>
      </blockquote>
      <figcaption className="mt-10 flex items-center gap-x-6">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
          className="size-12 rounded-full bg-gray-50"
        />
        <div className="text-sm/6">
          <div className="font-semibold text-gray-900">Judith Black</div>
          <div className="mt-0.5 text-gray-600">CEO of Workcation</div>
        </div>
      </figcaption>
    </figure>
  </section>
</div>

</div>


  );
}
