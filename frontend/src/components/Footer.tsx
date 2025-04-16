import { Github } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-background border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
            className="col-span-1 md:col-span-2"
          >
            <h3 className="text-lg font-bold text-primary mb-4">File Vault</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Secure, decentralized file storage powered by Filecoin blockchain
              and Lighthouse storage. Store your files with confidence on the
              decentralized web.
            </p>
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              View on GitHub
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1.5 }}
          >
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://docs.filecoin.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Filecoin Docs
                </a>
              </li>
              <li>
                <a
                  href="https://www.lighthouse.storage/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Lighthouse
                </a>
              </li>
              <li>
                <a
                  href="https://fvm.filecoin.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  FVM
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 2 }}
          className="border-t border-border mt-12 pt-8"
        >
          <p className="text-center text-muted-foreground text-sm">
            {new Date().getFullYear()} File Vault. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
