import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import AOS from 'aos'
import 'aos/dist/aos.css'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FuelPriceTicker from './components/FuelPriceTicker'
import MayDayPopup from './components/MayDayPopup'
import WhatsAppButton from './components/WhatsAppButton'
import './index.css'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Products = lazy(() => import('./pages/Products'))
const FindStation = lazy(() => import('./pages/FindStation'))
const OurTeam = lazy(() => import('./pages/OurTeam'))
const Gallery = lazy(() => import('./pages/Gallery'))
const News = lazy(() => import('./pages/News'))
const NewsDetail = lazy(() => import('./pages/NewsDetail'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const RequestQuote = lazy(() => import('./pages/RequestQuote'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const Safety = lazy(() => import('./pages/Safety'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const Reviews = lazy(() => import('./pages/Reviews'))

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 rounded-full animate-spin" style={{borderColor:'#CC0000',borderTopColor:'transparent'}}></div></div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/find-station" element={<FindStation />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/quote" element={<RequestQuote />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true })
  }, [])

  return (
    <HelmetProvider>
    <BrowserRouter>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {!loading && (
        <>
          <Navbar />
        <FuelPriceTicker />
        <MayDayPopup />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
