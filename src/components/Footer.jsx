export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 h-120">
      <div className="max-w-7xl grid grid-cols-2 mx-auto items-start justify-between p-6">
        {/* Address */}
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl font-medium underline decoration-2">Address</h2>
          <div className="flex flex-col items-center font-light text-md md:text-xl">
            <p className="italic">Raystone Apartment Homes</p>
            <p>2600-2608 Avenue K</p>
            <p>Bay City, TX 77414</p>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl font-medium underline decoration-2">Contact</h2>
          <p className="font-light md:text-xl">info@raystoneapts.com</p>
          <p className="font-light md:text-xl">Call +1 (979) 221-2707</p>
          <a
            href="https://www.facebook.com/raystoneapts"
            target="_blank"
            rel="noopener noreferrer"
            className="center transform hover:scale-105 transition-transform duration-300 mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-gray-100"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span className="ml-1 font-light md:text-xl">RaystoneApts</span>
          </a>
        </div>
      </div>

      {/* Logo and Copyright */}
      <div className="center">
        <img src="/src/images/logowtext.svg" width="300" alt="logo with text" />
      </div>
      <p className="text-center mx-auto mt-4 max-w-6xl text-xl text-white px-2">
        &copy; {year} Raystone Apartment Homes. All rights reserved.
      </p>
    </footer>
  )
}
