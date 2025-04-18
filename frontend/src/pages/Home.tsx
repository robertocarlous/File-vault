// import React from 'react'
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Pricing from "../components/Pricing";

const Home = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
    </div>
  );
};

export default Home;
