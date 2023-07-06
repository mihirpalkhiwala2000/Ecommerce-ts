import * as express from "express";
import("./db/mongoose");
import userRouter from "./modules/users/user-router";
import productRouter from "./modules/products/products-router";
import cartRouter from "./modules/cart/cart-router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
