"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const support_model_1 = require("./support.model");
const sendResponse_1 = require("../../utils/sendResponse");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const createSupport = (0, catchAsync_1.default)(async (req, res, next) => {
    const email = req.authUser?.email;
    const data = req.body;
    const payload = {
        userEmail: email,
        ...data
    };
    const createSupport = await support_model_1.Support.create(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Message sent to support",
        data: createSupport
    });
});
const getAllSupport = (0, catchAsync_1.default)(async (req, res, next) => {
    const totalResolve = await support_model_1.Support.find({ solveStatus: "Resolve" }).countDocuments();
    const totalPending = await support_model_1.Support.find({ solveStatus: "Pending" }).countDocuments();
    const supportQuery = new QueryBuilder_1.QueryBuilder(support_model_1.Support.find(), req.query)
        .filter() // ✅ এটা add করা হয়েছে
        .search(["userEmail", "phone", "problemDescription"])
        .sort()
        .paginate();
    const result = await supportQuery.build();
    const meta = await supportQuery.getMeta();
    res.status(200).json({
        success: true,
        message: "Support list retrieved successfully",
        meta,
        data: {
            totalResolve,
            totalPending,
            data: result,
        },
    });
});
const updateSupportStatus = (0, catchAsync_1.default)(async (req, res, next) => {
    const { supportId } = req.params;
    const { solveStatus, replay } = req.body;
    const updatedSupport = await support_model_1.Support.findByIdAndUpdate(supportId, {
        solveStatus,
        replay,
    }, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        message: "Support updated successfully",
        data: { updatedSupport },
    });
});
exports.supportController = {
    createSupport,
    getAllSupport,
    updateSupportStatus
};
//# sourceMappingURL=support.controller.js.map