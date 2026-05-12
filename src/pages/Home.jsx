import { Link } from 'react-router-dom'
import AmenitiesSection from '../components/AmenitiesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import PlansPreviewSection from '../components/PlansPreviewSection'
import { useState } from 'react'

const MAPS_URL =
  'https://www.google.com/maps/place/Raystone+Apartment+Homes/@28.957981,-95.9950148,13.25z/data=!4m6!3m5!1s0x8641b93dda87dcd1:0x533869ddb36a8432!8m2!3d28.9774393!4d-95.9647933!16s%2Fg%2F11f2w8gnyh?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D'

// Collapsible FAQ item
function FaqItem({ question, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        className="faq-hover h-20 w-full flex items-center justify-between text-gray-800 px-4 py-2 select-none text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-xl pl-2">{question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ml-4 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden border-b border-gray-800 ${open ? 'max-h-[500px]' : 'max-h-0'}`}
      >
        <div className="text-lg text-gray-800 pl-4 space-y-1 mb-8 ml-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="pt-0">
      {/* Hero */}
      <div
        style={{ backgroundImage: "url('/images/Raystone/cover.png')" }}
        className="bg-[length:150%] md:bg-cover bg-no-repeat min-h-[30vh] md:min-h-180 max-sm:mt-18"
      >
        <div className="w-full h-full bg-black/30 center flex-col md:pt-60 md:pb-60 max-sm:mt-4">
          <div className="w-full px-4 max-w-6xl mx-auto md:center flex-col md:space-y-4">
            <h1 className="text-4xl md:text-7xl font-semibold text-gray-200 max-md:hidden">Raystone Apartments</h1>
            <h1 className="text-2xl md:text-[30px] font-semibold text-gray-200 max-sm:mt-2 sm:pt-4">
              Modern Apartments Located in{' '}
              <span className="hidden sm:inline">Bay City, TX</span>
              <span className="sm:hidden text-gray-300">Bay City, TX</span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8 my-6 px-8 sm:px-2">
            <a
              className="center text-gray-100 text-md sm:text-2xl bg-gray-800 px-6 sm:px-10 py-3 rounded-md w-full sm:w-auto
                hover:bg-gray-200/80 hover:text-gray-700 font-medium transition-colors duration-300 ease-in-out mt-4 md:mt-10 border border-gray-800"
              href="https://www.rentcafe.com/apartments/tx/bay-city/raystone-apartment-homes/default.aspx"
              target="_blank" rel="noopener noreferrer"
            >
              Check Availability
            </a>
            <a
              className="center text-gray-800 text-md sm:text-2xl bg-gray-300 px-6 sm:px-10 py-3 rounded-md w-full sm:w-auto
                hover:bg-gray-800/85 hover:text-gray-200 font-medium transition-colors duration-300 ease-in-out mt-4 md:mt-10 border border-gray-100"
              href="https://www.rentcafe.com/residentservices/apartmentsforrent/userlogin.aspx"
              target="_blank" rel="noopener noreferrer"
            >
              Resident Login
            </a>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div className="center h-auto px-4 max-w-6xl mx-auto mt-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-medium">
          Welcome to life at Raystone.
        </h2>
      </div>

      {/* Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 max-w-6xl mx-auto px-4 mt-8 gap-6">
        <div>
          <p className="text-md sm:text-lg md:text-xl text-gray-800 text-center">
            Raystone Apartment Homes is a gated community where comfort, security, and convenience meet. Enjoy
            beautifully landscaped grounds, striking residences, and interiors designed to feel like home from the
            moment you walk in.
          </p>
          <p className="text-md sm:text-lg md:text-xl text-gray-800 text-center mt-4">
            Located in the heart of Bay City just minutes from 7th Street and Highway 60, Raystone offers easy
            access to everything the region has to offer. Welcome home to a place where style, comfort, and location
            come together.
          </p>
        </div>
        <img
          src="/images/Raystone/Raven/Kitchen 4.jpg"
          className="w-full h-60 md:h-80 object-cover card-hover"
          alt="Example Suite"
        />
      </div>

      {/* Amenities */}
      <div className="mx-auto max-w-7xl">
        <div id="amenities" className="mt-12 md:mt-20 h-[2px] bg-gray-300 rounded-full mx-4" />
      </div>
      <div className="center h-15 px-4 max-w-6xl mx-auto mt-4 md:mt-8">
        <h2 className="text-4xl text-gray-800 font-medium">Amenities</h2>
      </div>
      <AmenitiesSection />
      <div className="center">
        <span className="max-w-7xl text-gray-800">* Available in select units. Contact management for details.</span>
      </div>
      <div className="flex flex-col space-y-4 items-center justify-center text-center px-4 max-w-6xl mx-auto mt-4">
        <h3 className="text-xl md:text-2xl text-gray-800 font-medium">Designed for Everyday Living.</h3>
        <p className="text-md md:text-xl text-gray-800">
          At Raystone Apartment Homes, every detail is designed with your comfort in mind. From modern interiors to
          community features that enhance daily living, Raystone offers a refined yet relaxed place to call home.
        </p>
      </div>

      {/* Floor Plans */}
      <div id="rooms" className="mx-auto max-w-7xl">
        <div className="mt-12 md:mt-20 h-[2px] bg-gray-300 rounded-full mx-4" />
      </div>
      <div className="center flex-col h-16 space-y-6 px-4 max-w-6xl mx-auto mt-16">
        <h2 className="text-4xl text-gray-800 font-medium">Floor Plans</h2>
        <p className="text-md md:text-[20px] text-gray-800">
          Choose from a variety of <span className="font-medium">spacious floor plans</span> designed to fit your lifestyle:
        </p>
      </div>
      <PlansPreviewSection />

      {/* Location */}
      <div className="mx-auto max-w-7xl">
        <div id="location" className="mt-12 md:mt-20 h-[2px] bg-gray-300 rounded-full mx-4" />
      </div>
      <div className="center text-gray-800 font-semibold mt-12 text-4xl">Location</div>
      <div className="mt-4 p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-4 sm:px-0">
          {/* Address card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transform hover:scale-[1.04] transition-transform duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 flex justify-center pt-1 shrink-0 text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="italic font-semibold text-gray-900 text-sm sm:text-[18px]">Raystone Apartment Homes</p>
                <p className="mt-1 text-gray-700 text-sm sm:text-base leading-relaxed">
                  2600–2608 Avenue K<br />Bay City, TX 77414
                </p>
              </div>
            </div>
          </div>
          {/* Convenient Location */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transform hover:scale-[1.04] transition-transform duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 flex justify-center pt-1 shrink-0 text-gray-800">
                <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 3.75C20 5.71094 17.6914 8.63672 16.6953 9.80469C16.5469 9.97656 16.3281 10.043 16.1289 10H12.5C11.8086 10 11.25 10.5586 11.25 11.25C11.25 11.9414 11.8086 12.5 12.5 12.5H16.25C18.3203 12.5 20 14.1797 20 16.25C20 18.3203 18.3203 20 16.25 20H5.45313C5.79297 19.6133 6.20703 19.1172 6.625 18.5625C6.87109 18.2344 7.125 17.875 7.36719 17.5H16.25C16.9414 17.5 17.5 16.9414 17.5 16.25C17.5 15.5586 16.9414 15 16.25 15H12.5C10.4297 15 8.75 13.3203 8.75 11.25C8.75 9.17969 10.4297 7.5 12.5 7.5H14.0547C13.2344 6.26953 12.5 4.85547 12.5 3.75C12.5 1.67969 14.1797 0 16.25 0C18.3203 0 20 1.67969 20 3.75ZM4.57422 19.1055C4.42578 19.2734 4.29297 19.4219 4.17969 19.5469L4.10937 19.625L4.10156 19.6172C3.86719 19.7969 3.53125 19.7734 3.32031 19.5469C2.33594 18.4766 0 15.7227 0 13.75C0 11.6797 1.67969 10 3.75 10C5.82031 10 7.5 11.6797 7.5 13.75C7.5 14.9219 6.67578 16.3672 5.80078 17.5742C5.38281 18.1484 4.95312 18.668 4.59766 19.0781L4.57422 19.1055ZM5 13.75C5 13.4185 4.8683 13.1005 4.63388 12.8661C4.39946 12.6317 4.08152 12.5 3.75 12.5C3.41848 12.5 3.10054 12.6317 2.86612 12.8661C2.6317 13.1005 2.5 13.4185 2.5 13.75C2.5 14.0815 2.6317 14.3995 2.86612 14.6339C3.10054 14.8683 3.41848 15 3.75 15C4.08152 15 4.39946 14.8683 4.63388 14.6339C4.8683 14.3995 5 14.0815 5 13.75ZM16.25 5C16.5815 5 16.8995 4.8683 17.1339 4.63388C17.3683 4.39946 17.5 4.08152 17.5 3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5C15.9185 2.5 15.6005 2.6317 15.3661 2.86612C15.1317 3.10054 15 3.41848 15 3.75C15 4.08152 15.1317 4.39946 15.3661 4.63388C15.6005 4.8683 15.9185 5 16.25 5Z" fill="#4B5563"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="italic font-semibold text-gray-900 text-sm sm:text-[18px]">Convenient Location</p>
                <p className="mt-1 text-gray-700 text-sm sm:text-base leading-relaxed">
                  Conveniently located near <span className="font-medium">Highway 60</span> and{' '}
                  <span className="font-medium">7th Street</span> (Highway 35).
                </p>
              </div>
            </div>
          </div>
          {/* Everyday Convenience */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transform hover:scale-[1.04] transition-transform duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 flex justify-center pt-1 shrink-0 text-gray-800">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.19667 21.0217 4.00067 20.5507 4 20V8C4 7.45 4.196 6.97933 4.588 6.588C4.98 6.19667 5.45067 6.00067 6 6H8C8 4.9 8.39167 3.95833 9.175 3.175C9.95833 2.39167 10.9 2 12 2C13.1 2 14.0417 2.39167 14.825 3.175C15.6083 3.95833 16 4.9 16 6H18C18.55 6 19.021 6.196 19.413 6.588C19.805 6.98 20.0007 7.45067 20 8V20C20 20.55 19.8043 21.021 19.413 21.413C19.0217 21.805 18.5507 22.0007 18 22H6ZM6 20H18V8H16V10C16 10.2833 15.904 10.521 15.712 10.713C15.52 10.905 15.2827 11.0007 15 11C14.7173 10.9993 14.48 10.9033 14.288 10.712C14.096 10.5207 14 10.2833 14 10V8H10V10C10 10.2833 9.904 10.521 9.712 10.713C9.52 10.905 9.28267 11.0007 9 11C8.71733 10.9993 8.48 10.9033 8.288 10.712C8.096 10.5207 8 10.2833 8 10V8H6V20ZM10 6H14C14 5.45 13.8043 4.97933 13.413 4.588C13.0217 4.19667 12.5507 4.00067 12 4C11.4493 3.99933 10.9787 4.19533 10.588 4.588C10.1973 4.98067 10.0013 5.45133 10 6Z" fill="#4B5563"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="italic font-semibold text-gray-900 text-sm sm:text-[18px]">Everyday Convenience</p>
                <p className="mt-1 text-gray-700 text-sm sm:text-base leading-relaxed">
                  Enjoy close proximity to grocery stores, schools, dining options, pharmacies and more.
                </p>
              </div>
            </div>
          </div>
          {/* Safety */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transform hover:scale-[1.04] transition-transform duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 flex justify-center pt-1 shrink-0 text-gray-800">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.99991L12.394 2.07991C12.2695 2.02654 12.1355 1.99902 12 1.99902C11.8645 1.99902 11.7305 2.02654 11.606 2.07991L12 2.99991ZM12 20.9999L11.504 21.8679C11.6551 21.9542 11.826 21.9996 12 21.9996C12.174 21.9996 12.3449 21.9542 12.496 21.8679L12 20.9999ZM11.606 2.08091L5.212 4.81991L6 6.65991L12.394 3.91991L11.606 2.08091ZM4 6.65891V13.5189H6V6.65891H4ZM7.527 19.5959L11.504 21.8679L12.496 20.1319L8.519 17.8589L7.527 19.5959ZM12.496 21.8679L16.473 19.5959L15.481 17.8589L11.504 20.1319L12.496 21.8679ZM20 13.5179V6.65991H18V13.5199L20 13.5179ZM18.788 4.82091L12.394 2.08091L11.606 3.91891L18 6.65991L18.788 4.82091ZM20 6.65991C20 6.26857 19.8851 5.88584 19.6697 5.55913C19.4542 5.23243 19.1477 4.9751 18.788 4.82091L18 6.65991H20ZM16.473 19.5959C17.5446 18.9835 18.4353 18.0997 19.0547 17.0321C19.6741 15.9645 20.0002 14.7522 20 13.5179H18C17.9999 14.3994 17.7667 15.2652 17.3242 16.0275C16.8816 16.7899 16.2454 17.4217 15.48 17.8589L16.473 19.5959ZM4 13.5179C3.99994 14.752 4.32615 15.9642 4.94554 17.0316C5.56494 18.099 6.45551 18.9836 7.527 19.5959L8.519 17.8589C7.75406 17.4217 7.11823 16.7902 6.67587 16.0282C6.23352 15.2663 6.00036 14.401 6 13.5199L4 13.5179ZM5.212 4.81991C4.85216 4.97417 4.5455 5.23165 4.33005 5.55855C4.11461 5.88545 3.99985 6.2684 4 6.65991H6L5.212 4.81991Z" fill="#4B5563"/>
                  <path d="M15 10L11 14L9 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="italic font-semibold text-gray-900 text-sm sm:text-[18px]">Safety</p>
                <p className="mt-1 text-gray-700 text-sm sm:text-base leading-relaxed">
                  Raystone offers peace of mind with gated access and a calm, residential setting designed for comfortable everyday living.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div className="transform hover:scale-104 transition-transform duration-300 center md:w-[85%]">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="relative group block w-full h-full">
              <img src="/images/location.png" alt="location" className="border border-gray-900 w-full" />
              <div className="absolute inset-0 bg-black center opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                <span className="pt-4 text-white text-xl font-semibold opacity-100">Open in Google Maps</span>
              </div>
            </a>
          </div>
          <a
            href={MAPS_URL}
            target="_blank" rel="noopener noreferrer"
            className="md:hidden text-white text-xl bg-gray-800 px-4 py-2 rounded-md mt-4 h-12 w-auto
              hover:bg-gray-200 hover:text-gray-600 font-medium transition-colors duration-300 ease-in-out items-center"
          >
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mx-auto max-w-7xl">
        <div id="testimonials" className="mt-12 md:mt-20 h-[2px] bg-gray-300 rounded-full mx-4" />
      </div>
      <TestimonialsSection />

      {/* Gallery preview images */}
      <div className="mx-auto max-w-7xl">
        <div id="socials" className="mt-12 md:mt-20 h-[2px] bg-gray-300 rounded-full mx-4" />
      </div>
      <section>
        <h2 className="center text-gray-800 text-2xl font-semibold max-md:px-4">Check out our apartments in detail!</h2>
        <div id="footerImages" className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto px-4 max-w-6xl mt-8">
          <div className="aspect-[4/3] overflow-hidden card-hover cursor-pointer">
            <img src="/images/Raystone/pic 1.png" className="w-full h-full object-cover" alt="Dining Area" />
          </div>
          <div className="aspect-[4/3] overflow-hidden card-hover cursor-pointer">
            <img src="/images/Raystone/Exterior/exterior-gazebo.JPG" className="w-full h-full object-cover" alt="Outside View" />
          </div>
          <div className="aspect-[4/3] overflow-hidden card-hover cursor-pointer">
            <img src="/images/Raystone/IMG_0229.JPG" className="w-full h-full object-cover" alt="Bedroom" />
          </div>
        </div>
        <div className="center p-4 max-w-6xl mx-auto">
          <Link
            to="/gallery"
            className="text-white text-2xl bg-gray-800 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-md mt-4 h-14
              w-auto hover:bg-gray-200 hover:text-gray-600 font-medium transition-colors duration-300 ease-in-out items-center"
          >
            View Gallery
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <div className="mx-auto max-w-7xl">
        <div id="FAQ" className="mt-12 md:mt-20 h-[2px] bg-gray-300 rounded-full mx-4" />
      </div>
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="center text-4xl text-gray-800 my-6 font-medium">Frequently Asked Questions</div>

        <FaqItem question="How do I apply for an apartment?">
          You can apply for an apartment or check our current availability through{' '}
          <a href="https://www.rentcafe.com/apartments/tx/bay-city/raystone-apartment-homes/default.aspx"
            className="font-medium underline underline-offset-2 hover:text-gray-800/50" target="_blank" rel="noopener noreferrer">
            RentCafe
          </a>.
        </FaqItem>

        <FaqItem question="What lease terms are available?">
          We offer flexible lease terms ranging from 6 to 18 months. Please contact our leasing office for specific availability and options.
        </FaqItem>

        <FaqItem question="Are utilities included?">
          No, tenants are responsible for their own utility payments, including electricity, water, internet, and trash.
        </FaqItem>

        <FaqItem question="Is the community pet-friendly?">
          Yes, Raystone Apartment Homes is a pet-friendly community. Pets are welcome with a $250 pet deposit, a $250 non-refundable
          pet fee, and $25 monthly pet rent per pet. Residents also enjoy access to an on-site dog park, with dog waste stations
          conveniently located throughout the community.
          <p className="mt-1"><span className="font-bold">No aggressive breeds.</span> Max 2 pets per unit.</p>
        </FaqItem>

        <FaqItem question="Do you offer move-in specials or discounts?">
          Move-in specials or discounts may be available from time to time. Contact our leasing office for the most up-to-date
          information on current promotions.
        </FaqItem>

        <FaqItem question="How do I submit maintenance requests?">
          Maintenance requests can be submitted easily through the RentCafe{' '}
          <a href="https://www.rentcafe.com/residentservices/apartmentsforrent/userlogin.aspx"
            target="_blank" rel="noopener noreferrer" className="font-medium underline-2 hover:text-gray-800/50">
            resident portal
          </a>.
          Our maintenance team responds promptly to requests and works efficiently to ensure issues are addressed as quickly as possible.
        </FaqItem>

        <FaqItem question="Still have questions?">
          Send us an email at{' '}
          <a href="mailto:info@raystoneapts.com" className="font-semibold underline-4 hover:text-gray-800/50">
            info@raystoneapts.com
          </a>{' '}
          or call us at <span className="font-semibold">+1 (979) 221-2707</span>. We'll be happy to help!
        </FaqItem>
      </section>

      <div className="h-10" />
    </div>
  )
}
