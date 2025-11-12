'use client'; // ⬅️ REQUIRED: Uses state, context, useEffect, local storage, and custom hooks.

import React, { useContext, useEffect, useState, useCallback, Suspense } from "react";
// ✅ Next.js App Router replacements for routing and URL state management
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { BsSearch } from "react-icons/bs";
import { FiHeart } from "react-icons/fi";
import { FcLike } from "react-icons/fc";
import {
  FaFilePdf,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaRegFilePdf,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Select from "react-select";
import Accordion from "react-bootstrap/Accordion";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ShopServices from "../../services/Shop";
import FilterServices from "../../services/Filter";
import DealerWishlist from "../../services/Dealer/Collection";
import DealerPdf from "../../services/Dealer/PdfShare";
import UserWishlist from "../../services/Auth";
import { WishlistSystem } from "../../context/WishListContext";
import { motion } from "framer-motion";

// Custom debounce function (Kept as is)
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const ShopTagPageInner = () => {
  const { dispatch: wishlistDispatch } = useContext(WishlistSystem);
  const { dispatch: removeWishlistDispatch } = useContext(WishlistSystem);

  // ❌ Original: const location = useLocation();
  // ❌ Original: const navigate = useNavigate();
  // ✅ Next.js App Router replacements
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // SSR-safe localStorage access
  const [userType, setUserType] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [Phone, setPhone] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("user_type") || "");
      setUserId(localStorage.getItem("user_id") || "");
      setEmail(localStorage.getItem("email") || "");
      setPhone(localStorage.getItem("phone") || "");
    }
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [paginate, setPaginate] = useState();
  
  // Initialize state based on current URL search params
  const initialSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [genderData, setGenderData] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [filterTag, setFilterTag] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [PriceRange, setPriceRange] = useState({
    minprice: null,
    maxprice: null,
  });
  const [selectedPriceOption, setSelectedPriceOption] = useState(null); 
  const [FilterPriceRange, setFilterPriceRange] = useState({
    minprice: 0,
    maxprice: 0,
  });
  const [DealerCollection, setDealerCollection] = useState([]);
  const [UsercartItems, setUserCartItems] = useState([]);
  const [pdfItems, setPdfItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    dataShowLength: 40,
  });

  // Extract tag name from URL path
  const tagNameFromUrl = pathname.split("/shop/")[1]
    ? decodeURIComponent(pathname.split("/shop/")[1].replace(/-/g, " "))
    : null;

  const totalPages = Math.ceil(paginate / pagination?.dataShowLength);

  // Price range options (Kept as is)
  const priceRangeOptions = [
    { value: [0, 10000], label: 'Below ₹10,000' },
    { value: [10000, 20000], label: '₹10,000 - ₹20,000' },
    { value: [20000, 30000], label: '₹20,000 - ₹30,000' },
    { value: [30000, 40000], label: '₹30,000 - ₹40,000' },
    { value: [50000, Number.MAX_SAFE_INTEGER], label: '₹50,000 and above' }
  ];

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [options] = useState([
    { value: "new_added", label: "New Added" },
    { value: "low_to_high", label: "Price: low to high" },
    { value: "high_to_low", label: "Price: high to low" },
    { value: "highest_selling", label: "Top Seller" },
  ]);

  // Helper function to update URL query params using router.push
  const updateUrl = useCallback((newSearchParams) => {
    const newQueryString = newSearchParams.toString();
    const newPath = `/shop${tagNameFromUrl ? `/${encodeURIComponent(tagNameFromUrl.toLowerCase().replace(/\s+/g, "-"))}` : ""}${
      newQueryString ? `?${newQueryString}` : ""
    }`;
    router.push(newPath);
  }, [router, tagNameFromUrl]);


  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchedText) => {
      setIsLoading(true);
      // ✅ Use a copy of the current search params
      const currentParams = new URLSearchParams(searchParams.toString()); 
      currentParams.delete("page");
      
      if (searchedText?.trim().length > 0) {
        currentParams.set("search", searchedText);
      } else {
        currentParams.delete("search");
      }
      
      updateUrl(currentParams);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 500),
    [searchParams, tagNameFromUrl, updateUrl]
  );

  const searchbar = useCallback(
    (e) => {
      const searchedText = e.target.value;
      setSearchInput(searchedText); 
      debouncedSearch(searchedText); 
    },
    [debouncedSearch]
  );

  const handleSelectCategory = (categoryId) => {
    setIsLoading(true);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");
    setSelectedOption(null);
    setSelectedGender(null);
    setSelectedTag(null);
    setPriceRange({ minprice: null, maxprice: null });
    setSelectedPriceOption(null); 
    currentParams.delete("search");
    currentParams.delete("gender_id");
    currentParams.delete("sort_by");
    currentParams.delete("min_price");
    currentParams.delete("max_price");

    if (categoryId) {
      currentParams.set("category_id", categoryId.value);
    } else {
      currentParams.delete("category_id");
    }

    updateUrl(currentParams);
    setSelectedCategory(categoryId);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectChange = (selectedSort) => {
    setIsLoading(true);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");
    
    if (selectedSort) {
      currentParams.set("sort_by", selectedSort.value);
    } else {
      currentParams.delete("sort_by");
    }
    
    updateUrl(currentParams);
    setSelectedOption(selectedSort);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectGender = (genderId) => {
    setIsLoading(true);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");
    
    if (genderId) {
      currentParams.set("gender_id", genderId.value);
    } else {
      currentParams.delete("gender_id");
    }
    
    updateUrl(currentParams);
    setSelectedGender(genderId);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSelectTag = (selectedTags) => {
    setIsLoading(true);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");
    
    // Logic to navigate using the tag slug/name in the path
    const tagSlug = selectedTags ? encodeURIComponent(selectedTags.label.toLowerCase().replace(/\s+/g, "-")) : "";
    const newPath = `/shop${tagSlug ? `/${tagSlug}` : ""}${
        currentParams.toString() ? `?${currentParams.toString()}` : ""
    }`;
    router.push(newPath);

    setSelectedTag(selectedTags);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Updated price range handler
  const handlePriceRangeChange = (selected) => {
    setIsLoading(true);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");
    
    if (selected) {
      const [minPrice, maxPrice] = selected.value;
      currentParams.set("min_price", minPrice);
      currentParams.set("max_price", maxPrice === Number.MAX_SAFE_INTEGER ? 999999999 : maxPrice);
      setPriceRange({ minprice: minPrice, maxprice: maxPrice });
      setSelectedPriceOption(selected);
    } else {
      currentParams.delete("min_price");
      currentParams.delete("max_price");
      setPriceRange({ minprice: null, maxprice: null });
      setSelectedPriceOption(null);
    }
    
    updateUrl(currentParams);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSliderChange = useCallback((e) => {
    setIsLoading(true);
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");
    
    if (e[0] !== null && e[1] !== null) {
      currentParams.set("min_price", e[0]);
      currentParams.set("max_price", e[1]);
      setPriceRange({ minprice: e[0], maxprice: e[1] });
    }
    
    updateUrl(currentParams);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [searchParams, updateUrl]);

  const clearFilters = () => {
    setSearchInput(null);
    setSelectedOption(null);
    setSelectedCategory(null);
    setSelectedGender(null);
    setSelectedTag(null);
    setPriceRange({ minprice: null, maxprice: null });
    setSelectedPriceOption(null); 
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    // ✅ Next.js navigation to base shop page
    router.push(`/shop`); 
  };

  const FilterData = async () => {
    setIsLoading(true);
    
    // ✅ Read parameters directly from useSearchParams
    const currentPageNo = parseInt(searchParams.get("page")) || 1;
    const currentCategory = searchParams.get("category_id");
    const currentSearch = searchParams.get("search");
    const currentSort = searchParams.get("sort_by");
    const currentGender = searchParams.get("gender_id");
    const currentMinPrice = searchParams.get("min_price");
    const currentMaxPrice = searchParams.get("max_price");
    const currentTagId = searchParams.get("tag_id"); // ✅ Get tag_id from query params

    // The tag ID logic: first try query param, then try to find from URL path slug
    let finalTagId = null;
    if (currentTagId) {
      finalTagId = Number(currentTagId);
    } else if (filterTag && filterTag.length > 0 && tagNameFromUrl) {
      const currentTag = filterTag.find(
        (tag) => tag?.name?.toLowerCase() === tagNameFromUrl?.toLowerCase()
      )?.id || null;
      finalTagId = currentTag ? Number(currentTag) : null;
    }

    if (currentPageNo) {
      setPagination((prev) => ({ ...prev, currentPage: currentPageNo }));
    } else {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }

    try {
      const filterResponse = await ShopServices.allfilterdesigns({
        category_id: Number(currentCategory) || null,
        gender_id: Number(currentGender) || null,
        tag_id: finalTagId,
        search: currentSearch,
        min_price: Number(currentMinPrice) || null,
        max_price: Number(currentMaxPrice) || null,
        sort_by: currentSort || selectedOption?.value || null,
        userType: Number(userType),
        userId: Number(userId),
        page: currentPageNo,
      });
      setIsLoading(false);
      setFilterData(filterResponse?.data?.designs || []);
      setFilterTag(filterResponse?.data?.tags || []);
      setPaginate(filterResponse?.data?.total_records || {});
      setFilterPriceRange({
        minprice: filterResponse?.data?.minprice || 0,
        maxprice: filterResponse?.data?.maxprice || 0,
      });

      const categoryRes = await FilterServices.categoryFilter();
      setCategoryData(categoryRes?.data || []);

      const genderRes = await FilterServices.genderFilter();
      setGenderData(genderRes?.data || []);

      if (categoryRes?.data && currentCategory) {
        const Category_ids = categoryRes?.data?.find(
          (item) => item?.id === Number(currentCategory)
        );
        setSelectedCategory(
          Category_ids
            ? { value: Category_ids.id, label: Category_ids.name }
            : null
        );
      } else {
        setSelectedCategory(null);
      }

      if (options && currentSort) {
        const selectedSort = options?.find(
          (item) => item?.value === currentSort
        );
        setSelectedOption(selectedSort);
      } else {
        setSelectedOption(null);
      }

      if (genderRes?.data && currentGender) {
        const Gender_ids = genderRes?.data?.find(
          (item) => item?.id === Number(currentGender)
        );
        setSelectedGender(
          Gender_ids
            ? { value: Gender_ids.id, label: Gender_ids.name }
            : null
        );
      } else {
        setSelectedGender(null);
      }

      if (filterResponse?.data?.tags && tagNameFromUrl) {
        const selectedTagID = filterResponse?.data?.tags?.find(
          (item) => item?.name.toLowerCase() === tagNameFromUrl.toLowerCase()
        );
        setSelectedTag(
          selectedTagID
            ? { value: selectedTagID.id, label: selectedTagID.name }
            : null
        );
      } else {
        setSelectedTag(null);
      }

      // Updated price range logic
      if (currentMinPrice && currentMaxPrice) {
        const minPrice = Number(currentMinPrice);
        const maxPrice = Number(currentMaxPrice);
        
        setPriceRange({ minprice: minPrice, maxprice: maxPrice });
        
        // Find matching price range option
        const matchingOption = priceRangeOptions.find(option => {
          const [optionMin, optionMax] = option.value;
          return optionMin === minPrice && (optionMax === maxPrice || (optionMax === Number.MAX_SAFE_INTEGER && maxPrice >= 999999999));
        });
        
        setSelectedPriceOption(matchingOption || null);
      } else {
        setPriceRange({ minprice: null, maxprice: null });
        setSelectedPriceOption(null);
      }
    } catch (err) {
      console.error("Error fetching filter data:", err);
      toast.error("Failed to fetch filter data");
      setIsLoading(false);
    }
  };

  const updatePagination = (page) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page);
    
    updateUrl(currentParams);

    setPagination((prev) => ({ ...prev, currentPage: page }));
    setIsLoading(true);
    scrollup();
  };

  const paginationPrev = (e) => {
    if (pagination.currentPage > 1) {
      e.preventDefault();
      updatePagination(pagination.currentPage - 1);
      scrollup();
    }
  };

  const paginationNext = (e) => {
    if (pagination.currentPage < totalPages) {
      e.preventDefault();
      updatePagination(pagination.currentPage + 1);
      scrollup();
    }
  };

  // 🛑 The main useEffect now depends only on Next.js URL state (pathname/searchParams)
  useEffect(() => {
    const min = searchParams.get("min_price");
    const max = searchParams.get("max_price");
    
    if (min && max) {
      const minPrice = parseFloat(min);
      const maxPrice = parseFloat(max);
      setPriceRange({ minprice: minPrice, maxprice: maxPrice });
      
      // Find and set matching price option
      const matchingOption = priceRangeOptions.find(option => {
        const [optionMin, optionMax] = option.value;
        return optionMin === minPrice && (optionMax === maxPrice || (optionMax === Number.MAX_SAFE_INTEGER && maxPrice >= 999999999));
      });
      setSelectedPriceOption(matchingOption || null);
    }
    FilterData();
  }, [pathname, searchParams]); // ✅ Dependencies updated to Next.js hooks

  // Wishlist and Dealer Selection functions (API calls) remain the same
  // The useEffect for these functions is also preserved, with updated dependencies.
  
  const GetUserWishList = async () => {
    try {
      const res = await UserWishlist.userWishlist({ phone: Phone });
      setUserCartItems(res?.data?.wishlist_items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch user wishlist");
    }
  };

  const addToUserWishList = async (e, product) => {
    e.preventDefault();
    const payload = { id: product?.id };
    if (!UsercartItems.some((item) => item.id === product.id)) {
      try {
        const res = await UserWishlist.addtoWishlist({
          phone: Phone,
          design_id: product.id,
          gold_color: "yellow_gold",
          gold_type: "18k",
          design_name: product?.name,
        });
        if (res.success === true) {
          toast.success("Design has been Added to Your Wishlist");
          GetUserWishList();
          wishlistDispatch({
            type: "ADD_TO_WISHLIST",
            payload,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to add to wishlist");
      }
    }
  };

  const removeFromWishList = async (e, product) => {
    e.preventDefault();
    const payload = product;
    try {
      const res = await UserWishlist.removetoWishlist({
        phone: Phone,
        design_id: product.id,
        gold_color: "yellow_gold",
        gold_type: "18k",
        design_name: product?.name,
      });
      if (res.success === true) {
        toast.success("Design has been Removed from Your Wishlist.");
        GetUserWishList();
        removeWishlistDispatch({
          type: "REMOVE_FROM_WISHLIST",
          payload,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from wishlist");
    }
  };

  const GetDealerSelection = async () => {
    try {
      const res = await DealerWishlist.ListCollection({ email });
      setDealerCollection(res.data?.wishlist_items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dealer collection");
    }
  };

  const AddToDealerSelection = async (e, product) => {
    e.preventDefault();
    if (!DealerCollection?.some((item) => item.id === product?.id)) {
      try {
        const res = await DealerWishlist.addtoDealerWishlist({
          email,
          design_id: product?.id,
        });
        if (res.success === true) {
          toast.success("design Added Successfully");
          FilterData();
          GetDealerSelection();
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to add to dealer collection");
      }
    }
  };

  const removeFromSelection = async (e, product) => {
    e.preventDefault();
    try {
      const res = await DealerWishlist.removetodealerWishlist({
        email,
        design_id: product.id,
      });
      if (res.success === true) {
        toast.success(res.message);
        FilterData();
        GetDealerSelection();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from dealer collection");
    }
  };

  const getPdfList = useCallback(async () => {
    try {
      const res = await DealerPdf.pdfList({ email });
      setPdfItems(res?.data?.pdf_items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch PDF list");
    }
  }, [email]);

  useEffect(() => {
    if (Phone) {
      GetUserWishList();
    }

    if (email) {
      GetDealerSelection();
      getPdfList();
    }
  }, [Phone, email, getPdfList]);

  const addToPDF = async (e, product) => {
    e.preventDefault();
    if (!pdfItems.some((item) => item.id === product.id)) {
      try {
        const res = await DealerPdf.addToPdf({
          email,
          design_id: product.id,
        });
        getPdfList();
        toast.success(res.message);
      } catch (err) {
        console.error(err);
        toast.error("Failed to add to PDF");
      }
    }
  };

  const removeToPDF = async (e, product) => {
    e.preventDefault();
    try {
      const res = await DealerPdf.removePdf({
        email,
        design_ids: [product.id],
      });
      if (res.success === true) {
        getPdfList();
        toast.success(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from PDF");
    }
  };

  const UserLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", pathname); // ✅ Use next/navigation's pathname
    // ✅ Use router.push for navigation, passing state via query parameter
    router.push(`/login?from=${encodeURIComponent(pathname)}`);
  };

  const DealerLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", pathname); // ✅ Use next/navigation's pathname
    // ✅ Use router.push for navigation
    router.push("/dealer-login");
  };

  const wishlistTip = <Tooltip id="tooltip">Wishlist</Tooltip>;
  const selectionTip = <Tooltip id="tooltip">My Selections</Tooltip>;
  const pdfTip = <Tooltip id="tooltip">My PDF share</Tooltip>;
  const userTip = <Tooltip id="tooltip">Login to add wishlist products</Tooltip>;

  const shimmerItems = Array(20).fill(null);

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  return (
    <>
      <section className="shop">
        <div className="container">
          <div className="shopping_data">
            <div className="row">
              <div className="col-lg-9 col-md-6 col-12 mb-lg-3 mb-md-3 mb-2">
                <Select
                  instanceId="shop-category-select"
                  placeholder="Shop by category"
                  isClearable={true}
                  isSearchable={false}
                  value={selectedCategory}
                  options={categoryData.map((data) => ({
                    value: data?.id,
                    label: data?.name,
                  }))}
                  onChange={handleSelectCategory}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-3 mb-md-3 mb-2">
                <Select
                  instanceId="shop-sort-select"
                  value={selectedOption}
                  onChange={handleSelectChange}
                  isClearable={true}
                  isSearchable={false}
                  options={options}
                  placeholder="Sort By"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-3 mb-2">
                <div className="search_bar">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search by design code"
                    value={searchInput || ""}
                    onChange={(e) => searchbar(e)}
                  />
                  <BsSearch className="search-icon cursor-pointer" />
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-3 mb-2">
                <Select
                  instanceId="shop-gender-select"
                  placeholder="Shop by Gender"
                  isClearable
                  isSearchable={false}
                  value={selectedGender}
                  options={genderData?.map((data) => ({
                    value: data?.id,
                    label: data?.name,
                  }))}
                  onChange={handleSelectGender}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-5 mb-2">
                <Select
                  instanceId="shop-tag-select"
                  placeholder="Shop by Tag"
                  isClearable
                  isSearchable={false}
                  value={selectedTag}
                  options={filterTag?.map((data) => ({
                    value: data?.id,
                    label: data?.name,
                  }))}
                  onChange={handleSelectTag}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-5 mb-4">
                <Select
                  instanceId="shop-price-select"
                  value={selectedPriceOption}
                  onChange={handlePriceRangeChange}
                  options={priceRangeOptions}
                  isClearable
                  placeholder="Select price range"
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12 mb-lg-4 mb-md-3 mb-2">
                <button className="btn btn-secondary w-100" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>

            {isLoading ? (
              <>
                <div className="row">
                  {shimmerItems.map((_, index) => (
                    <div className="col-lg-3 col-md-6 col-12" key={index}>
                      <div className="shimmer-product">
                        <div className="shimmer-image"></div>
                        <div className="shimmer-price"></div>
                        <div className="shimmer-price"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  <div className="col-md-12">
                    {filterData?.length > 0 ? (
                      <>
                        <div className="row">
                          {filterData?.map((data) => (
                            <div className="col-lg-3 col-md-6 col-12" key={data.id}>
                              <motion.div
                                className="item-product text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Link
                                  // ✅ Next.js Link uses 'href'
                                  href={`/shopdetails/${encodeURIComponent(
                                    data.name.toLowerCase().replace(/\s+/g, "-")
                                  )}/${data?.code}?id=${data.id}&name=${encodeURIComponent(data.name)}`} // Pass state via query
                                >
                                  <div className="product-thumb">
                                    {data?.image ? (
                                      <motion.img
                                        src={data?.image}
                                        alt=""
                                        className="w-100"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        whileHover={{ scale: 1.05 }}
                                      />
                                    ) : (
                                      <img
                                        src=""
                                        alt=""
                                        className="w-100"
                                      />
                                    )}
                                  </div>
                                  <div className="product-info">
                                    <div className="product-info d-grid">
                                      {(data?.making_charge_discount_18k > 0 &&
                                        Phone) ||
                                      (email && userId) ? (
                                        <>
                                          <del style={{ color: "#000" }}>
                                            ₹
                                            {numberFormat(
                                              data?.making_charge_18k +
                                                data?.metal_value_18k
                                            )}
                                          </del>
                                          <label>
                                            <strong className="text-success">
                                              ₹
                                              {numberFormat(
                                                data?.metal_value_18k +
                                                  data?.making_charge_discount_18k
                                              )}
                                            </strong>
                                          </label>
                                        </>
                                      ) : (
                                        <strong className="text-success">
                                          ₹
                                          {Phone && userId ? (
                                            numberFormat(data?.total_amount_18k)
                                          ) : (
                                            numberFormat(
                                              data?.making_charge_18k +
                                                data?.metal_value_18k
                                            )
                                          )}
                                        </strong>
                                      )}
                                    </div>
                                    {userType == 1 && (
                                      <div className="mt-1">
                                        <span
                                          style={{
                                            color: "#db9662",
                                            fontWeight: 700,
                                          }}
                                        >
                                          {data?.code}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </Link>
                                <div className="wishlist-top">
                                  {userType == 1 ? (
                                    <>
                                      {email ? (
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={selectionTip}
                                        >
                                          <Link
                                            href="#"
                                            className="dealer_heart_icon"
                                            onClick={(e) => {
                                              if (
                                                DealerCollection?.find(
                                                  (item) => item?.id === data?.id
                                                )
                                              ) {
                                                removeFromSelection(e, data);
                                              } else {
                                                AddToDealerSelection(e, data);
                                              }
                                            }}
                                          >
                                            {DealerCollection?.find(
                                              (item) => item?.id === data?.id
                                            ) ? (
                                              <FaStar />
                                            ) : (
                                              <FaRegStar />
                                            )}
                                          </Link>
                                        </OverlayTrigger>
                                      ) : (
                                        <span onClick={(e) => DealerLogin(e)}>
                                          <FaRegStar />
                                        </span>
                                      )}
                                      {email ? (
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={pdfTip}
                                        >
                                          <Link
                                            href="#"
                                            className="dealer_heart_icon"
                                            onClick={(e) => {
                                              if (
                                                pdfItems?.find(
                                                  (item) => item?.id === data?.id
                                                )
                                              ) {
                                                removeToPDF(e, data);
                                              } else {
                                                addToPDF(e, data);
                                              }
                                            }}
                                          >
                                            {pdfItems?.find(
                                              (item) => item?.id === data?.id
                                            ) ? (
                                              <FaFilePdf />
                                            ) : (
                                              <FaRegFilePdf />
                                            )}
                                          </Link>
                                        </OverlayTrigger>
                                      ) : (
                                        <span onClick={(e) => DealerLogin(e)}>
                                          <FaRegFilePdf />
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {Phone ? (
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={wishlistTip}
                                        >
                                          <Link
                                            href="#"
                                            className=""
                                            onClick={(e) => {
                                              if (
                                                UsercartItems?.find(
                                                  (item) => item.id === data.id
                                                )
                                              ) {
                                                removeFromWishList(e, data);
                                              } else {
                                                addToUserWishList(e, data);
                                              }
                                            }}
                                          >
                                            {UsercartItems?.find(
                                              (item) => item.id === data.id
                                            ) ? (
                                              <FcLike />
                                            ) : (
                                              <FiHeart />
                                            )}
                                          </Link>
                                        </OverlayTrigger>
                                      ) : (
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={userTip}
                                        >
                                          <span
                                            className=""
                                            onClick={(e) => UserLogin(e)}
                                          >
                                            <FiHeart
                                              style={{
                                                fontSize: "22px",
                                              }}
                                            />
                                          </span>
                                        </OverlayTrigger>
                                      )}
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            </div>
                          ))}
                        </div>

                        {totalPages > 1 && (
                          <div className="pt-5">
                            <div className="paginationArea">
                              <nav aria-label="navigation">
                                <ul className="pagination">
                                  <li
                                    className={`page-item ${
                                      pagination.currentPage === 1 ? "disabled" : ""
                                    }`}
                                  >
                                    <Link
                                      href="#"
                                      className="page-link d-flex align-items-center gap-2"
                                      onClick={paginationPrev}
                                    >
                                      <FaLongArrowAltLeft />
                                      Prev
                                    </Link>
                                  </li>

                                  {Array.from({ length: totalPages }).map(
                                    (_, index) => {
                                      const pageNumber = index + 1;
                                      const isCurrentPage =
                                        pagination.currentPage === pageNumber;

                                      return pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >=
                                          pagination.currentPage - 1 &&
                                          pageNumber <=
                                            pagination.currentPage + 1) ? (
                                        <li
                                          key={pageNumber}
                                          className={`page-item ${
                                            isCurrentPage ? "active" : ""
                                          }`}
                                          onClick={() =>
                                            updatePagination(pageNumber)
                                          }
                                        >
                                          <Link
                                            href="#"
                                            className="page-link"
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            {pageNumber}
                                          </Link>
                                        </li>
                                      ) : index === 1 ||
                                        index === totalPages - 2 ? (
                                        <li
                                          key={pageNumber}
                                          className="page-item disabled"
                                        >
                                          <Link
                                            href="#"
                                            className="page-link"
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            ...
                                          </Link>
                                        </li>
                                      ) : null;
                                    }
                                  )}

                                  <li
                                    className={`page-item ${
                                      pagination.currentPage === totalPages
                                        ? "disabled"
                                        : ""
                                    }`}
                                  >
                                    <Link
                                      href="#"
                                      className="page-link d-flex align-items-center gap-2"
                                      onClick={paginationNext}
                                    >
                                      Next
                                      <FaLongArrowAltRight />
                                    </Link>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="not-products">
                        <p>No products available.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const ShopTagPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ShopTagPageInner />
  </Suspense>
);

export default ShopTagPage;