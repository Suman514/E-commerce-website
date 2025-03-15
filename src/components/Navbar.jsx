import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/style.css";
import logo from "../assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faChevronDown, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 767); // State to check mobile view
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch categories from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/categories")
      .then((response) => {
        console.log("Categories:", response.data); // Debugging
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle subcategory click
  const handleSubcategoryClick = (subcategory) => {
    navigate(`/products?category=${encodeURIComponent(subcategory)}`);
    setActiveMenu(null); // Close the dropdown after navigation
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Update mobile view state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Main Navbar */}
      <nav className="navbar">
        {/* Logo on the left */}
        <div className="navbar-brand">
          <img src={logo} alt="Logo" />
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </div>

        {/* Navbar Links */}
        <ul className={`navbar-nav ${isMobileMenuOpen ? "open" : ""}`}>
          {/* Navigation Items */}
          {categories.map((category, index) => (
            <li key={index} className="relative">
              <button
                className="hover:text-blue-500 cursor-pointer"
                onClick={() => {
                  if (category.title === "Home") {
                    navigate("/"); // Navigate to home
                  } else {
                    setActiveMenu(activeMenu === category.title ? null : category.title);
                  }
                }}
              >
                {category.title}{" "}
                {/* Show dropdown icon only on desktop */}
                {!isMobileView && category.title !== "Home" && (
                  <span className="ml-1">
                    <FontAwesomeIcon icon={faChevronDown} />
                  </span>
                )}
              </button>

              {/* Dropdown for other categories */}
              {activeMenu === category.title && category.subcategories && (
                <div
                  ref={menuRef}
                  className="absolute left-0 top-full mt-2 w-60 bg-white shadow-lg p-4 border rounded-lg z-50"
                >
                  <h3 className="font-semibold text-gray-700 mb-2">{category.title}</h3>
                  <ul className="space-y-2 text-gray-600">
                    {category.subcategories.map((sub, i) => (
                      <li
                        key={i}
                        className="hover:text-blue-500 cursor-pointer"
                        onClick={() => handleSubcategoryClick(sub)}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
          <div className="top-buttons">

          <button className="cart">
     {/* Cart Button */}
     <li className="text-black font-semibold">
            <a href="/pages/Cart">Cart</a> <FontAwesomeIcon icon={faCartShopping} />
          </li>
</button>
       
<button className="login"> <li className="font-semibold">
            <a href="/pages/LoginSignupPage">
              <FontAwesomeIcon icon={"lock"} /> Login 
            </a>
          </li></button>
          </div>

          {/* Login/Logout Button */}
         
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;