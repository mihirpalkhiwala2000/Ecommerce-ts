import * as express from "express";
import { Request, Response } from "express";
import { auth, superAdminAuth } from "../../middlware/auth";
import constants from "../../constant";
import { sendResponse } from "../../utils/resUtil";
import { displayTotalSales, orderProcessed } from "./order-controller";
import Order from "./order-model";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { serverError, noProductError, emptyCart } = errorMsgs;

const orderRouter = express.Router();
export default orderRouter;

orderRouter.post("/", auth, async (req: Request, res: Response) => {
  try {
    const { user, paymentMode } = req.body;

    const order = await orderProcessed(user, paymentMode);

    sendResponse(res, { data: order, message: success }, statusCodes.created);
  } catch (e: any) {
    sendResponse(res, e.message, statusCodes.badRequest);
  }
});

orderRouter.get(
  "/total",
  superAdminAuth,
  async (req: Request, res: Response) => {
    try {
      const sales = await displayTotalSales();

      sendResponse(res, { data: sales, message: success }, statusCodes.created);
    } catch (e: any) {
      sendResponse(res, e.message, statusCodes.badRequest);
    }
  }
);
