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
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { badRequest, serverError, noProductError } = errorMsgs;
const { createdC, badRequestC, notFoundC, serverErrorC } = statusCodes;

const productRouter = express.Router();
export default productRouter;

productRouter.post("", adminAuth, async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const owner = user._id;
    const product = await createProduct(req.body, owner);
    delete req.body.user;
    res.status(createdC).send({ data: product, message: success });
  } catch (e: any) {
    res.status(badRequestC).send(badRequest);
  }
});

productRouter.get("", auth, async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    const products = await displayProduct(query);
    res.send({ data: products });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
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
      res.send({ data: products });
    } catch (e) {
      res.status(serverErrorC).send(serverError);
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
        return res.status(notFoundC).send(noProductError);
      }
      res.send({ data: product });
    } catch (e) {
      console.log(
        "🚀 ~ file: products-router.ts:101 ~ productRouter.delete ~ e:",
        e
      );
      res.status(serverErrorC).send(serverError);
    }
  }
);
