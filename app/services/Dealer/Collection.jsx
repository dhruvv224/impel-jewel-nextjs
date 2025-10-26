import call from "../Call";

const addtoDealerWishlist = async (data) => {
  let d = await call({
    path: "add-collection-design",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const removetodealerWishlist = async (data) => {
  let d = await call({
    path: "remove-collection-design",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const ListCollection = async (data) => {
  let d = await call({
    path: "list-collection-design",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const exportObject = {
  addtoDealerWishlist,
  removetodealerWishlist,
  ListCollection,
};

export default exportObject;
