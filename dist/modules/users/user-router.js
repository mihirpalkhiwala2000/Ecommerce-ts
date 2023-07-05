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
var user_models_1 = require("./user-models");
var user_controller_1 = require("./user-controller");
var constant_1 = require("../../constant");
var auth_1 = require("../../middlware/auth");
var enums_1 = require("./enums");
var userRouter = express.Router();
exports.default = userRouter;
var successMsgs = constant_1.default.successMsgs, errorMsgs = constant_1.default.errorMsgs, statusCodes = constant_1.default.statusCodes;
var successfulLogout = successMsgs.successfulLogout, created = successMsgs.created, login = successMsgs.login;
var invalidFields = errorMsgs.invalidFields, badRequest = errorMsgs.badRequest, serverError = errorMsgs.serverError, emailError = errorMsgs.emailError, emailLoginError = errorMsgs.emailLoginError, emailusedError = errorMsgs.emailusedError;
var createdC = statusCodes.createdC, badRequestC = statusCodes.badRequestC, serverErrorC = statusCodes.serverErrorC;
userRouter.post("", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, token, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                req.body.role = enums_1.RoleEnum.user;
                return [4 /*yield*/, (0, user_controller_1.createUser)(req.body)];
            case 1:
                _a = _b.sent(), user = _a.user, token = _a.token;
                res.status(createdC).send({
                    data: user,
                    token: token,
                    message: created,
                });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _b.sent();
                res.status(badRequestC).send(e_1.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.post("/createadmin", auth_1.superAdminAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, token, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                req.body.role = enums_1.RoleEnum.admin;
                return [4 /*yield*/, (0, user_controller_1.createUser)(req.body)];
            case 1:
                _a = _b.sent(), user = _a.user, token = _a.token;
                res.status(createdC).send({
                    data: user,
                    token: token,
                    message: created,
                });
                return [3 /*break*/, 3];
            case 2:
                e_2 = _b.sent();
                res.status(badRequestC).send(e_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, _b, user, token, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, user_controller_1.loginUser)(email, password)];
            case 1:
                _b = _c.sent(), user = _b.user, token = _b.token;
                res.send({ user: user, token: token, message: login });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.log("🚀 ~ file: user-router.ts:69 ~ userRouter.post ~ error:", error_1);
                res.status(badRequestC).send(error_1.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.post("/logout", auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, token_1, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, user = _a.user, token_1 = _a.token;
                user.tokens = user.tokens.filter(function (tokenIn) {
                    return tokenIn.token !== token_1;
                });
                return [4 /*yield*/, user_models_1.default.create(user)];
            case 1:
                _b.sent();
                res.send(successfulLogout);
                return [3 /*break*/, 3];
            case 2:
                e_3 = _b.sent();
                res.status(serverErrorC).send(serverError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/me", auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = req.body.user;
        res.send({ data: user });
        return [2 /*return*/];
    });
}); });
userRouter.patch("/me", auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, isValidOperation, user, retuser, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updates = Object.keys(req.body.data);
                return [4 /*yield*/, (0, user_controller_1.validateUpdates)(updates)];
            case 1:
                isValidOperation = _a.sent();
                if (!isValidOperation) {
                    return [2 /*return*/, res.status(badRequestC).send(invalidFields)];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                user = req.body.user;
                return [4 /*yield*/, (0, user_controller_1.updateUser)(user, req.body.data)];
            case 3:
                retuser = _a.sent();
                res.send({ data: retuser });
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                res.status(badRequestC).send(e_4.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
userRouter.delete("/me", auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.body.user;
                return [4 /*yield*/, (0, user_controller_1.deleteUser)(user._id)];
            case 1:
                _a.sent();
                res.send({ data: user });
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                res.status(serverErrorC).send(serverError);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.delete("/deleteuser", auth_1.adminAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, deletedUser, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                return [4 /*yield*/, (0, user_controller_1.deleteUserByAdmin)(email)];
            case 1:
                deletedUser = _a.sent();
                res.send({ "following user deleted": deletedUser });
                return [3 /*break*/, 3];
            case 2:
                e_6 = _a.sent();
                res.status(serverErrorC).send(e_6.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=user-router.js.map