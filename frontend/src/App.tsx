import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import FileManager from './pages/FileManager'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'


  

function App() {
  return (
    // <div className="min-h-screen">
    //   <Navbar />
    //   <main>
    //     <Hero />
    //     <HowItWorks />
    //     <FileManager />
    //   </main>
    //   <Footer />
    // </div>
    <BrowserRouter>
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <main className='flex-1'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/files" element={<FileManager />} />
            <Route path='*' element={<h1 className="text-2xl text-center py-12 text-gray-900">Page Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
