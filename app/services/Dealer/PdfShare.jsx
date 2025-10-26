import call from "../Call";

const addToPdf = async (data) => {
  let d = await call({
    path: "add-pdf-design",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const pdfList = async (data) => {
  let d = await call({
    path: "pdf-design-list",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const removePdf = async (data) => {
  let d = await call({
    path: "remove-pdf-design",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const readytAddToPdf = async (data) => {
  let d = await call({
    path: "ready-to-pdf-store",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const readyPdfList = async (data) => {
  let d = await call({
    path: "ready-to-pdf-list",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const readyRemovePdf = async (data) => {
  let d = await call({
    path: "ready-to-pdf-delete",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const exportObject = {
  addToPdf,
  pdfList,
  removePdf,
  readytAddToPdf,
  readyPdfList,
  readyRemovePdf,
};

export default exportObject;
