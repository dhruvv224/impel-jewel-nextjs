import React, { useState } from "react";
import "./CreatePDF.css";
import DealerPdf from "../../services/Dealer/PdfShare";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import emptycart from "../../assets/images/empty-cart.png";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoShareSocial } from "react-icons/io5";
import NotoSansRegular from "../../assets/fonts/Lato-Regular.ttf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  Font,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "Lato",
  src: NotoSansRegular,
});

const styles = StyleSheet.create({
  page: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    borderBottom: "1px solid grey",
    // marginBottom: 20,
  },
  logo: {
    width: "auto",
    height: "60px",
  },
  address: {
    textAlign: "right",
    fontSize: 12,
    color: "#333",
    lineHeight: 1.5,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  product: {
    width: "48%",
    marginBottom: 15,
    padding: 10,
    // border: "1px solid grey",
    borderRadius: 5,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 330,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    display: "flex",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  code: {
    fontSize: 11,
    color: "#777",
    marginBottom: 5,
    textAlign: "center",
  },
  price: {
    fontSize: 12,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Lato",
  },
  headerText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    marginTop: 15,
    fontWeight: "bold",
  },
});

const CreatePDF = () => {
  const DealerEmail = localStorage.getItem("email");
  const [removingItemId, setRemovingItemId] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedReadyProducts, setSelectedReadyProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectReadyAll, setSelectReadyAll] = useState(false);

  const {
    data,
    isLoading: isPdfListLoading,
    isError,
    error,
    refetch: refetchPdfList,
  } = useQuery({
    queryKey: ["pdfList", DealerEmail],
    queryFn: () => DealerPdf.pdfList({ email: DealerEmail }),
    keepPreviousData: true,
    onError: (err) => {
      console.log("Error fetching pdf list:", err);
    },
  });

  const pdfLists = data?.data?.pdf_items || [];

  const RemovePdf = (designIds) => {
    setRemovingItemId(designIds);
    DealerPdf.removePdf({ email: DealerEmail, design_ids: designIds })
      .then((res) => {
        toast.success(res.message);
        refetchPdfList();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error removing PDF");
      });
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products to delete.");
      return;
    }
    RemovePdf(selectedProducts);
    setSelectedProducts([]);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(pdfLists.map((product) => product.id));
    }
    setSelectAll(!selectAll);
  };

  const {
    data: readyPdfDatas,
    isLoading: isReadyPdfListLoading,
    refetch: refetchReadyPdfList,
  } = useQuery({
    queryKey: ["readyPdfList", DealerEmail],
    queryFn: () => DealerPdf.readyPdfList({ email: DealerEmail }),
    keepPreviousData: true,
    onError: (err) => {
      console.log("Error fetching ready pdf list:", err);
    },
  });

  const readyPdfLists = readyPdfDatas?.data?.ready_pdfs_list || [];

  const ReadyRemovePdf = (designIds) => {
    setRemovingItemId(designIds);
    DealerPdf.readyRemovePdf({ design_ids: designIds })
      .then((res) => {
        toast.success(res.message);
        refetchReadyPdfList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReadyCheckboxChange = (productId) => {
    setSelectedReadyProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleDeleteReadySelected = () => {
    if (selectedReadyProducts.length === 0) {
      toast.error("Please select products to delete.");
      return;
    }
    ReadyRemovePdf(selectedReadyProducts);
    setSelectedReadyProducts([]);
  };

  const handleSelectReadyAll = () => {
    if (selectReadyAll) {
      setSelectedReadyProducts([]);
    } else {
      setSelectedReadyProducts(readyPdfLists.map((product) => product.barcode));
    }
    setSelectReadyAll(!selectReadyAll);
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  const pdfDataPrint = () => {
    const productsPerPage = 4;
    const pages = [];

    // Split the pdfLists array into chunks of 4 products per page
    for (let i = 0; i < pdfLists.length; i += productsPerPage) {
      const productGroup = pdfLists.slice(i, i + productsPerPage);

      pages.push(
        <Page size="A4" style={styles.page} key={i}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              src={
                "data:image/png;base64,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"
              }
            />
          </View>

          <View style={styles.productContainer}>
            {productGroup.map((page) => (
              <View key={page.id} style={styles.product}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} src={page?.image} />
                </View>
                <Text style={styles.name}>{page.name}</Text>
                <Text style={styles.code}>Code: {page.code}</Text>
                <Text style={styles.price}>
                  ₹{numberFormat(page.total_amount_18k)} (Approx.)
                </Text>
              </View>
            ))}
          </View>
        </Page>
      );
    }

    return <Document>{pages}</Document>;
  };

  const pdfReadyDataPrint = () => {
    const productsPerPage = 4;
    const pages = [];

    for (let i = 0; i < readyPdfLists.length; i += productsPerPage) {
      const productGroup = readyPdfLists.slice(i, i + productsPerPage);

      pages.push(
        <Page size="A4" style={styles.page} key={i}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              src={
                "data:image/png;base64,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"
              }
            />
          </View>

          <View style={styles.productContainer}>
            {productGroup.map((page) => (
              <View key={page.id} style={styles.product}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} src={page?.image} />
                </View>
                <Text style={styles.name}>{page.name}</Text>
                <Text style={styles.code}>Code: {page.tag_no}</Text>
                <Text style={styles.price}>
                  ₹{numberFormat(page.total_amount)} (Approx.)
                </Text>
              </View>
            ))}
          </View>
        </Page>
      );
    }

    return <Document>{pages}</Document>;
  };

  return (
    <>
      <Helmet>
        <title>Impel Store - Dealer PDF Share</title>
      </Helmet>
      <section className="wishlist">
        <div className="container">
          {isReadyPdfListLoading && isPdfListLoading ? (
            <Loader />
          ) : (
            <>
              <>
                <div className="new-wishlist-section">
                  <div className="container py-3">
                    <div className="row">
                      {pdfLists?.length ? (
                        <>
                          <div className="col-lg-6 col-md-6 col-12">
                            <div className="d-flex justify-content-between">
                              <h3>Make by Order PDF Share</h3>
                            </div>
                            <div
                              style={{
                                border: "1px solid #b4b4b4",
                                borderRadius: "5px",
                                padding: "12px",
                              }}
                            >
                              <div className="d-flex justify-content-between">
                                <PDFDownloadLink
                                  document={pdfDataPrint()}
                                  filename="FORM.pdf"
                                  style={{ textDecoration: "none" }}
                                >
                                  {({ loading }) =>
                                    loading ? (
                                      <button className="pdf-share-btn mt-2">
                                        Loading Document...
                                      </button>
                                    ) : (
                                      <button className="pdf-share-btn mt-2">
                                        Share <IoShareSocial className="ms-2" />
                                      </button>
                                    )
                                  }
                                </PDFDownloadLink>
                                <div className="d-flex gap-2 align-items-center">
                                  <div className="pdf-checkbox-btn select-all-btn-pdf">
                                    <input
                                      type="checkbox"
                                      id="select-all-checkbox"
                                      checked={selectAll}
                                      onChange={handleSelectAll}
                                      className="address-checkbox"
                                      style={{
                                        cursor: "pointer",
                                        marginRight: "8px",
                                      }}
                                    />
                                    <label
                                      htmlFor="select-all-checkbox"
                                      style={{ cursor: "pointer" }}
                                      className="d-flex gap-1"
                                    >
                                      Select All
                                    </label>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={handleDeleteSelected}
                                      disabled={selectedProducts.length === 0}
                                    >
                                      Delete Selected
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {pdfLists?.map((product) => {
                                return (
                                  <>
                                    <div key={product.id}>
                                      <div className="row">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                          <hr />
                                          <div className="cart-item">
                                            <div className="row">
                                              <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className="d-flex mb-3">
                                                  <img
                                                    className="img-fluid"
                                                    style={{
                                                      width: "120px",
                                                      height: "auto",
                                                    }}
                                                    src={product?.image}
                                                    alt={product?.name}
                                                  />
                                                  <div className="mx-3">
                                                    <h5>{product?.name}</h5>
                                                    <p className="mb-2">
                                                      {product?.code}
                                                    </p>
                                                    <h5 className="text-success fw-bold">
                                                      &#x20B9;
                                                      {numberFormat(
                                                        product?.total_amount_18k
                                                      )}
                                                    </h5>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                                <div
                                                  style={{
                                                    display: "grid",
                                                    justifyContent: "end",
                                                    gap: "15px",
                                                  }}
                                                >
                                                  <div className="pdf-checkbox-btn d-flex justify-content-end">
                                                    <input
                                                      type="checkbox"
                                                      id={`checkbox-${product.id}`}
                                                      className="address-checkbox"
                                                      checked={selectedProducts.includes(
                                                        product.id
                                                      )}
                                                      onChange={() =>
                                                        handleCheckboxChange(
                                                          product.id
                                                        )
                                                      }
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                    <label
                                                      htmlFor={`checkbox-${product.id}`}
                                                      className="pdf-check-text"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    ></label>
                                                  </div>
                                                  {/* <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(
                                                      product.id
                                                    )}
                                                    onChange={() =>
                                                      handleCheckboxChange(
                                                        product.id
                                                      )
                                                    }
                                                  /> */}

                                                  <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() =>
                                                      RemovePdf([product.id])
                                                    }
                                                  >
                                                    {removingItemId.includes(
                                                      product?.id
                                                    ) ? (
                                                      <CgSpinner
                                                        size={20}
                                                        className="animate_spin"
                                                      />
                                                    ) : (
                                                      <MdDeleteOutline
                                                        style={{
                                                          fontSize: "20px",
                                                        }}
                                                      />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-lg-6">
                          <div className="card border shadow-sm p-4">
                            <div className="text-center mb-4">
                              <h2 className="card-title mb-0">
                                Design PDF Sharing
                              </h2>
                            </div>
                            <div className="text-center my-4">
                              <img
                                src={emptycart}
                                alt="Empty Cart Illustration"
                                className="img-fluid mb-3"
                                style={{ maxWidth: "200px" }}
                              />
                              <h5 className="text-muted mb-3">
                                Oops! Your Sharing is Empty.
                              </h5>
                              <p className="text-muted">
                                Explore our collection and add your sharing
                                products in your Selections
                              </p>
                            </div>
                            <div className="text-center">
                              <Link
                                to="/shop"
                                className="view_all_btn px-4 py-2"
                                style={{ borderRadius: "8px" }}
                              >
                                <FaLongArrowAltLeft className="mr-2" />{" "}
                                &nbsp;Back to Shop
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                      {readyPdfLists?.length ? (
                        <>
                          <div className="col-lg-6 col-md-6 col-12">
                            <div className="d-flex justify-content-between">
                              <h3>Ready jewellery PDF Share Design</h3>
                            </div>
                            <div
                              style={{
                                border: "1px solid #b4b4b4",
                                borderRadius: "5px",
                                padding: "12px",
                              }}
                            >
                              <div className="d-flex justify-content-between">
                                <PDFDownloadLink
                                  document={pdfReadyDataPrint()}
                                  filename="FORM.pdf"
                                  style={{ textDecoration: "none" }}
                                >
                                  {({ loading }) =>
                                    loading ? (
                                      <button className="pdf-share-btn mt-2">
                                        Loading Document...
                                      </button>
                                    ) : (
                                      <button className="pdf-share-btn mt-2">
                                        Share <IoShareSocial className="ms-2" />
                                      </button>
                                    )
                                  }
                                </PDFDownloadLink>
                                <div className="d-flex gap-2 align-items-center">
                                  <div className="pdf-checkbox-btn select-all-btn-pdf">
                                    <input
                                      type="checkbox"
                                      id="select-ready-all-checkbox"
                                      checked={selectReadyAll}
                                      onChange={handleSelectReadyAll}
                                      className="address-checkbox"
                                      style={{
                                        cursor: "pointer",
                                        marginRight: "8px",
                                      }}
                                    />
                                    <label
                                      htmlFor="select-ready-all-checkbox"
                                      style={{ cursor: "pointer" }}
                                      className="d-flex gap-1"
                                    >
                                      Select All
                                    </label>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={handleDeleteReadySelected}
                                      disabled={
                                        selectedReadyProducts.length === 0
                                      }
                                    >
                                      Delete Selected
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {readyPdfLists?.map((product) => {
                                return (
                                  <div key={product.id}>
                                    <div className="row">
                                      <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                        <hr />
                                        <div className="cart-item">
                                          <div className="row">
                                            <div className="col-12 col-sm-12 col-md-8 col-lg-8">
                                              <div className="d-flex mb-3">
                                                <img
                                                  className=""
                                                  style={{
                                                    width: "120px",
                                                    height: "auto",
                                                  }}
                                                  src={product?.image}
                                                  onError={(e) => {
                                                    e.target.onerror = null;
                                                  }}
                                                  alt=""
                                                  loading="lazy"
                                                />
                                                <div className="mx-3">
                                                  <h5>{product?.name}</h5>
                                                  <p className="mb-2">
                                                    {product?.tag_no}
                                                  </p>
                                                  <h5 className="text-success fw-bold">
                                                    ₹
                                                    {numberFormat(
                                                      product?.total_amount
                                                    )}
                                                  </h5>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                              <div
                                                style={{
                                                  display: "grid",
                                                  justifyContent: "end",
                                                  gap: "15px",
                                                }}
                                              >
                                                <div className="pdf-checkbox-btn d-flex justify-content-end">
                                                  <input
                                                    type="checkbox"
                                                    id={`checkbox-${product.barcode}`}
                                                    className="address-checkbox"
                                                    checked={selectedReadyProducts.includes(
                                                      product.barcode
                                                    )}
                                                    onChange={() =>
                                                      handleReadyCheckboxChange(
                                                        product.barcode
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                  <label
                                                    htmlFor={`checkbox-${product.barcode}`}
                                                    className="pdf-check-text"
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  ></label>
                                                </div>
                                                <button
                                                  type="button"
                                                  className="btn btn-danger"
                                                  onClick={() =>
                                                    ReadyRemovePdf([
                                                      product?.barcode,
                                                    ])
                                                  }
                                                >
                                                  {removingItemId.includes(
                                                    product?.barcode
                                                  ) ? (
                                                    <CgSpinner
                                                      size={20}
                                                      className="animate_spin"
                                                    />
                                                  ) : (
                                                    <MdDeleteOutline
                                                      style={{
                                                        fontSize: "20px",
                                                      }}
                                                    />
                                                  )}
                                                </button>
                                              </div>
                                              {/* <div className="d-flex justify-content-end">
                                                <button
                                                  type="button"
                                                  className="btn btn-danger"
                                                  onClick={() =>
                                                    ReadyRemovePdf(product?.id)
                                                  }
                                                >
                                                  {removingItemId ===
                                                  product?.id ? (
                                                    <CgSpinner
                                                      size={20}
                                                      className="animate_spin"
                                                    />
                                                  ) : (
                                                    <MdDeleteOutline
                                                      style={{
                                                        fontSize: "20px",
                                                      }}
                                                    />
                                                  )}
                                                </button>
                                              </div> */}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-lg-6">
                          <div className="card border shadow-sm p-4">
                            <div className="text-center mb-4">
                              <h2 className="card-title mb-0">
                                Design PDF Sharing
                              </h2>
                            </div>
                            <div className="text-center my-4">
                              <img
                                src={emptycart}
                                alt="Empty Cart Illustration"
                                className="img-fluid mb-3"
                                style={{ maxWidth: "200px" }}
                              />
                              <h5 className="text-muted mb-3">
                                Oops! Your Sharing is Empty.
                              </h5>
                              <p className="text-muted">
                                Explore our collection and add your sharing
                                products in your Selections
                              </p>
                            </div>
                            <div className="text-center">
                              <Link
                                to="/ready-to-dispatch"
                                className="view_all_btn px-4 py-2"
                                style={{ borderRadius: "8px" }}
                              >
                                <FaLongArrowAltLeft className="mr-2" />{" "}
                                &nbsp;Back to Ready jewellery
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default CreatePDF;
