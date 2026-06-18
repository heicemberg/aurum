import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Security from '@/components/Security'
import Team from '@/components/Team'
import CapitalSimulator from '@/components/CapitalSimulator'
import Plans from '@/components/Plans'
import Results from '@/components/Results'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import Register from '@/pages/Register'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Admin from '@/pages/Admin'

function Landing() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 })
    let rafId: number
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Security />
        <Team />
        <CapitalSimulator />
        <Plans />
        <Results />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
