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
exports.updateUser = exports.validateUpdates = exports.deleteUserByAdmin = exports.deleteUser = exports.loginUser = exports.createUser = void 0;
var user_models_1 = require("./user-models");
var bcrypt = require("bcryptjs");
var generateTokensUtils_1 = require("../../utils/generateTokensUtils");
var findByCredentials_1 = require("../../utils/findByCredentials");
var constant_1 = require("../../constant");
var cart_model_1 = require("../cart/cart-model");
var errorMsgs = constant_1.default.errorMsgs;
var emailLoginError = errorMsgs.emailLoginError;
var createUser = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var user, password, _a, token, products;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                superAdmin();
                user = new user_models_1.default(userData);
                password = user.password;
                if (!user.isModified("password")) return [3 /*break*/, 2];
                _a = user;
                return [4 /*yield*/, bcrypt.hash(password, 8)];
            case 1:
                _a.password = _b.sent();
                _b.label = 2;
            case 2: return [4 /*yield*/, user_models_1.default.create(user)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, generateTokensUtils_1.default)(user)];
            case 4:
                token = _b.sent();
                products = [];
                return [4 /*yield*/, cart_model_1.default.create({ user: user._id, products: products })];
            case 5:
                _b.sent();
                return [2 /*return*/, { user: user, token: token }];
        }
    });
}); };
exports.createUser = createUser;
var superAdmin = function () { return __awaiter(void 0, void 0, void 0, function () {
    var superAd, createsuperAd, password, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_models_1.default.findOne({ role: 1 })];
            case 1:
                superAd = _a.sent();
                if (!!superAd) return [3 /*break*/, 5];
                createsuperAd = new user_models_1.default({
                    name: process.env.SA_NAME,
                    email: process.env.SA_EMAIL,
                    password: process.env.SA_PASSWORD,
                    role: parseInt(process.env.SA_ROLE),
                });
                return [4 /*yield*/, bcrypt.hash(createsuperAd.password, 8)];
            case 2:
                password = _a.sent();
                createsuperAd.password = password;
                return [4 /*yield*/, user_models_1.default.create(createsuperAd)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, generateTokensUtils_1.default)(createsuperAd)];
            case 4:
                token = _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
var loginUser = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, findByCredentials_1.default)(email, password)];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, (0, generateTokensUtils_1.default)(user)];
            case 2:
                token = _a.sent();
                return [2 /*return*/, { user: user, token: token }];
        }
    });
}); };
exports.loginUser = loginUser;
var deleteUser = function (reqUser_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_models_1.default.findOneAndDelete({
                    _id: reqUser_id,
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, cart_model_1.default.deleteOne({ user: reqUser_id })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var deleteUserByAdmin = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, deletedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_models_1.default.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, user_models_1.default.findOneAndDelete({
                        email: email,
                    })];
            case 2:
                deletedUser = _a.sent();
                return [4 /*yield*/, cart_model_1.default.deleteOne({ user: user._id })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4: throw new Error(emailLoginError);
            case 5: return [2 /*return*/, user];
        }
    });
}); };
exports.deleteUserByAdmin = deleteUserByAdmin;
var validateUpdates = function (updates) { return __awaiter(void 0, void 0, void 0, function () {
    var allowedUpdates, isValidOperation;
    return __generator(this, function (_a) {
        allowedUpdates = ["name", "email", "password", "age"];
        isValidOperation = updates.every(function (update) {
            return allowedUpdates.includes(update);
        });
        return [2 /*return*/, isValidOperation];
    });
}); };
exports.validateUpdates = validateUpdates;
var updateUser = function (user, reqBody) { return __awaiter(void 0, void 0, void 0, function () {
    var password, _a, _b, retuser;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                password = reqBody.password;
                if (!password) return [3 /*break*/, 2];
                _a = reqBody;
                _b = "password";
                return [4 /*yield*/, bcrypt.hash(password, 8)];
            case 1:
                _a[_b] = _c.sent();
                _c.label = 2;
            case 2:
                retuser = user_models_1.default.findOneAndUpdate({ email: user.email }, reqBody, {
                    new: true,
                });
                return [2 /*return*/, retuser];
        }
    });
}); };
exports.updateUser = updateUser;
//# sourceMappingURL=user-controller.js.map