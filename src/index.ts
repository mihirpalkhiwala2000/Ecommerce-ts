import * as express from "express";
import("./db/mongoose");
const app = express();
const port = process.env.PORT || 3000;
import userRouter from "./modules/users/user-router";
import productRouter from "./modules/products/products-router";
app.use(express.json());
app.use("/users", userRouter);
app.use("/products", productRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
