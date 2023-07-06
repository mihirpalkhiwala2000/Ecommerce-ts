import * as express from "express";
import { Request, Response } from "express";
import { auth, adminAuth } from "../../middlware/auth";
import constants from "../../constant";
import {
  createProduct,
  deleteProduct,
  displayMyProduct,
  displayProduct,
} from "./products-controller";
import { sendResponse } from "../../utils/resUtil";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { badRequest, serverError, noProductError } = errorMsgs;

const productRouter = express.Router();
export default productRouter;

productRouter.post("", adminAuth, async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const owner = user._id;
    const product = await createProduct(req.body, owner);
    delete req.body.user;

    sendResponse(res, { data: product, message: success }, statusCodes.created);
  } catch (e: any) {
    sendResponse(res, badRequest, statusCodes.badRequest);
  }
});

productRouter.get("", auth, async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    const products = await displayProduct(query);
    sendResponse(res, { data: products }, statusCodes.success);
  } catch (e) {
    sendResponse(res, serverError, statusCodes.serverError);
  }
});

productRouter.get(
  "/myproducts",
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const query: any = req.query;
      const { user } = req.body;
      const products = await displayMyProduct(query, user._id);
      sendResponse(res, { data: products }, statusCodes.success);
    } catch (e) {
      sendResponse(res, serverError, statusCodes.serverError);
    }
  }
);

productRouter.delete(
  "/deleteproduct/:id",
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const { user } = req.body;
      const product = await deleteProduct(req.params.id, user._id);

      if (!product) {
        return sendResponse(res, noProductError, statusCodes.notFound);
      }
      sendResponse(res, { data: product }, statusCodes.success);
    } catch (e) {
      sendResponse(res, serverError, statusCodes.serverError);
    }
  }
);
