"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgesController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const complited_course_model_1 = require("../ComplitedCourse/complited.course.model");
const mongoose_1 = require("mongoose");
const badges_model_1 = require("./badges.model");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const badges_services_1 = require("./badges.services");
const user_model_1 = require("../user/user.model");
const getUserBadges = async (req, res) => {
    try {
        const userId = req.authUser?.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not provided", });
        }
        const badges = await complited_course_model_1.ComplitedCourse.aggregate([
            // 1️⃣ Match user
            {
                $match: {
                    userId: new mongoose_1.Types.ObjectId(userId),
                },
            },
            // 2️⃣ Join with Badge collection
            {
                $lookup: {
                    from: "badges",
                    localField: "badgesId",
                    foreignField: "_id",
                    as: "badgeDetails",
                },
            },
            // 3️⃣ Array → Object
            {
                $unwind: "$badgeDetails",
            },
            // 4️⃣ Only needed fields
            {
                $project: {
                    _id: 0,
                    courseCompliteDate: 1,
                    badge: "$badgeDetails",
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "User badges retrieved successfully",
            data: badges,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get user badges",
            error,
        });
    }
};
const getAllBadgesByAdmin = (0, catchAsync_1.default)(async (req, res, next) => {
    // total badges
    const totalBadges = await badges_model_1.Badges.countDocuments();
    // 1️⃣ Badge details + koy jon user paise
    const allBadges = await badges_model_1.Badges.aggregate([
        {
            $lookup: {
                from: "complitedcourses",
                localField: "_id",
                foreignField: "badgesId",
                as: "earnedBy",
            },
        },
        {
            $addFields: {
                earnedCount: { $size: "$earnedBy" },
            },
        },
        {
            $project: {
                earnedBy: 0,
            },
        },
    ]);
    // 2️⃣ Top 10 users → sob theke beshi badge paise
    const topBadgeUsers = await complited_course_model_1.ComplitedCourse.aggregate([
        {
            $group: {
                _id: "$userId",
                totalBadges: { $sum: 1 },
            },
        },
        { $sort: { totalBadges: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 0,
                userId: "$user._id",
                name: "$user.name",
                email: "$user.email",
                totalBadges: 1,
            },
        },
    ]);
    // 3️⃣ 🔥 Badge-wise user count (summary only)
    const badgeUserCounts = await complited_course_model_1.ComplitedCourse.aggregate([
        {
            $group: {
                _id: "$badgesId",
                totalUsers: { $addToSet: "$userId" },
            },
        },
        {
            $project: {
                totalUsers: { $size: "$totalUsers" },
            },
        },
        {
            $lookup: {
                from: "badges",
                localField: "_id",
                foreignField: "_id",
                as: "badge",
            },
        },
        { $unwind: "$badge" },
        {
            $project: {
                _id: 0,
                badgeId: "$badge._id",
                badgeTitle: "$badge.title",
                userCount: "$totalUsers",
            },
        },
    ]);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Badges statistics retrieved successfully",
        data: {
            totalBadges, // মোট কয়টা badge
            allBadges, // badge details + earnedCount
            badgeUserCounts, // 🔥 kon badge koy jon paise
            topBadgeUsers, // 🔥 top 10 users
        },
    });
});
const updatebadges = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!id) {
        return next(new AppError_1.default(400, "Badge id is required"));
    }
    const updateData = {};
    if (name) {
        updateData.name = name;
    }
    if (req.file) {
        updateData.logo = req.file.path;
    }
    if (!name && !req.file) {
        return next(new AppError_1.default(400, "Nothing to update (name or logo required)"));
    }
    const updatedBadge = await badges_model_1.Badges.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!updatedBadge) {
        return next(new AppError_1.default(404, "Badge not found"));
    }
    res.status(200).json({
        success: true,
        message: "Badge name/logo updated successfully",
        data: updatedBadge,
    });
});
const getUserBadgesAndLockedBadges = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.authUser.userId;
    const result = await badges_services_1.badgesServices.getUserBadgesStatus(userId);
    const user = await user_model_1.User.findById(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User badges retrived successfully",
        data: {
            totalPoient: user?.totalPoints,
            ...result,
        }
    });
});
exports.badgesController = {
    getUserBadges,
    getAllBadgesByAdmin,
    updatebadges,
    getUserBadgesAndLockedBadges
};
//# sourceMappingURL=badges.controller.js.map