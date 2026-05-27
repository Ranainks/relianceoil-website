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
import EidGreeting from './components/EidGreeting'
import WhatsAppButton from './components/WhatsAppButton'
import { PortalAuthProvider } from './contexts/PortalAuth'
import { AdminAuthProvider } from './contexts/AdminAuth'
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
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const Safety = lazy(() => import('./pages/Safety'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const Reviews = lazy(() => import('./pages/Reviews'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const PortalLogin = lazy(() => import('./pages/portal/PortalLogin'))
const PortalDashboard = lazy(() => import('./pages/portal/PortalDashboard'))
const PortalOrders = lazy(() => import('./pages/portal/PortalOrders'))
const PortalInvoices = lazy(() => import('./pages/portal/PortalInvoices'))
const PortalAccount = lazy(() => import('./pages/portal/PortalAccount'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS'))
const AdminCareers = lazy(() => import('./pages/admin/AdminCareers'))
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes'))

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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/portal" element={<PortalLogin />} />
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
          <Route path="/portal/orders" element={<PortalOrders />} />
          <Route path="/portal/invoices" element={<PortalInvoices />} />
          <Route path="/portal/account" element={<PortalAccount />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/overview" element={<AdminOverview />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/cms" element={<AdminCMS />} />
          <Route path="/admin/careers" element={<AdminCareers />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/quotes" element={<AdminQuotes />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

function AppShell({ loading }) {
  const location = useLocation()
  const isPortal = location.pathname.startsWith('/portal')
  const isAdmin = location.pathname.startsWith('/admin')
  const hideChrome = isPortal || isAdmin || location.pathname === '/reset-password'
  if (loading) return null
  return (
    <>
      {!hideChrome && <Navbar />}
      {!hideChrome && <FuelPriceTicker />}
      {!hideChrome && <MayDayPopup />}
      {!hideChrome && <EidGreeting />}
      <main><AnimatedRoutes /></main>
      {!hideChrome && <Footer />}
      {!hideChrome && <WhatsAppButton />}
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
      <AdminAuthProvider>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <AppShell loading={loading} />
      </AdminAuthProvider>
      </PortalAuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
