import { Button } from "./ui/button"
import { ArrowRight, Shield, Database, Coins } from 'lucide-react'

const Hero = () => {
  return (
    <div className="relative isolate">
      {/* Background */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      {/* Hero Content */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Secure File Storage on the{' '}
              <span className="text-primary">Decentralized Web</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Store your files securely on the Filecoin blockchain using Lighthouse storage. 
              Decentralized, encrypted, and always accessible.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button className="gap-2" onClick={() => {
                const fileManagerElement = document.getElementById('file-manager')
                if (fileManagerElement) {
                  fileManagerElement.scrollIntoView({ behavior: 'smooth' })
                }
              }}>
                Start Uploading
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>

          {/* Features */}
          <div className="mx-auto mt-20 max-w-lg sm:mt-24 lg:mt-24">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
              {/* Security Feature */}
              <div className="text-center">
                <div className="flex justify-center">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-6 text-sm font-medium text-gray-900">End-to-End Encryption</h3>
                <p className="mt-2 text-sm text-gray-600">Your files are encrypted before upload</p>
              </div>

              {/* Storage Feature */}
              <div className="text-center">
                <div className="flex justify-center">
                  <Database className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-6 text-sm font-medium text-gray-900">Decentralized Storage</h3>
                <p className="mt-2 text-sm text-gray-600">Files stored on IPFS & Filecoin</p>
              </div>

              {/* Cost Feature */}
              <div className="text-center sm:mx-auto lg:mx-0">
                <div className="flex justify-center">
                  <Coins className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-6 text-sm font-medium text-gray-900">Cost Effective</h3>
                <p className="mt-2 text-sm text-gray-600">Pay only for what you store</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
