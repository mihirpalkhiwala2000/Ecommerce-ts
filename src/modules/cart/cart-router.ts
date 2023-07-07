import * as express from "express";
import { Request, Response } from "express";
import { auth } from "../../middlware/auth";
import constants from "../../constant";
import { deleteProductFromCart, viewCart, addToCart } from "./cart-controller";
import { sendResponse } from "../../utils/resUtil";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { serverError, noProductError, emptyCart } = errorMsgs;

const cartRouter = express.Router();
export default cartRouter;

cartRouter.get("/", auth, async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const { products, totalValues } = await viewCart(user);

    if (totalValues.length != 0) {
      sendResponse(
        res,
        {
          totalQuantity: totalValues[0].totalQuantity,
          totalPrice: totalValues[0].totalPrice,
          data: products,
        },
        statusCodes.success
      );
    } else {
      throw new Error(emptyCart);
    }
  } catch (e: any) {
    sendResponse(res, e.message, statusCodes.serverError);
  }
});

cartRouter.post("/:id", auth, async (req: Request, res: Response) => {
  try {
    const { user, quantity } = req.body;

    const _id = req.params.id;

    const product = await addToCart(_id, user, quantity);
    sendResponse(res, { data: product, message: success }, statusCodes.created);
  } catch (e: any) {
    sendResponse(res, e.message, statusCodes.badRequest);
  }
});

cartRouter.delete(
  "/removeProdut/:id",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { user } = req.body;
      const product = await deleteProductFromCart(req.params.id, user);

      if (!product) {
        return sendResponse(res, noProductError, statusCodes.notFound);
      }
      sendResponse(res, { data: product }, statusCodes.success);
    } catch (e) {
      sendResponse(res, serverError, statusCodes.serverError);
    }
  }
);
