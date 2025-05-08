"use client"

import Link from "next/link"
import { Activity, Github, Mail, Twitter, Linkedin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { WaveAnimation } from "@/components/wave-animation"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 mt-12 overflow-hidden">
      {/* Wave Animation Background */}
      <WaveAnimation />

      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-teal-600 dark:text-teal-400 mb-4">
              <Activity className="h-6 w-6" />
              <span>SepsisAI</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Advanced AI-powered system for early detection of sepsis using patient vital signs and lab results.
            </p>
            <div className="flex space-x-3">
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Upload", path: "/upload" },
                { name: "Results", path: "/results" },
                { name: "Export", path: "/export" },
                { name: "About", path: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Link
                      href={link.path}
                      className="text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { name: "Documentation", path: "#" },
                { name: "API Reference", path: "#" },
                { name: "Research Papers", path: "#" },
                { name: "Clinical Trials", path: "#" },
                { name: "FAQ", path: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Link
                      href={link.path}
                      className="text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates on our research and model improvements.
            </p>
            <motion.div
              className="flex"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 text-sm w-full"
              />
              <Button className="rounded-l-none bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600">
                <Mail className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© {currentYear} SepsisAI. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-400">
            <Link href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

        <motion.div
          className="text-center mt-8 text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for healthcare professionals worldwide
        </motion.div>
      </div>
    </footer>
  )
}
