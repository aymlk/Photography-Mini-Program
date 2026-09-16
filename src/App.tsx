import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Works from './sections/Works'
import Features from './sections/Features'
import Contact from './sections/Contact'

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <About />
      <Services />
      <Works />
      <Features />
      <Contact />
    </div>
  )
}