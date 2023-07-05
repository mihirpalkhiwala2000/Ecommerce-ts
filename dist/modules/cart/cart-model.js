"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var cartSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    products: [
        {
            productId: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: "Product",
            },
            quantity: {
                type: Number,
            },
        },
    ],
}, {
    timestamps: true,
});
var Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.default = Cart;
//# sourceMappingURL=cart-model.js.map