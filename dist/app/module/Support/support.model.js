"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Support = void 0;
const mongoose_1 = require("mongoose");
const supportSchema = new mongoose_1.Schema({
    userEmail: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    problemDescription: {
        type: String,
        required: true
    },
    solveStatus: {
        type: String,
        enum: ["Pending", "Resolve"],
        default: "Pending"
    },
    replay: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false,
});
exports.Support = (0, mongoose_1.model)("Support", supportSchema);
//# sourceMappingURL=support.model.js.map