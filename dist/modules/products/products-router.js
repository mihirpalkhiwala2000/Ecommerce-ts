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
var products_controller_1 = require("./products-controller");
var successMsgs = constant_1.default.successMsgs, errorMsgs = constant_1.default.errorMsgs, statusCodes = constant_1.default.statusCodes;
var success = successMsgs.success;
var badRequest = errorMsgs.badRequest, serverError = errorMsgs.serverError, noProductError = errorMsgs.noProductError;
var createdC = statusCodes.createdC, badRequestC = statusCodes.badRequestC, notFoundC = statusCodes.notFoundC, serverErrorC = statusCodes.serverErrorC;
var productRouter = express.Router();
exports.default = productRouter;
productRouter.post("", auth_1.adminAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, owner, product, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.body.user;
                owner = user._id;
                return [4 /*yield*/, (0, products_controller_1.createProduct)(req.body, owner)];
            case 1:
                product = _a.sent();
                delete req.body.user;
                res.status(createdC).send({ data: product, message: success });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                res.status(badRequestC).send(badRequest);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
productRouter.get("", auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, products, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = req.query;
                return [4 /*yield*/, (0, products_controller_1.displayProduct)(query)];
            case 1:
                products = _a.sent();
                res.send({ data: products });
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                res.status(serverErrorC).send(serverError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
productRouter.get("/myproducts", auth_1.adminAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, user, products, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = req.query;
                user = req.body.user;
                return [4 /*yield*/, (0, products_controller_1.displayMyProduct)(query, user._id)];
            case 1:
                products = _a.sent();
                res.send({ data: products });
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                res.status(serverErrorC).send(serverError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
productRouter.delete("/deleteproduct/:id", auth_1.adminAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, product, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.body.user;
                return [4 /*yield*/, (0, products_controller_1.deleteProduct)(req.params.id, user._id)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, res.status(notFoundC).send(noProductError)];
                }
                res.send({ data: product });
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                console.log("🚀 ~ file: products-router.ts:101 ~ productRouter.delete ~ e:", e_4);
                res.status(serverErrorC).send(serverError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=products-router.js.map