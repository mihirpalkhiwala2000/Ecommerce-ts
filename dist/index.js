"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
Promise.resolve().then(function () { return require("./db/mongoose"); });
var app = express();
var port = process.env.PORT || 3000;
var user_router_1 = require("./modules/users/user-router");
var products_router_1 = require("./modules/products/products-router");
app.use(express.json());
app.use("/users", user_router_1.default);
app.use("/products", products_router_1.default);
app.listen(port, function () {
    console.log("Server is up on port " + port);
});
//# sourceMappingURL=index.js.map