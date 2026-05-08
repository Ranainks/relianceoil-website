import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { trackPageView } from './utils/analytics'
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
import { PortalAuthProvider } from './contexts/PortalAuth'
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
const OrderFuel = lazy(() => import('./pages/OrderFuel'))
const BulkFuelSupply = lazy(() => import('./pages/BulkFuelSupply'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const Safety = lazy(() => import('./pages/Safety'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const Reviews = lazy(() => import('./pages/Reviews'))
const PortalLogin = lazy(() => import('./pages/portal/PortalLogin'))
const PortalDashboard = lazy(() => import('./pages/portal/PortalDashboard'))
const PortalOrders = lazy(() => import('./pages/portal/PortalOrders'))
const PortalInvoices = lazy(() => import('./pages/portal/PortalInvoices'))
const PortalAccount = lazy(() => import('./pages/portal/PortalAccount'))

function AnimatedRoutes() {
  const location = useLocation()
  useEffect(() => { trackPageView(location.pathname) }, [location.pathname])
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
          <Route path="/order-fuel" element={<OrderFuel />} />
          <Route path="/bulk-fuel-supply" element={<BulkFuelSupply />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/portal" element={<PortalLogin />} />
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
          <Route path="/portal/orders" element={<PortalOrders />} />
          <Route path="/portal/invoices" element={<PortalInvoices />} />
          <Route path="/portal/account" element={<PortalAccount />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

function AppShell({ loading }) {
  const location = useLocation()
  const isPortal = location.pathname.startsWith('/portal')
  if (loading) return null
  return (
    <>
      {!isPortal && <Navbar />}
      {!isPortal && <FuelPriceTicker />}
      {!isPortal && <MayDayPopup />}
      <main><AnimatedRoutes /></main>
      {!isPortal && <Footer />}
      {!isPortal && <WhatsAppButton />}
    </>
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
      <PortalAuthProvider>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <AppShell loading={loading} />
      </PortalAuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
