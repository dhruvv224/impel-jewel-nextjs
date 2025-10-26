import call from "./Call";

const banners = async () => {
  let d = await call({
    path: "banners",
    method: "GET",
  });
  return d;
};

const category = async () => {
  let d = await call({
    path: "parent-category",
    method: "GET",
  });
  return d;
};

const TopSelling = async () => {
  let d = await call({
    path: "highest-selling-designs",
    method: "GET",
  });
  return d;
};

const RecentAdd = async () => {
  let d = await call({
    path: "latest-designs",
    method: "GET",
  });
  return d;
};

const Featured = async () => {
  let d = await call({
    path: "flash-design",
    method: "GET",
  });
  return d;
};

const SiteSetting = async () => {
  let d = await call({
    path: "site-settings",
    method: "GET",
  });
  return d;
};

const CustomPages = async (data) => {
  let d = await call({
    path: "get-page-details",
    method: "POST",
    data,
  });
  return d;
};

const WomansJoin = async (data) => {
  let d = await call({
    path: "womans-club-request",
    method: "POST",
    data,
  });
  return d;
};

const GetProductsAPI = async (data) => {
  let d = await call({
    path: "ready-to-dispatch",
    method: "POST",
    data,
  });
  return d;
};

const GetMasterGroups = async () => {
  let d = await call({
    path: "comanymaster-itemgroup",
    method: "GET",
  });
  return d;
};

const GetProductsPrices = async (data) => {
  let d = await call({
    path: "ready-to-dispatch-price",
    method: "POST",
    data,
  });
  return d;
};

const GetProductsFilterAPI = async (data) => {
  let d = await call({
    path: "ready-to-dispatch-filters",
    method: "POST",
    data,
  });
  return d;
};

const GetCompanyTag = async () => {
  let d = await call({
    path: "comanymaster",
    method: "GET",
  });
  return d;
};

const TestiMonials = async () => {
  let d = await call({
    path: "testimonials",
    method: "GET",
  });
  return d;
};

const GetPages = async () => {
  let d = await call({
    path: "get-pages",
    method: "GET",
  });
  return d;
};
const GetPopUpData=async()=>{
  let d = await call({
    path: "AboutSections",
    method: "GET",
  });
  return d;
}

const exportObject = {
  banners,
  category,
  TopSelling,
  RecentAdd,
  WomansJoin,
  GetProductsAPI,
  GetMasterGroups,
  GetProductsFilterAPI,
  GetCompanyTag,
  CustomPages,
  Featured,
  GetPages,
  SiteSetting,
  GetProductsPrices,
  TestiMonials,
  GetPopUpData,
};

export default exportObject;
