const Pricing = () => {
  return (
    <section className="py-16  transition-colors duration-300" id="pricing">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 text-foreground transition-colors duration-300">Pricing</h2>
        <p className="text-center text-lg text-muted-foreground mb-12 transition-colors duration-300">Choose the plan that fits your needs. Simple and transparent pricing.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="border rounded-lg shadow-lg p-8 flex flex-col items-center bg-card transition-colors duration-300">
            <h3 className="text-2xl font-semibold mb-2 text-foreground transition-colors duration-300">Free</h3>
            <p className="text-4xl font-bold mb-4 text-foreground transition-colors duration-300">$0<span className="text-base font-normal">/mo</span></p>
            <ul className="mb-6 text-muted-foreground transition-colors duration-300">
              <li className="mb-2">✔ Basic file storage</li>
              <li className="mb-2">✔ Limited AI queries</li>
              <li className="mb-2">✔ Community support</li>
            </ul>
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Get Started</button>
          </div>
          {/* Pro Plan */}
          <div className="border-2 border-primary rounded-lg shadow-xl p-8 flex flex-col items-center bg-card scale-105 transition-colors duration-300">
            <h3 className="text-2xl font-semibold mb-2 text-primary">Pro</h3>
            <p className="text-4xl font-bold mb-4 text-primary">$12<span className="text-base font-normal text-muted-foreground">/mo</span></p>
            <ul className="mb-6 text-muted-foreground transition-colors duration-300">
              <li className="mb-2">✔ Unlimited file storage</li>
              <li className="mb-2">✔ Priority AI access</li>
              <li className="mb-2">✔ File sharing & collaboration</li>
              <li className="mb-2">✔ Email support</li>
            </ul>
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Upgrade</button>
          </div>
          {/* Enterprise Plan */}
          <div className="border rounded-lg shadow-lg p-8 flex flex-col items-center bg-card transition-colors duration-300">
            <h3 className="text-2xl font-semibold mb-2 text-foreground transition-colors duration-300">Enterprise</h3>
            <p className="text-4xl font-bold mb-4 text-foreground transition-colors duration-300">Custom</p>
            <ul className="mb-6 text-muted-foreground transition-colors duration-300">
              <li className="mb-2">✔ Advanced security & compliance</li>
              <li className="mb-2">✔ Custom integrations</li>
              <li className="mb-2">✔ Dedicated support</li>
              <li className="mb-2">✔ SLA & onboarding</li>
            </ul>
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
