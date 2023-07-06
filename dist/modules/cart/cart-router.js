"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var auth_1 = require("../../middlware/auth");
var constant_1 = require("../../constant");
var cart_controller_1 = require("./cart-controller");
var successMsgs = constant_1.default.successMsgs, errorMsgs = constant_1.default.errorMsgs, statusCodes = constant_1.default.statusCodes;
var success = successMsgs.success;
var serverError = errorMsgs.serverError, noProductError = errorMsgs.noProductError;
var createdC = statusCodes.createdC, badRequestC = statusCodes.badRequestC, notFoundC = statusCodes.notFoundC, serverErrorC = statusCodes.serverErrorC;
var cartRouter = express.Router();
exports.default = cartRouter;
cartRouter.get("/viewcart", auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, cartproducts, productsArray, length_1, totalQuant, i, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.body.user;
                return [4 /*yield*/, (0, cart_controller_1.viewCart)(user._id)];
            case 1:
                cartproducts = _a.sent();
                productsArray = cartproducts === null || cartproducts === void 0 ? void 0 : cartproducts.products;
                length_1 = productsArray === null || productsArray === void 0 ? void 0 : productsArray.length;
                totalQuant = 0;
                if (length_1) {
                    for (i = 0; i < length_1; i++) {
                        totalQuant = totalQuant + productsArray[i].quantity;
                    }
                }
                res.send({ "Total Quantity": totalQuant, data: productsArray });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                res.status(serverErrorC).send(serverError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
cartRouter.post("/:id", auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, quantity, _id, product, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.body.user;
                quantity = req.body.quantity;
                _id = req.params.id;
                return [4 /*yield*/, (0, cart_controller_1.addToCart)(_id, user, quantity)];
            case 1:
                product = _a.sent();
                res.status(createdC).send({ data: product, message: success });
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                res.status(badRequestC).send(e_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
cartRouter.delete("/deleteproductfromcart/:id", auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, product, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.body.user;
                return [4 /*yield*/, (0, cart_controller_1.deleteProductFromCart)(req.params.id, user._id)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, res.status(notFoundC).send(noProductError)];
                }
                res.send({ data: product });
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                res.status(serverErrorC).send(serverError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=cart-router.js.map