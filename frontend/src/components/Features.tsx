const Features = () => {
  return (
    <section className="py-16  transition-colors duration-300" id="features">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 text-foreground transition-colors duration-300">Features</h2>
        <p className="text-center text-lg text-muted-foreground mb-12 transition-colors duration-300">Discover what makes File Vault the best choice for secure, AI-powered file management.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg shadow p-8 flex flex-col items-center transition-colors duration-300">
            <span className="text-primary text-5xl mb-4">🔒</span>
            <h3 className="text-xl font-semibold mb-2 text-foreground transition-colors duration-300">Secure Storage</h3>
            <p className="text-muted-foreground text-center transition-colors duration-300">Your files are encrypted and stored securely using decentralized technologies.</p>
          </div>
          <div className="bg-card rounded-lg shadow p-8 flex flex-col items-center transition-colors duration-300">
            <span className="text-primary text-5xl mb-4">🤖</span>
            <h3 className="text-xl font-semibold mb-2 text-foreground transition-colors duration-300">AI Assistance</h3>
            <p className="text-muted-foreground text-center transition-colors duration-300">Get instant answers and smart file management tips from our built-in AI assistant.</p>
          </div>
          <div className="bg-card rounded-lg shadow p-8 flex flex-col items-center transition-colors duration-300">
            <span className="text-primary text-5xl mb-4">🌐</span>
            <h3 className="text-xl font-semibold mb-2 text-foreground transition-colors duration-300">Web3 Integration</h3>
            <p className="text-muted-foreground text-center transition-colors duration-300">Seamlessly connect with blockchain and decentralized apps for next-gen file sharing.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
