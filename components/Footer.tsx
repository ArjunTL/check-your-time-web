const navigation = [
  { name: "Facebook", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "X", href: "#" },
  { name: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100" id="contact">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-center md:flex-row md:text-left lg:px-8">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900">
            Bhagya Neram – Kerala Lottery Results
          </p>
          <p className="text-xs text-gray-500">
            This app is an unofficial Kerala lottery companion. Always verify
            results with official government sources.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Bhagya Neram. All rights reserved.
          </p>
        </div>
        <div className="flex gap-x-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-500 hover:text-gray-800"
            >
              <span className="sr-only">{item.name}</span>
              <span className="text-lg">●</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
