import { Wallet, Upload, Key, Download } from "lucide-react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useScrollAnimation } from "./useScrollAnimation"; // adjust path as needed

const steps = [
  {
    name: "Connect Wallet",
    description:
      "Connect your Web3 wallet to get started. We support MetaMask and other popular wallets.",
    icon: Wallet,
  },
  {
    name: "Upload Files",
    description:
      "Select and upload your files. Pay a small fee in tokens plus gas fees for storage.",
    icon: Upload,
  },
  {
    name: "Get CID",
    description:
      "Receive a unique Content Identifier (CID) for your uploaded files from Lighthouse.",
    icon: Key,
  },
  {
    name: "Download Anytime",
    description: "Use your CID to download your files whenever you need them.",
    icon: Download,
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3, // 👈 1 second delay between each child
      delayChildren: 0, // optional, starts immediately
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 200 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};
const HowItWorks = () => {
  // const fadeInUp1 = useScrollAnimation();
  const fadeInUp2 = useScrollAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="py-24 sm:py-32" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={fadeInUp2.ref}
          initial={{ opacity: 0, y: 200 }}
          animate={fadeInUp2.controls}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-primary">
            Simple Process
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How File Vault Works
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Follow these simple steps to store your files securely on the
            decentralized web using Filecoin and Lighthouse storage.
          </p>
        </motion.div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <motion.dl
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4"
          >
            {steps.map((step) => (
              <motion.div
                variants={item}
                key={step.name}
                className="flex flex-col items-start"
              >
                <div className="rounded-md bg-primary/10 p-2 ring-1 ring-primary/10">
                  <step.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-4 flex items-center gap-x-2">
                  <div className="flex-none rounded-full bg-gray-400/10 p-1 ring-1 ring-gray-400/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">
                    {step.name}
                  </h3>
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
