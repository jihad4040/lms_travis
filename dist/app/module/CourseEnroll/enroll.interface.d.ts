import { Types } from "mongoose";
export declare enum IPaymentStauts {
    FREE = "FREE",
    PAID = "PAID",
    CANCEL = "CANCEL",
    UNPAID = "UNPAID"
}
export interface IEnroll {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    courseName: String;
    amount: Number;
    paymentStatus: IPaymentStauts;
}
//# sourceMappingURL=enroll.interface.d.ts.map