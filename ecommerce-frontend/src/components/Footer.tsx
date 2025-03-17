import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6">
      <div className="container mx-auto grid md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2">E-Shop</h2>
          <p className="text-gray-400">Your one-stop shop for premium products.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/shop" className="text-gray-400 hover:text-white transition" aria-label="navigating to the shop">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-400 hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-400 hover:text-white transition">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="www.facebook.com" className="text-gray-400 hover:text-white transition" aria-label="navigating to the facebook">
              <FaFacebookF size={20} />
            </a>
            <a href="www.twitter.com" className="text-gray-400 hover:text-white transition" aria-label="navigating to the twitter">
              <FaTwitter size={20} />
            </a>
            <a href="www.instagram.com" className="text-gray-400 hover:text-white transition" aria-label="navigating to the instagram">
              <FaInstagram size={20} />
            </a>
            <a href="www.linkedin.com" className="text-gray-400 hover:text-white transition" aria-label="navigating to the linkedin">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 text-center border-t border-gray-700 pt-4">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
