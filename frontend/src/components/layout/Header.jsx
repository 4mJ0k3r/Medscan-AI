import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import ApiKeyManager from "../ApiKeyManager";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const helpMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  const handleApiKeySet = (apiKey) => {
    setHasApiKey(!!apiKey);
  };

  // Check for API key on mount
  useEffect(() => {
    const apiKey = localStorage.getItem('openai_api_key');
    setHasApiKey(!!apiKey);
  }, []);

  // Close help menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
        setShowHelpMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-b-[#e7edf4] px-10 py-3">
      {/* Left Logo and Brand */}
      <div className="flex items-center gap-4 text-[#0d141c]">
        <div className="size-4">
          {/* You can replace this with your SVG logo or icon */}
          <div className="w-4 h-4 bg-[#248bf3] rounded-full"></div>
        </div>
        <Link
          to="/"
          className="text-[#0d141c] text-lg font-bold"
        >
                      <h2>Medscan AI</h2>
        </Link>
        
      </div>

      {/* Right Navigation and Buttons */}
      <div className="flex flex-1 justify-end gap-8 items-center">
        {/* Nav links */}
        <div className="flex items-center gap-9">
          <Link
            to="/about"
            className="text-[#0d141c] text-sm font-medium hover:text-[#248bf3] transition-colors"
          >
            About
          </Link>
          <Link
            to="/services"
            className="text-[#0d141c] text-sm font-medium hover:text-[#248bf3] transition-colors"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-[#0d141c] text-sm font-medium hover:text-[#248bf3] transition-colors"
          >
            Contact
          </Link>
          {/* Show Dashboard link only when logged in */}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-[#0d141c] text-sm font-medium hover:text-[#248bf3] transition-colors"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Buttons + Globe + Avatar */}
        <div className="flex items-center gap-2">
          {/* API Key Status - only show when logged in */}
          {isAuthenticated && (
            <button
              onClick={() => setShowApiKeyModal(true)}
              className={`h-10 px-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                hasApiKey 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
              title={hasApiKey ? 'API Key Configured' : 'API Key Required'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"/>
              </svg>
              <span className="hidden sm:inline">
                {hasApiKey ? 'API Key' : 'Setup API'}
              </span>
            </button>
          )}

          {/* Show Login/Register buttons only when not logged in */}
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="h-10 px-4 rounded-lg bg-[#e7edf4] text-[#0d141c] text-sm font-bold flex items-center justify-center hover:bg-[#cedbe8] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="h-10 px-4 rounded-lg bg-[#248bf3] text-white text-sm font-bold flex items-center justify-center hover:bg-[#0c7ff2] transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            /* Show logout button when logged in */
            <button
              onClick={handleLogout}
              className="h-10 px-4 rounded-lg bg-[#e7edf4] text-[#0d141c] text-sm font-bold flex items-center justify-center hover:bg-[#cedbe8] transition-colors"
            >
              Logout
            </button>
          )}

          {/* Help/Info Button */}
          <div className="relative" ref={helpMenuRef}>
            <button 
              onClick={() => setShowHelpMenu(!showHelpMenu)}
              className="flex h-10 px-2.5 rounded-lg bg-[#e7edf4] text-[#0d141c] gap-2 text-sm font-bold tracking-[0.015em] min-w-0 items-center justify-center hover:bg-[#cedbe8] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
              </svg>
            </button>
            
            {showHelpMenu && (
              <div className="absolute right-0 top-12 bg-white border border-[#cedbe8] rounded-lg shadow-lg py-2 z-50 min-w-[200px]">
                <div className="px-4 py-2 text-sm text-[#49739c] border-b border-[#e7edf4]">
                  Help & Support
                </div>
                <Link
                  to="/about"
                  className="block px-4 py-2 text-sm text-[#0d141c] hover:bg-[#e7edf4] transition-colors"
                  onClick={() => setShowHelpMenu(false)}
                >
                  About Medscan AI
                </Link>
                <Link
                  to="/services"
                  className="block px-4 py-2 text-sm text-[#0d141c] hover:bg-[#e7edf4] transition-colors"
                  onClick={() => setShowHelpMenu(false)}
                >
                  Our Services
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-sm text-[#0d141c] hover:bg-[#e7edf4] transition-colors"
                  onClick={() => setShowHelpMenu(false)}
                >
                  Contact Support
                </Link>
                <Link
                  to="/testing-guide"
                  className="block px-4 py-2 text-sm text-[#0d141c] hover:bg-[#e7edf4] transition-colors"
                  onClick={() => setShowHelpMenu(false)}
                >
                  Testing Guide
                </Link>
                <button
                  onClick={() => {
                    setShowHelpMenu(false);
                    window.open('mailto:support@healthinsights.com?subject=Help Request', '_blank');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-[#0d141c] hover:bg-[#e7edf4] transition-colors"
                >
                  Email Support
                </button>
              </div>
            )}
          </div>

          {/* Avatar - only show when logged in */}
          {isAuthenticated && (
            <Link to="/dashboard">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:ring-2 hover:ring-[#248bf3] transition-all"
                style={{
                  backgroundImage: `url("${user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYkcV9l1g9Aigafs2LCqHAaWLHlwTNC9xf7qXc31a99W1KF2qorhTIMkE5_e-RTDL3owcxbvCjOWqHtMf0zWgW3ZLvKnFRVToNK7YiIcITW3kcm_JUemHpfwdQ-8otMi9aTc4CMD1PlROQ5dh4-43pYCeTPNR3dNFjQyBHkaF00WaLgC3rz5s_zfveOfYif5BqrEeWJ3hIC1OPk_6SE1z_8ltEQ30bZb_X88bnv5cKpqRbx9-uTFZxoLmCoNCDj08Ccr9bpJ2XwdI'}")`,
                }}
              ></div>
            </Link>
          )}
        </div>
      </div>

      {/* API Key Manager Modal */}
      <ApiKeyManager
        showModal={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onApiKeySet={handleApiKeySet}
      />
    </header>
  );
};

export default Header;
