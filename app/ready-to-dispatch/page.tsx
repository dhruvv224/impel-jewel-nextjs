"use client";
import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FaFilePdf,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaRegFilePdf,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Select from "react-select";
import profileService from "../services/Home";
import DealerPdf from "../services/Dealer/PdfShare";
// import { Helmet } from "react-helmet-async";

const imageURL =  'https://api.indianjewelcast.com';

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const ReadytoDispatchInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const JewelleryType = [
    { id: "4", name: "Silver" },
    { id: "1,5", name: "Gold" },
  ];

  // SSR-safe localStorage access
  const [userType, setUserType] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [user_id, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("user_type"));
      setEmail(localStorage.getItem("email"));
      setUserId(localStorage.getItem("user_id"));
    }
  }, []);

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tagNoChange, setTagNoChange] = useState(""); // raw input value
  const [companyId, setCompanyId] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState(null);
  const [selectedItemGroups, setSelectedItemGroups] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const [selectedSubItems, setSelectedSubItems] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState(null);
  const [masterGroups, setMasterGroups] = useState([]);
  const [allPrices, setAllPrices] = useState([]);
  const [pdfItems, setPdfItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    dataShowLength: 20,
  });

  const totalPages = Math.ceil(totalItems / pagination.dataShowLength);

  // Centralized debounced function to update URL and fetch data
  // Debounced API/search update
  const debouncedNavigate = useRef(
    debounce((searchText: string) => {
      const queryParams = new URLSearchParams(searchParams.toString());
      queryParams.delete("page");
      if (searchText.trim().length > 0) {
        queryParams.set("search", searchText);
      } else {
        queryParams.delete("search");
      }
      router.replace(`/ready-to-dispatch?${queryParams.toString()}`, { scroll: false });
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 500)
  );

  // Generic handler for filter changes
  const handleFilterChange = (
    key: string,
    selectedOption: any,
    paramName: string
  ) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.delete("page"); // reset pagination

    if (selectedOption) {
      queryParams.set(paramName, selectedOption.value);
    } else {
      queryParams.delete(paramName);
    }

    // ✅ Update URL with new query params
    router.replace(`/ready-to-dispatch?${queryParams.toString()}`, { scroll: false });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));

    // ✅ Update local state
    switch (key) {
      case "companyId": setCompanyId(selectedOption); break;
      case "selectedSizes": setSelectedSizes(selectedOption); break;
      case "selectedItemGroups": setSelectedItemGroups(selectedOption); break;
      case "selectedItems": setSelectedItems(selectedOption); break;
      case "selectedSubItems": setSelectedSubItems(selectedOption); break;
      case "selectedStyles": setSelectedStyles(selectedOption); break;
      default: break;
    }
  };

  // Specific filter handlers
  // Simple debounced search handler
  const handleSearchItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchedText = e.target.value;
    setTagNoChange(searchedText);
    debouncedNavigate.current(searchedText);
  };

  const handleItems = (selectedOption: any) => handleFilterChange("selectedItems", selectedOption, "items");
  const handleSubItems = (selectedOption: any) => handleFilterChange("selectedSubItems", selectedOption, "sub-items");
  const handleSizes = (selectedOption: any) => handleFilterChange("selectedSizes", selectedOption, "sizes");
  const handleCompanyId = (selectedOption: any) => handleFilterChange("companyId", selectedOption, "companyId");
  const handleSelectedStyle = (selectedOption: any) => handleFilterChange("selectedStyles", selectedOption, "styles");
  const handleSelectedItemGroup = (selectedOption: any) => handleFilterChange("selectedItemGroups", selectedOption, "item-group");

  // Fetch products and filters
  const getProductsFilterAndData = useCallback(async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(searchParams.toString());
    const currentPage = parseInt(queryParams.get("page") ?? "1") || 1;
    const currentSearch = queryParams.get("search");
    const itemsFromURL = queryParams.get("items");
    const subItemsFromURL = queryParams.get("sub-items");
    const sizeFromURL = queryParams.get("sizes");
    const stylesFromURL = queryParams.get("styles");
    const itemGroupFromURL = queryParams.get("item-group");
    const companyIdFromURL = queryParams.get("companyId");

    setPagination((prev) => ({ ...prev, currentPage }));

    try {
      const companyTagRes = await profileService.GetCompanyTag();
      const companyData = companyTagRes?.data?.map((data: any) => data?.company_tag_id).join(",");

      const productsResponse = await fetch("https://api.indianjewelcast.com/api/Tag/GetAll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PageNo: currentPage,
          PageSize: 20,
          DeviceID: 0,
          SortBy: "",
          SearchText: currentSearch || "",
          TranType: "",
          CommaSeperate_ItemGroupID: itemGroupFromURL || "",
          CommaSeperate_ItemID: itemsFromURL || "",
          CommaSeperate_StyleID: stylesFromURL || "",
          CommaSeperate_ProductID: "",
          CommaSeperate_CompanyID: companyIdFromURL ? companyIdFromURL : companyData,
          CommaSeperate_SubItemID: subItemsFromURL || "",
          CommaSeperate_AppItemCategoryID: "",
          CommaSeperate_ItemSubID: "",
          CommaSeperate_KarigarID: "",
          CommaSeperate_BranchID: "",
          CommaSeperate_Size: sizeFromURL || "",
          CommaSeperate_CounterID: "",
          MinNetWt: 0,
          OnlyCartItem: false,
          OnlyWishlistItem: false,
          StockStatus: "",
          DoNotShowInClientApp: 0,
          HasTagImage: 0,
          MaxNetWt: 1000,
        }),
      });
      const productsData = await productsResponse.json();
      setProducts(productsData?.Tags || []);
      setTotalItems(productsData?.TotalItems || 0);

      const filterResponse = await fetch("https://api.indianjewelcast.com/api/Tag/GetFilters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PageNo: 1,
          PageSize: 20,
          DeviceID: 0,
          SortBy: "",
          SearchText: currentSearch || "",
          TranType: "",
          CommaSeperate_ItemGroupID: itemGroupFromURL || "",
          CommaSeperate_ItemID: itemsFromURL || "",
          CommaSeperate_StyleID: stylesFromURL || "",
          CommaSeperate_ProductID: "",
          CommaSeperate_SubItemID: subItemsFromURL || "",
          CommaSeperate_AppItemCategoryID: "",
          CommaSeperate_ItemSubID: "",
          CommaSeperate_KarigarID: "",
          CommaSeperate_BranchID: "",
          CommaSeperate_Size: sizeFromURL || "",
          CommaSeperate_CounterID: "",
          MinNetWt: 0,
          OnlyCartItem: false,
          OnlyWishlistItem: false,
          StockStatus: "",
          DoNotShowInClientApp: 0,
          HasTagImage: 0,
          CommaSeperate_CompanyID: companyIdFromURL ? companyIdFromURL : companyData,
          MaxNetWt: 1000,
        }),
      });
      const filterData = await filterResponse.json();
      setFilters(filterData?.Filters || []);

      // Update state based on URL parameters
      if (!tagNoChange) {
  setTagNoChange(currentSearch || "");
}
      setSelectedItems(
        itemsFromURL
          ? {
              value: Number(itemsFromURL),
              label: filterData.Filters.Items.find((item: any) => item?.ItemID === Number(itemsFromURL))?.ItemName,
            }
          : null
      );
      setSelectedSubItems(
        subItemsFromURL
          ? {
              value: Number(subItemsFromURL),
              label: filterData.Filters.SubItems.find((item: any) => item?.SubItemID === Number(subItemsFromURL))?.SubItemName,
            }
          : null
      );
      setSelectedSizes(
        sizeFromURL && filterData?.Filters?.Size
          ? filterData.Filters.Size.find((item) => item?.RowNumber === Number(sizeFromURL))
            ? {
                value: Number(sizeFromURL),
                label: filterData.Filters.Size.find((item) => item?.RowNumber === Number(sizeFromURL))?.Size1,
              }
            : null
          : null
      );
      setSelectedStyles(
        stylesFromURL && filterData?.Filters?.Styles
          ? filterData.Filters.Styles.find((item) => item?.StyleID === Number(stylesFromURL))
            ? {
                value: Number(stylesFromURL),
                label: filterData.Filters.Styles.find((item) => item?.StyleID === Number(stylesFromURL))?.StyleName,
              }
            : null
          : null
      );
      setSelectedItemGroups(
        itemGroupFromURL && filterData?.Filters?.ItemGroups
          ? filterData.Filters.ItemGroups.find((item) => item?.ItemGroupID === Number(itemGroupFromURL))
            ? {
                value: Number(itemGroupFromURL),
                label: filterData.Filters.ItemGroups.find((item) => item?.ItemGroupID === Number(itemGroupFromURL))?.GroupName,
              }
            : null
          : null
      );
      setCompanyId(
        companyIdFromURL
          ? JewelleryType.find((item) => item?.id === companyIdFromURL)
            ? {
                value: companyIdFromURL,
                label: JewelleryType.find((item) => item?.id === companyIdFromURL)?.name,
              }
            : null
          : null
      );

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [searchParams.toString()]);

  // Fetch master groups
  const fetchMasterGroups = async () => {
    try {
      const res = await profileService.GetMasterGroups();
      setMasterGroups(res?.data?.Items || []);
    } catch (err) {
      console.error(err);
    }
  };

    const fetchPdfList = async () => {
      try {
        const res = await DealerPdf.readyPdfList({ email });
        setPdfItems(res?.data?.ready_pdfs_list || []);
      } catch (err) {
        console.error(err);
      }
    };
  // Fetch product prices and PDF list
  useEffect(() => {
    const fetchProductPrices = async () => {
      try {
        const res = await profileService.GetProductsPrices();
        setAllPrices(res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductPrices();
    if (email) fetchPdfList();
    fetchMasterGroups();
    // Only depend on 'email' so this runs once on mount or when email changes
  }, [email]);

  // Fetch products and filters on location change
  useEffect(() => {
    getProductsFilterAndData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Clean up debounce timeout on component unmount


  // Pagination handlers
  const updatePagination = (page) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set("page", page);
    router.replace(`/ready-to-dispatch?${queryParams.toString()}`, { scroll: false });
    setPagination((prev) => ({ ...prev, currentPage: page }));
    setIsLoading(true);
    scrollup();
  };

  const paginationPrev = (e) => {
    if (pagination.currentPage > 1) {
      e.preventDefault();
      updatePagination(pagination.currentPage - 1);
    }
  };

  const paginationNext = (e) => {
    if (pagination.currentPage < totalPages) {
      e.preventDefault();
      updatePagination(pagination.currentPage + 1);
    }
  };

  // Add/remove from PDF
  const addToPDF = async (e, product, allPrices) => {
    e.preventDefault();
    if (!pdfItems?.some((item) => item?.barcode === product?.Barcode)) {
      try {
        const res = await DealerPdf.readytAddToPdf({
          email,
          company_id: 4,
          item_group_id: 44,
          item_id: product?.ItemGroupID,
          sub_item_id: product?.ItemSubID,
          style_id: product?.StyleID,
          barcode: product?.Barcode,
          tag_no: product?.TagNo,
          group_name: product?.GroupName,
          name: product?.ItemName,
          size: "",
          gross_weight: product?.GrossWt,
          net_weight: product?.NetWt,
          metal_value: allPrices?.metal_value,
          making_charge: allPrices?.labour_charge,
          making_charge_discount: allPrices?.labour_charge_discount,
          total_amount: allPrices?.total_prices,
        });
        fetchPdfList();
        toast.success(res?.message);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeToPDF = async (e, product) => {
    e.preventDefault();
    try {
      const res = await DealerPdf.readyRemovePdf({
        design_ids: [product.Barcode],
      });
      if (res?.success) {
        fetchPdfList();
        toast.success(res?.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const DealerLogin = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectPath", "/ready-to-dispatch");
    }
    router.push("/dealer-login");
  };

  const finalPrice = [
    { price_24k: allPrices?.price_24k },
    { sales_wastage: allPrices?.sales_wastage_rtd },
    { sales_wastage_discount: allPrices?.sales_wastage_discount_rtd },
  ];

  const scrollup = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const numberFormat = (value) => new Intl.NumberFormat("en-IN").format(Math.round(value));

  const pdfTip = <Tooltip id="tooltip">My PDF share</Tooltip>;
  const shimmerItems = Array(20).fill(null);

  useEffect(() => {
    // Only runs on client
    setUserType(typeof window !== "undefined" ? localStorage.getItem("user_type") : null);
    setEmail(typeof window !== "undefined" ? localStorage.getItem("email") : null);
    setUserId(typeof window !== "undefined" ? localStorage.getItem("user_id") : null);
  }, []);

  return (
    <>
      {/* Use Next.js metadata for title if needed */}
      <section className="ready-to-dispatch">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-6 col-12 mb-md-3 mb-2">
              <Select
                placeholder="Select Jewellery"
                isClearable
                isSearchable={false}
                value={companyId}
                onChange={handleCompanyId}
                options={JewelleryType.map((data) => ({
                  label: data.name,
                  value: data.id,
                }))}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-3 mb-2">
              <div className="form-group d-flex align-items-center">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search with tag no"
                  value={tagNoChange || ""}
                  onChange={handleSearchItems}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-3 mb-2">
              <Select
                placeholder="Select Item"
                isClearable
                isSearchable={false}
                value={selectedItems}
                onChange={handleItems}
                options={masterGroups.map((data) => ({
                  label: data.ItemName,
                  value: data.ItemID,
                }))}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-4 mb-2">
              <Select
                placeholder="Select Sub Item"
                isClearable
                isSearchable={false}
                value={selectedSubItems}
                onChange={handleSubItems}
                options={filters?.SubItems?.map((data) => ({
                  label: data.SubItemName,
                  value: data.SubItemID,
                }))}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-3 mb-2">
              <Select
                placeholder="Select Sizes"
                isClearable
                isSearchable={false}
                value={selectedSizes}
                onChange={handleSizes}
                options={filters?.Size?.map((data) => ({
                  label: data.Size1,
                  value: data.RowNumber,
                }))}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12 mb-md-4 mb-2">
              <Select
                placeholder="Select Style"
                isClearable
                isSearchable={false}
                value={selectedStyles}
                onChange={handleSelectedStyle}
                options={filters?.Styles?.map((data) => ({
                  label: data.StyleName,
                  value: data.StyleID,
                }))}
              />
            </div>
          </div>
          {isLoading ? (
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
          ) : (
            <div className="row mt-md-0 mt-4">
              {products.length > 0 ? (
                <>
                  {products.map((data, index) => {
                    console.log(data,'data')
                    const sales_wastage_of_category = finalPrice[1]?.sales_wastage[data?.SubItemID] || 0;
                    const sales_wastage_discount_of_category = finalPrice[2]?.sales_wastage_discount[data?.SubItemID] || 0;
                    let labour_charge =
                      (finalPrice[0]?.price_24k[data?.SubItemID] * sales_wastage_of_category) / 100 || 0;
                    if (labour_charge > 0) {
                      labour_charge = labour_charge * data?.NetWt || 0;
                    }
                    const labour_charge_discount =
                      sales_wastage_discount_of_category > 0
                        ? labour_charge - (labour_charge * sales_wastage_discount_of_category) / 100
                        : 0;
                    const metal_value =
                      finalPrice[0]?.price_24k[data?.SubItemID] * (data?.Touch / 100) * data?.NetWt || 0;
                    const finalPriceWithoutDis = metal_value + labour_charge;
                    const finalPriceWithDis = metal_value + labour_charge_discount;
                    const allPrices = {
                      total_prices: labour_charge_discount > 0 ? finalPriceWithDis : finalPriceWithoutDis,
                      labour_charge_discount: numberFormat(labour_charge_discount),
                      metal_value: numberFormat(metal_value),
                      labour_charge: numberFormat(labour_charge),
                    };

                    return (
                      <div className="col-lg-3 col-md-6 col-12" key={index}>
                        <motion.div
                          className="item-product text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Link href={`/ready-to-dispatch/${data?.TagNo}`}>
                            <div className="product-thumb" width="100%" height="100%">
                              <motion.img
                                src={
                                  data?.Images && data.Images[0]?.ImageName
                                    ? `${imageURL}${data.Images[0].ImageName}`
                                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                                }
                                alt=""
                                className="w-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                width="100%"
                                height="100%"
                                loading="lazy"
                              />
                            </div>
                          </Link>
                          <div className="wishlist-top">
                            {userType === "1" && (
                              <div className="mt-2">
                                {email ? (
                                  <OverlayTrigger placement="top" overlay={pdfTip}>
                                    <a
                                      href="#"
                                      onClick={(e) =>
                                        pdfItems?.find((item) => item?.barcode === data?.Barcode)
                                          ? removeToPDF(e, data)
                                          : addToPDF(e, data, allPrices)
                                      }
                                    >
                                      {pdfItems?.find((item) => item?.barcode === data?.Barcode) ? (
                                        <FaFilePdf />
                                      ) : (
                                        <FaRegFilePdf />
                                      )}
                                    </a>
                                  </OverlayTrigger>
                                ) : (
                                  <span onClick={DealerLogin}>
                                    <FaRegFilePdf />
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="product-info d-grid">
                            {labour_charge_discount > 0 && user_id ? (
                              <>
                                <del>₹{numberFormat(finalPriceWithoutDis)}</del>
                                <label>
                                  <strong className="text-success">₹{numberFormat(finalPriceWithDis)}</strong>
                                </label>
                              </>
                            ) : (
                              <strong className="text-success">₹{numberFormat(finalPriceWithoutDis)}</strong>
                            )}
                          </div>
                          {userType === "1" && (
                            <div className="mt-2">
                              <span style={{ color: "#db9662", fontWeight: 700 }}>{data?.TagNo}</span>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    );
                  })}
                  {totalPages > 1 && (
                    <div className="pt-5">
                      <div className="paginationArea">
                        <nav aria-label="navigation">
                          <ul className="pagination">
                            <li className={`page-item ${pagination.currentPage === 1 ? "disabled" : ""}`}>
                              <a
                                href="#"
                                className="page-link d-flex align-items-center gap-2"
                                onClick={paginationPrev}
                              >
                                <FaLongArrowAltLeft />
                                Prev
                              </a>
                            </li>
                            {Array.from({ length: totalPages }).map((_, index) => {
                              const pageNumber = index + 1;
                              const isCurrentPage = pagination.currentPage === pageNumber;
                              return pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= pagination.currentPage - 1 &&
                                  pageNumber <= pagination.currentPage + 1) ? (
                                <li
                                  key={pageNumber}
                                  className={`page-item ${isCurrentPage ? "active" : ""}`}
                                  onClick={() => updatePagination(pageNumber)}
                                >
                                  <a href="#" className="page-link" onClick={(e) => e.preventDefault()}>
                                    {pageNumber}
                                  </a>
                                </li>
                              ) : index === 1 || index === totalPages - 2 ? (
                                <li key={pageNumber} className="page-item disabled">
                                  <a href="#" className="page-link" onClick={(e) => e.preventDefault()}>
                                    ...
                                  </a>
                                </li>
                              ) : null;
                            })}
                            <li className={`page-item ${pagination.currentPage === totalPages ? "disabled" : ""}`}>
                              <a
                                href="#"
                                className="page-link d-flex align-items-center gap-2"
                                onClick={paginationNext}
                              >
                                Next
                                <FaLongArrowAltRight />
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="row">
                  <div className="col-md-12">
                    <div className="not-products">
                      <p>No products available.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const ReadytoDispatch = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ReadytoDispatchInner />
  </Suspense>
);

export default ReadytoDispatch;