'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import BreadCrumb from "../../components/common/BreadCrumb";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import categoryDetail from "../../services/Shop";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const CategoriesItems = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categoryIdFromState = searchParams.get('id');
  console.log(categoryIdFromState,'categoryIdFromState')
  const categoryNameFromState = searchParams.get('name');

  const Phone = typeof window !== "undefined" ? localStorage.getItem("phone") : null;
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    dataShowLength: 40,
  });

  const currentPageNo = parseInt(searchParams.get("page") ?? "1");

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: currentPageNo }));
  }, [currentPageNo]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["related_products", categoryIdFromState, currentPageNo],
    queryFn: () =>
      categoryDetail.related_products({
        categoryId: Number(categoryIdFromState),
        page: currentPageNo,
      }),
  });

  const categoriesData = (data as any)?.data?.designs || [];
  const paginate = (data as any)?.data?.total_records || 0;
  const totalPages = Math.ceil(paginate / pagination.dataShowLength);
  const categoryName = (data as any)?.category_name;

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updatePagination = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
    setPagination((prev) => ({ ...prev, currentPage: page }));
    scrollup();
  };

  const paginationPrev = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pagination.currentPage > 1) {
      updatePagination(pagination.currentPage - 1);
    }
  };

  const paginationNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pagination.currentPage < totalPages) {
      updatePagination(pagination.currentPage + 1);
    }
  };

  const numberFormat = (value: number) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  const shimmerItems = Array(20).fill(null);

  return (
    <section className="categories">
      <div className="container">
        <div className="subcategory_filter">
          <BreadCrumb
            firstName="Home"
            firstUrl="/"
            secondName="Categories"
            secondUrl="/categories"
            thirdName={categoryName}
          />
        </div>
        <div>
          <div className="categories_data">
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
            ) : isError ? (
              <div>Error: {error?.message}</div>
            ) : (
              <>
                <div className="row">
                  {categoriesData.length > 0 ? (
                    <>
                      {categoriesData.map((data: any) => {
                        const slug = encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, "-"));
                        return (
                          <div className="col-lg-3 col-md-6 col-12" key={data.id}>
                            <div className="item-product text-center">
                              <Link href={{
                                pathname: `/shopdetails/${slug}/${data?.code}`,
                                query: { id: data.id, name: data.name }
                              }}>
                                <div className="product-thumb">
                                  {data?.image ? (
                                    <motion.img
                                      src={data?.image}
                                      alt={data?.name}
                                      className="w-100"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.5 }}
                                      whileHover={{ scale: 1.05 }}
                                    />
                                  ) : (
                                    <motion.img
                                      src={'/assets/images/No_Image_Available.jpg'}
                                      className="w-100"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.5 }}
                                      whileHover={{ scale: 1.05 }}
                                    />
                                  )}
                                </div>
                                <div className="product-info d-grid">
                                  {(data?.making_charge_discount_18k > 0 && Phone) || email ? (
                                    <>
                                      <del style={{ color: "#000" }}>
                                        ₹{numberFormat(data?.making_charge_18k + data?.metal_value_18k)}
                                      </del>
                                      <label>
                                        <strong className="text-success">
                                          ₹{numberFormat(data?.metal_value_18k + data?.making_charge_discount_18k)}
                                        </strong>
                                      </label>
                                    </>
                                  ) : (
                                    <strong className="text-success">
                                      {Phone || email ? (
                                        <>₹{numberFormat(data?.total_amount_18k)}</>
                                      ) : (
                                        <>₹{numberFormat(data?.making_charge_18k + data?.metal_value_18k)}</>
                                      )}
                                    </strong>
                                  )}
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                      {/* PAGINATION */}
                      <div className="pt-5">
                        {totalPages > 1 && (
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
                                    (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1) ? (
                                    <li key={pageNumber} className={`page-item ${isCurrentPage ? "active" : ""}`}>
                                      <a
                                        href="#"
                                        className="page-link"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          updatePagination(pageNumber);
                                        }}
                                      >
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
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="categoriesData-not text-center" style={{ fontSize: "35px", fontWeight: "600", marginTop: "150px" }}>
                        <p>Unfortunately, categories data is not available at the moment.</p>
                      </div>
                      <div className="text-center mt-md-3">
                        <Link href="/categories" className="view_all_btn px-4 py-2" style={{ borderRadius: "8px" }}>
                          <FaLongArrowAltLeft className="mr-2" /> &nbsp;Back to Categories
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default CategoriesItems;
