import { Github } from 'lucide-react'
import { Button } from './ui/button'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-primary mb-4">File Vault</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Secure, decentralized file storage powered by Filecoin blockchain and Lighthouse storage.
              Store your files with confidence on the decentralized web.
            </p>
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              View on GitHub
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-600 hover:text-primary text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-primary text-sm">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-600 hover:text-primary text-sm">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://docs.filecoin.io/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary text-sm">
                  Filecoin Docs
                </a>
              </li>
              <li>
                <a href="https://www.lighthouse.storage/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary text-sm">
                  Lighthouse
                </a>
              </li>
              <li>
                <a href="https://fvm.filecoin.io/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary text-sm">
                  FVM
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} File Vault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
