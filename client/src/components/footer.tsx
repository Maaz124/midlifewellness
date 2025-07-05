import { Link } from "wouter";
import { Logo } from '@/components/logo';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Shield,
  FileText,
  HelpCircle
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo size="lg" variant="light" className="mb-4" />
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Empowering women through midlife transitions with evidence-based wellness coaching, 
                mindfulness training, and comprehensive health assessments.
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Dr. Sidra Bukhari, MRCPsych (UK)</h4>
              <p className="text-gray-400 text-sm">
                Psychiatrist • NLP Life Coach • Mindfulness Trainer • Gynecologist
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Specialized in women's mental health and midlife wellness
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-lg hover:bg-purple-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Health Dashboard
                </Link>
              </li>
              <li>
                <Link href="/coaching" className="text-gray-300 hover:text-purple-400 transition-colors">
                  6-Week Program
                </Link>
              </li>
              <li>
                <Link href="/contact-coaching" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Personal Coaching
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Community Support
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Wellness Journal
                </Link>
              </li>
              <li>
                <Link href="/progress" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-purple-400 transition-colors">
                  About Dr. Sidra
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact & Support</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a href="mailto:hello@thrivemidlife.com" className="hover:text-purple-400 transition-colors">
                  hello@thrivemidlife.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a href="mailto:coaching@thrivemidlife.com" className="hover:text-purple-400 transition-colors">
                  coaching@thrivemidlife.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a href="mailto:support@thrivemidlife.com" className="hover:text-purple-400 transition-colors">
                  Technical Support
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Online Consultations Available</span>
              </li>
            </ul>

            {/* Response Time */}
            <div className="mt-6 p-3 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="text-purple-400 font-medium">24-Hour Response:</span> 
                <br />Personal coaching inquiries answered within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              <p>&copy; {currentYear} ThriveMidlife. All rights reserved.</p>
              <p className="mt-1">
                Created with <Heart className="inline w-4 h-4 text-red-500 mx-1" /> for women's wellness
              </p>
            </div>

            {/* Legal Links */}
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap space-x-6 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Medical Disclaimer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Medical Disclaimer:</strong> The information provided on ThriveMidlife is for educational and informational purposes only. 
              It is not intended as a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
              Dr. Sidra Bukhari is a licensed medical professional, but individual results may vary and this platform does not establish a doctor-patient relationship.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}