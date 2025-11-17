import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
// Using next/router for Pages Router compatibility (pathname and push method)
import { useRouter, usePathname } from "next/navigation"; 

import {
  FaBars,
  FaRegFilePdf,
  FaShoppingBag,
  FaStar,
  FaUser,
  FaUserAlt,
} from "react-icons/fa";
import { BsHandbag, BsHeart } from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";

import UserService from "../services/Cart";
import Userservice from "../services/Auth";
import FilterServices from "../services/Filter";
import profileService from "../services/Auth";

import { WishlistSystem } from "../context/WishListContext";
import { CartSystem } from "../context/CartContext";
import { ProfileSystem } from "../context/ProfileContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ReadyDesignCartSystem } from "../context/ReadyDesignCartContext";
import axios from "axios";

// Environment variable should use NEXT_PUBLIC_ prefix for client-side access
const api = process.env.NEXT_PUBLIC_API_KEY || process.env.REACT_APP_API_KEY;

const Navbar = () => {
  const router = useRouter();
  const navbarRef = useRef(null);
  const currentRoute = usePathname();
  
  // --- Context Hooks ---
  const { cartItems } = useContext(CartSystem);
  const { state: cartstate } = useContext(CartSystem);
  const { readyCartItems } = useContext(ReadyDesignCartSystem);
  const { state: readycartstate } = useContext(ReadyDesignCartSystem);
  const { wishlistItems } = useContext(WishlistSystem);
  const { state: wishliststate } = useContext(WishlistSystem);
  const { state: imagestate } = useContext(ProfileSystem);
  const { state: namestate } = useContext(ProfileSystem);

  // --- State for Client-side Data and UI ---
  const [colorChange, setColorchange] = useState(false);
  const [profileData, setProfileData] = useState('');
  const [image, setImage] = useState('');
  const [ProfileMenu, setProfileMenu] = useState(false);
  const ProfileRef = useRef(null);
  const [dealerData, setDealerData] = useState(null);
  const [tags, setTags] = useState([]);
  const [TagDropdown, setTagDropdown] = useState(false);
  const tagRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Auth States (Initialized in useEffect for client-side safety)
  const [Dealer, setDealer] = useState(null);
  const [DealerEmail, setDealerEmail] = useState(null);
  const [Phone, setPhone] = useState(null);

  // --- 1. Client-Side State Initialization (localStorage) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDealer(localStorage.getItem("token"));
      setDealerEmail(localStorage.getItem("email"));
      setPhone(localStorage.getItem("phone"));
    }
  }, []);

  // --- Update auth state on route changes (e.g., after login) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDealer(localStorage.getItem("token"));
      setDealerEmail(localStorage.getItem("email"));
      setPhone(localStorage.getItem("phone"));
    }
  }, [currentRoute]);

  // --- Listen for storage events (cross-tab updates) and custom login events ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "phone" || e.key === "email") {
        setDealer(localStorage.getItem("token"));
        setDealerEmail(localStorage.getItem("email"));
        setPhone(localStorage.getItem("phone"));
      }
    };

    const handleAuthUpdate = () => {
      setDealer(localStorage.getItem("token"));
      setDealerEmail(localStorage.getItem("email"));
      setPhone(localStorage.getItem("phone"));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStateChanged", handleAuthUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthUpdate);
    };
  }, []);

  // --- 2. Data Fetching Functions ---

  const Tags = () => {
    FilterServices.headerTags()
      .then((res) => setTags(res?.data?.header_tags || []))
      .catch((err) => console.log(err));
  };

  const UserCartItems = () => {
    if (!Phone) return;
    UserService.CartList({ phone: Phone })
      .catch((err) => console.log(err));
      // Note: Setting cart count is handled by CartContext in original, keeping calls for side effect/context update
  };

  const GetUserCartList = async () => {
    if (!Phone || !api) return;
    axios
      .post(api + "ready/cart-list", { phone: Phone })
      .then((res) => {
        // Setting cart quantity state if context state is not used directly
        // setCartItemsQu(res?.data?.data?.total_qty || 0);
      })
      .catch((err) => console.log(err));
  };

  const UserWishlist = () => {
    if (!Phone) return;
    Userservice.userWishlist({ phone: Phone })
      .catch((err) => console.log(err));
      // Note: Setting wishlist count is likely handled by WishlistContext
  };

  const getUserProfile = () => {
    if (!Phone) return;
    profileService
      .getProfile({ phone: Phone })
      .then((res) => {
        setProfileData(res.data?.name || '');
        setImage(res.data?.profile || '');
      })
      .catch((err) => console.log(err));
  };

  const getProfileData = () => {
    if (!DealerEmail || !Dealer) return;
    profileService
      .profile({ email: DealerEmail, token: Dealer })
      .then((res) => {
        setDealerData(res.data);
      })
      .catch((err) => console.log(err));
  };

  // --- 3. Data Fetching Effects ---
  // Replaced useLayoutEffect with useEffect for SSR safety

  useEffect(() => { Tags(); }, []);
  
  useEffect(() => { GetUserCartList(); }, [readyCartItems, Phone]);

  useEffect(() => { UserCartItems(); }, [cartItems, Phone]);

  useEffect(() => { UserWishlist(); }, [wishlistItems, Phone]);

  useEffect(() => {
    if (Phone) { getUserProfile(); }
  }, [Phone, namestate?.profilename, imagestate?.image]);

  useEffect(() => {
    if (DealerEmail) { getProfileData(); }
  }, [DealerEmail, imagestate?.image]);


  // --- 4. Logic/UI Handlers ---
  
  const handleLogout = () => {
    if (typeof window === 'undefined') return;

    const clearLocalStorage = () => {
        // Clearing all related items
        localStorage.clear(); 
    };

    clearLocalStorage();
    
    // Update state immediately after logout
    setDealer(null);
    setDealerEmail(null);
    setPhone(null);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("authStateChanged"));
    
    // Use router.push for navigation
    if (Dealer) {
      router.push("/dealer-login");
    } else {
      // Note: Passing { state: { from: location.pathname } } is React Router specific. 
      // In Next.js, this is done via query params or is generally unnecessary as the previous path is lost on hard navigation.
      router.push('/login'); 
    }
  };

  // This effect manages the sticky header state based on scroll.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const changeNavbarColor = () => {
      const scrollValue = document?.documentElement?.scrollTop;
      scrollValue > 0 ? setColorchange(true) : setColorchange(false);
    };
    
    window.addEventListener("scroll", changeNavbarColor);
    return () => window.removeEventListener("scroll", changeNavbarColor);
  }, []);

  const TagsDropdown = () => { setTagDropdown(!TagDropdown); };
  const ProfileDP = () => { setProfileMenu(!ProfileMenu); };
  // const DispatchLink = () => { setDispatch(!dispatch); }; // Dispatch related state removed as it wasn't fully connected

  // --- Click Outside Handlers (Combined into one cleanup effect for efficiency) ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ProfileRef.current && !ProfileRef.current.contains(event.target)) {
        setProfileMenu(false);
      }
      if (tagRef.current && !tagRef.current.contains(event.target)) {
        setTagDropdown(false);
      }
      // Note: DispatchRef handling removed as Dispatch state was not used in JSX
    };

    const handleScrollClose = () => {
      setProfileMenu(false);
      setTagDropdown(false);
      // setDispatch(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollClose);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollClose);
    };
  }, []);
  
  // --- Navbar Collapse Handler ---
  
  const handleNavClick = () => {
    setIsCollapsed(!isCollapsed);
    setTagDropdown(false);
  };

  const handleLinkClick = () => {
    setIsCollapsed(true);
    setTagDropdown(false);
  };
  
  const handleScroll = () => {
    if (typeof window === 'undefined') return;
    const navbar = navbarRef.current;
    if (navbar && !isCollapsed) { // Only collapse if it's currently open
      setIsCollapsed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [isCollapsed]);


  // --- Tooltip Definitions ---
  const wishlistTip = <Tooltip id="tooltip">wishlist</Tooltip>;
  const cartTip = <Tooltip id="tooltip">cart</Tooltip>;
  const readyCartTip = <Tooltip id="tooltip">Ready design cart</Tooltip>;

  // --- Render (UI structure maintained) ---

  return (
    <header
      className={`${colorChange === true ? "header sticky_header" : "header"}`}
    >
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <div className="header_inner">
            <button
              className="navbar-toggler"
              type="button"
              onClick={handleNavClick}
              aria-controls="navbarSupportedContent"
              aria-expanded={!isCollapsed}
              aria-label="Toggle navigation"
            >
              {isCollapsed ? (
                <FaBars className="navbar-icon-bar" />
              ) : (
                <AiOutlineClose className="navbar-icon-bar" />
              )}
            </button>
            <div
              className={`collapse navbar-collapse ${
                isCollapsed ? "" : "show"
              }`}
              id="navbarSupportedContent"
              ref={navbarRef}
            >
              <ul className="navbar-nav mb-2 mb-lg-0 w-100">
                <li className="nav-item">
                  <Link
                    className={
                      currentRoute === "/" ? "nav-link active" : "nav-link"
                    }
                    aria-current="page"
                    href="/"
                    onClick={handleLinkClick}
                  >
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={
                      currentRoute === "/ready-to-dispatch"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    aria-current="page"
                    href="/ready-to-dispatch"
                    onClick={handleLinkClick}
                  >
                    Ready Jewellery
                  </Link>
                </li>

                <li className="nav-item make-order-nav-item">
                  <div onClick={TagsDropdown} ref={tagRef}>
                    <div
                      className={`make-by-order-dropdown ${
                        TagDropdown ? "active" : ""
                      }`}
                    >
                      <div className="row">
                        {tags?.length ? (
                          <>
                            <div className="col-md-2">
                              <div className="tags-links">
                                <Link
                                  className={
                                    currentRoute === "/shop"
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "800",
                                    textTransform: "uppercase",
                                  }}
                                  href="/shop"
                                  onClick={() => {
                                    handleNavClick();
                                  }}
                                >
                                  All Jewellery
                                </Link>
                              </div>
                            </div>

                            {tags?.map((multitags, index) => {
                                // Construct Next.js dynamic path (without tag_id in query params)
                                const tagSlug = encodeURIComponent(multitags.name.toLowerCase().replace(/\s+/g, '-'));
                                const linkPath = `/shop/${tagSlug}`;
                                
                                return(
                                    <div className="col-md-2" key={index}>
                                        <div className="tags-links">
                                            <Link
                                            href={linkPath}
                                            className="nav-link"
                                            onClick={handleNavClick}
                                            >
                                            {multitags.name}
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                          </>
                        ) : (
                          <>
                            <Link
                              className={
                                currentRoute === "/shop"
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                              style={{ fontSize: "17px", fontWeight: "800" }}
                              href="/shop"
                              onClick={handleNavClick}
                            >
                              All Jwellery
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    <span
                      className={`nav-link dropdown-toggle ${
                        currentRoute.startsWith("/shop") // Use startsWith for dynamic links
                          ? "nav-link active"
                          : "nav-link"
                      }`}
                      style={{
                        fontWeight: "500",
                        textTransform: "uppercase",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Make by order
                    </span>
                  </div>
                </li>

                <li className="nav-item">
                  <Link
                    className={
                      currentRoute === "/customization"
                        ? "nav-link active"
                        : "nav-link"
                    }
                    href="/customization"
                    onClick={handleLinkClick}
                  >
                    Customization
                  </Link>
                </li>
              </ul>
            </div>

            <Link className="navbar-brand m-0" href="/">
              {/* Corrected path for Logo */}
              <img src="/assets/images/logo.png" alt="logo" height={70} /> 
            </Link>

            <div className="header_icon">
              <ul>
                <li className="m-0">
                  {Dealer && (
                    <ul>
                      {/* DEALER MENU ITEMS */}
                      <li className="login_user" id="user-profile">
                        <div
                          className="profile"
                          onClick={ProfileDP}
                          ref={ProfileRef}
                        >
                          <div
                            className={`menu ${ProfileMenu ? "active" : ""}`}
                          >
                            <ul>
                              <li>
                                <Link href="/dealer-profile">
                                  <FaUser /> My Profile
                                </Link>
                              </li>
                              <li>
                                <Link href="/my-orders">
                                  <FaCartShopping /> My Orders
                                </Link>
                              </li>
                              <li>
                                <Link href="/my-ready-orders">
                                  <FaShoppingBag /> My Ready Orders
                                </Link>
                              </li>
                              <li>
                                <Link href="/dealer-wishlist">
                                  <FaStar /> My Selections
                                </Link>
                              </li>
                              <li>
                                <Link href="/create-pdf">
                                  <FaRegFilePdf /> Create PDF
                                </Link>
                              </li>
                              <li>
                                <Link href="/" onClick={handleLogout}>
                                  <IoLogOut />
                                  Logout
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div className="img-box">
                            {dealerData?.profile ? (
                              <img
                                src={dealerData?.profile}
                                alt=""
                                className="uploaded-image w-100"
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <>
                                <img
                                  src='/assets/images/user-demo-image.png'
                                  alt=""
                                  className="uploaded-image w-100"
                                  style={{
                                    borderRadius: "50%",
                                  }}
                                />
                              </>
                            )}
                          </div>
                          <div className="user dropdown-toggle">
                            {dealerData?.name ? (
                              <span className="ms-2">
                                <b
                                  style={{
                                    fontSize: "20px",
                                  }}
                                >
                                  {dealerData?.name}
                                </b>
                              </span>
                            ) : (
                              <>
                                <span className="ms-2">
                                  <b
                                    style={{
                                      fontSize: "20px",
                                    }}
                                  >
                                    Hello! Dealer
                                  </b>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  )}
                  {Phone && (
                    <ul>
                      {/* USER ICONS (Wishlist, Cart, Ready Cart) */}
                      <li>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={wishlistTip}
                        >
                          <Link className="icon" href="/wishlist">
                            <BsHeart
                              style={{ fontSize: "20px", color: "black" }}
                            />
                            {wishliststate.wishlistItems > 0 && (
                              <div className="cart_count">
                                {wishliststate.wishlistItems}
                              </div>
                            )}
                          </Link>
                        </OverlayTrigger>
                      </li>
                      <li>
                        <OverlayTrigger placement="bottom" overlay={cartTip}>
                          <Link className="icon" href="/cart">
                            <BsHandbag
                              style={{ fontSize: "20px", color: "black" }}
                            />
                            {cartstate.cartItems > 0 && (
                              <div className="cart_count">
                                {cartstate.cartItems}
                              </div>
                            )}
                          </Link>
                        </OverlayTrigger>
                      </li>
                      <li>
                        <OverlayTrigger
                          placement="bottom"
                          overlay={readyCartTip}
                        >
                          <Link className="icon" href="/ready-design-cart">
                            <HiMiniShoppingBag
                              style={{ fontSize: "23px", color: "black" }}
                            />
                            {readycartstate.readyCartItems > 0 && (
                              <div className="cart_count">
                                {readycartstate.readyCartItems}
                              </div>
                            )}
                          </Link>
                        </OverlayTrigger>
                      </li>
                      
                      {/* USER PROFILE MENU */}
                      <li className="login_user" id="user-profile">
                        <div
                          className="profile"
                          onClick={ProfileDP}
                          ref={ProfileRef}
                        >
                          <div
                            className={`menu ${ProfileMenu ? "active" : ""}`}
                          >
                            <ul>
                              <li>
                                <Link href="/profile">
                                  <FaUser />
                                  My Profile
                                </Link>
                              </li>
                              <li>
                                <Link href="/my-orders">
                                  <FaCartShopping />
                                  My Orders
                                </Link>
                              </li>
                              <li>
                                <Link href="/my-ready-orders">
                                  <FaCartShopping />
                                  My Ready Orders
                                </Link>
                              </li>
                              <li>
                                <Link href="/" onClick={handleLogout}>
                                  <IoLogOut />
                                  Logout
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div className="img-box">
                            {image?.length ? (
                              <img
                                src={image}
                                alt=""
                                className="uploaded-image w-100"
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <img
                                src='/assets/images/user-demo-image.png'
                                alt=""
                                className="uploaded-image w-100"
                                style={{
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                          </div>
                          <div className="user dropdown-toggle">
                            {profileData?.length ? (
                              <span className="ms-2">
                                <b
                                  style={{
                                    fontSize: "20px",
                                  }}
                                >
                                  {profileData}
                                </b>
                              </span>
                            ) : (
                              <>
                                <span className="ms-2">
                                  <b
                                    style={{
                                      fontSize: "20px",
                                    }}
                                  >
                                    Hello! user
                                  </b>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  )}
                </li>

                {!(Dealer || Phone) && (
                  <li className="login_user">
                    <Link className="icon" href="/login">
                      <FaUserAlt />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;