import call from "./Call";

const AddtoCart = async (data) => {
  let d = await call({
    path: "user/cart-store",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const RemovetoCart = async (data) => {
  let d = await call({
    path: "user/cart-remove",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const CartList = async (data) => {
  let d = await call({
    path: "user/cart-list",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const Placeorder = async (data) => {
  let d = await call({
    path: "user/purchase-order",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const ShipmentCreate = async (data) => {
  let d = await call({
    path: "shipment-create",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const DealerCode = async (data) => {
  let d = await call({
    path: "apply-dealer-code",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const PinCodeCheck = async (data) => {
  let d = await call({
    path: "check-service-ability",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const Payment = async (data) => {
  let d = await call({
    path: "cashfree/payments/doCashFreePayment",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const Updatecart = async (data) => {
  let d = await call({
    path: "user/cart-update",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const Orderdetails = async (data) => {
  let d = await call({
    path: "order-details",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const DeliveryTrack = async (data) => {
  let d = await call({
    path: "delivery-track",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const UserOrders = async (data) => {
  let d = await call({
    path: "my-orders",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const PayByPhonepeAPI = async (data) => {
  let d = await call({
    path: "phonepe/payment/getLink",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const OrdersTracking = async (data) => {
  let d = await call({
    path: "order-track-details",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const exportObject = {
  AddtoCart,
  RemovetoCart,
  CartList,
  Payment,
  DealerCode,
  Updatecart,
  Placeorder,
  PayByPhonepeAPI,
  UserOrders,
  Orderdetails,
  ShipmentCreate,
  PinCodeCheck,
  DeliveryTrack,
  OrdersTracking,
};

export default exportObject;
