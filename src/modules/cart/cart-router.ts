import * as express from "express";
import { Request, Response } from "express";
import { auth } from "../../middlware/auth";
import constants from "../../constant";
import { deleteProductFromCart, viewCart, addToCart } from "./cart-controller";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { serverError, noProductError } = errorMsgs;
const { createdC, badRequestC, notFoundC, serverErrorC } = statusCodes;

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
    res.send({ "Total Quantity": totalQuant, data: productsArray });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

cartRouter.post("/:id", auth, async (req: Request, res: Response) => {
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

cartRouter.delete(
  "/deleteproductfromcart/:id",
  auth,
  async (req: Request, res: Response) => {
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
  }
);
