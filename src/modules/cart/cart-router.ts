import * as express from "express";
import { Request, Response } from "express";
import { auth } from "../../middlware/auth";
import constants from "../../constant";
import { deleteProductFromCart, viewCart, addToCart } from "./cart-controller";
import { sendResponse } from "../../utils/resUtil";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { serverError, noProductError } = errorMsgs;

const cartRouter = express.Router();
export default cartRouter;

cartRouter.get("/viewcart", auth, async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const cartproducts = await viewCart(user._id);
    const productsArray = cartproducts?.products;
    const length = productsArray?.length;
    let totalQuant = 0;
    if (length) {
      for (let i = 0; i < length; i++) {
        totalQuant = totalQuant + productsArray[i].quantity;
      }
    }

    sendResponse(
      res,
      {
        "Total Quantity": totalQuant,
        data: productsArray,
      },
      statusCodes.success
    );
  } catch (e) {
    sendResponse(res, serverError, statusCodes.serverError);
  }
});

cartRouter.post("/:id", auth, async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const { quantity } = req.body;

    const _id = req.params.id;

    const product = await addToCart(_id, user, quantity);
    sendResponse(res, { data: product, message: success }, statusCodes.created);
  } catch (e: any) {
    sendResponse(res, e.message, statusCodes.badRequest);
  }
});

cartRouter.delete(
  "/deleteproductfromcart/:id",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { user } = req.body;
      const product = await deleteProductFromCart(req.params.id, user._id);

      if (!product) {
        return sendResponse(res, noProductError, statusCodes.notFound);
      }
      sendResponse(res, { data: product }, statusCodes.success);
    } catch (e) {
      sendResponse(res, serverError, statusCodes.serverError);
    }
  }
);
