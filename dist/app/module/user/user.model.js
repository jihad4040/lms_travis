"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const EarnedBadgeSchema = new mongoose_1.Schema({
    badgeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Badge", required: true },
    name: { type: String, required: true },
    earnedDate: { type: Date, default: Date.now },
    points: { type: Number, required: true },
    details: { type: String }
});
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String
    },
    phone: {
        type: String,
    },
    bio: {
        type: String,
    },
    avatarUrl: {
        type: String,
        default: null
    },
    dateOfBirth: {
        type: Date,
    },
    provider: {
        type: String,
        enum: ["CREADIENTIAL", "MICROSOFT"]
    },
    role: {
        type: String,
        enum: user_interface_1.IRole,
        default: user_interface_1.IRole.USER,
    },
    earnedBadges: {
        type: [EarnedBadgeSchema],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    enrollCourse: [
        {
            courseId: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    lastLogin: {
        type: Date,
    },
    totalPoints: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map