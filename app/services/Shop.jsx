import call from "./Call";

const allfilterdesigns = async (data) => {
  let d = await call({
    path: "filter-design",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const product_detail = async (data) => {
  let d = await call({
    path: "design-detail",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const related_products = async (data) => {
  let d = await call({
    path: "related-designs",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const exportObject = {
  related_products,
  allfilterdesigns,
  product_detail,
};

export default exportObject;
