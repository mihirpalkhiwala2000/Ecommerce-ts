import * as express from "express";
import { Request } from "express";
import { auth, adminAuth } from "../../middlware/auth";
import constants from "../../constant";
import {
  addToCart,
  createProduct,
  deleteProduct,
  deleteProductFromCart,
  displayMyProduct,
  displayProduct,
  viewCart,
} from "./products-controller";
import { ObjectId } from "mongoose";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { badRequest, serverError, notFound, noProductError } = errorMsgs;
const { createdC, badRequestC, notFoundC, serverErrorC } = statusCodes;

const productRouter = express.Router();
export default productRouter;

productRouter.post("", adminAuth, async (req, res) => {
  try {
    const { user } = req.body;
    const reqBody = req.body;
    const owner = user._id;
    const product = await createProduct(req.body, owner);

    delete req.body.user;
    res.status(createdC).send({ data: product, message: success });
  } catch (e: any) {
    res.status(badRequestC).send(badRequest);
  }
});

productRouter.get("", auth, async (req: Request, res) => {
  try {
    const query: any = req.query;
    const products = await displayProduct(query);
    res.send({ data: products });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

productRouter.get("/myproducts", adminAuth, async (req: Request, res) => {
  try {
    const query: any = req.query;
    const { user } = req.body;
    const products = await displayMyProduct(query, user._id);
    res.send({ data: products });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

productRouter.post("/:id", auth, async (req, res) => {
  try {
    const { user } = req.body;
    const { quantity } = req.body;

    const _id = req.params.id;

    const product = await addToCart(_id, user, quantity);

    res.status(createdC).send({ data: product, message: success });
  } catch (e: any) {
    res.status(badRequestC).send(e.message);
  }
});

productRouter.get("/viewcart", auth, async (req: Request, res) => {
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
    res.send({ "Total Quantity": totalQuant, data: productsArray });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

productRouter.delete("/deleteproduct/:id", adminAuth, async (req, res) => {
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
});

productRouter.delete("/deleteproductfromcart/:id", auth, async (req, res) => {
  try {
    const { user } = req.body;
    const product = await deleteProductFromCart(req.params.id, user._id);

    if (!product) {
      return res.status(notFoundC).send(noProductError);
    }
    res.send({ data: product });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
