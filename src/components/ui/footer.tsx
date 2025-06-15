import Link from "next/link";

const Footer = () => {
  const glowingTextClass =
    "hover:text-green-500 hover:transition-all duration-300";
  const glowingShadowClass =
    "hover:text-shadow-lg hover:text-shadow-green-500 transition-shadow duration-300";

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div>
            <h3 className={`text-xl font-bold mb-4 ${glowingTextClass} glowing-text`}>
              ChatPulse
            </h3>
            <p className={`text-sm ${glowingTextClass}`}>
              Your AI-powered document assistant
            </p>
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${glowingTextClass} glowing-text`}>
              Quick Links
            </h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/" className={glowingTextClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className={glowingTextClass}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={glowingTextClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contactus" className={glowingTextClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${glowingTextClass} glowing-text`}>
              Connect
            </h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className={glowingTextClass}>
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className={glowingTextClass}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className={glowingTextClass}>
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className={glowingTextClass}>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${glowingTextClass} glowing-text`}>
              About Us
            </h4>
            <p className={`text-sm mb-4 ${glowingTextClass}`}>
              ChatPulse is a cutting-edge AI-powered document assistant designed to streamline your document management processes. From creating and editing to organizing and sharing.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          <p className={glowingTextClass}>
            © {new Date().getFullYear()} ChatPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;