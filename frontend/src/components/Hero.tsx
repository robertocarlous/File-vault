import { Button } from "./ui/button";
import { ArrowRight, Shield, Database, Coins } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";
import "../pages/style/anim.css";
// import { useScrollAnimation } from "./useScrollAnimation"; // adjust path as needed

const Hero = () => {
  const controls = useAnimation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const runAnimation = async () => {
      await controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.9, ease: "easeOut", delay: 2 },
      });
      controls.start({
        y: [0, -10, 0],
        transition: {
          duration: 2,
          delay: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    };

    runAnimation();
  }, [controls]);

  // const fadeInUp1 = useScrollAnimation();
  // const fadeInUp2 = useScrollAnimation();

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
            <div style={{ overflowY: "hidden" }}>
              <motion.h1
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
              >
                Secure File Storage on the{" "}
                <span className="text-primary">Decentralized Web</span>
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-6 text-lg leading-8 text-muted-foreground"
            >
              Store your files securely on the Filecoin blockchain using
              Lighthouse storage. Decentralized, encrypted, and always
              accessible.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button
                className="gap-2"
                onClick={() => {
                  const fileManagerElement =
                    document.getElementById("file-manager");
                  if (fileManagerElement) {
                    fileManagerElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Start Uploading
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline">Learn More</Button>
            </motion.div>
          </div>

          {theme === "dark" ? (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={controls}
              className="drewFloatx"
            ></motion.div>
          ) : (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={controls}
              className="drewFloat"
            ></motion.div>
          )}

          {/* Features */}
          <div className="mx-auto mt-20 max-w-lg sm:mt-24 lg:mt-24">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
              {/* Security Feature */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.5 }}
                viewport={{
                  once: true,
                }}
                className="text-center"
              >
                <div className="flex justify-center">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-6 text-sm font-medium text-foreground">
                  End-to-End Encryption
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your files are encrypted before upload
                </p>
              </motion.div>

              {/* Storage Feature */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 2.0 }}
                viewport={{
                  once: true,
                }}
                className="text-center"
              >
                <div className="flex justify-center">
                  <Database className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-6 text-sm font-medium text-foreground">
                  Decentralized Storage
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Files stored on IPFS & Filecoin
                </p>
              </motion.div>

              {/* Cost Feature */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 2.5 }}
                className="text-center sm:mx-auto lg:mx-0"
              >
                <div className="flex justify-center">
                  <Coins className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-6 text-sm font-medium text-foreground">
                  Cost Effective
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pay only for what you store
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
