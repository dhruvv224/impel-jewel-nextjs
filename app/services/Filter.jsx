import call from "./Call";

const categoryFilter = async () => {
  let d = await call({
    path: "parent-category",
    method: "GET",
  });
  return d;
};

const subCategory = async (data) => {
  let d = await call({
    path: "child-category",
    method: "GET",
  });
  return d;
};

const genderFilter = async () => {
  let d = await call({
    path: "gender",
    method: "GET",
  });
  return d;
};

const TagFilter = async () => {
  let d = await call({
    path: "tags",
    method: "GET",
  });
  return d;
};

const metalFilter = async () => {
  let d = await call({
    path: "metal",
    method: "GET",
  });
  return d;
};
const headerTags = async () => {
  let d = await call({
    path: "header-tags",
    method: "GET",
  });
  return d;
};

const exportObject = {
  categoryFilter,
  subCategory,
  genderFilter,
  metalFilter,
  TagFilter,
  headerTags,
};

export default exportObject;
