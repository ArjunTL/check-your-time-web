"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        {/* Brand left */}
        <div className="flex flex-1 items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-lg text-white font-bold shadow-sm">
              BN
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-gray-900">
                Bhagya Neram
              </span>
              <span className="text-[11px] text-gray-500">
                Kerala Lottery Results
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop: Results highlighted, right aligned */}
        <div className="hidden flex-1 items-center justify-end lg:flex">
          <Link
            href="/result"
            className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Results
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-40 bg-black/25" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-xs overflow-y-auto bg-white px-6 py-6 shadow-xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm text-white font-bold">
                BN
              </span>
              <span className="text-sm font-semibold text-gray-900">
                Bhagya Neram
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/result"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full rounded-full bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Results
            </Link>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
