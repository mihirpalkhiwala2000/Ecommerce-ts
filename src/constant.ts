const successMsgs = {
  success: "Successful",
  successfulLogout: "You have successfully Logged out",
  created: "Created successfully",
  login: "Logged in successfully",
  connected: "Connected Successfully",
};

const errorMsgs = {
  badRequest: "Invalid request. Please try again!",
  serverError: "There is an internal server error.",
  unauthorized: "Access denied, please login first",
  notFound: "Nothing relevant found. Please try again.",
  emailError: "Email id is invalid",
  emailusedError: "Email already used",
  emailLoginError: "No user found with this mail id.",
  passError: "Password is invalid",
  ageError: "Age must be positive",
  noProductError: "No such product available",
  superadminError: "You are not a Super Admin",
  adminError: "You are not an admin",
  outOfStock: "Product is out of stock",
  invalidFields:
    "Certain input fields cannot be modified. Only name,age, email and password",
};
const statusCodes = {
  successC: 200,
  createdC: 201,
  badRequestC: 400,
  unauthorizedC: 401,
  notFoundC: 404,
  serverErrorC: 500,
};
export default {
  successMsgs,
  errorMsgs,
  statusCodes,
};
