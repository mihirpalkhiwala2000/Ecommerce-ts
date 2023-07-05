"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var dotenv = require("dotenv");
dotenv.config();
mongoose
    .connect(process.env.DB_PORT)
    .then(function () { return console.log("connected"); });
//# sourceMappingURL=mongoose.js.map