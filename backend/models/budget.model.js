import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    fromdate: {
      type: Date,
      required: [true, "From date is required"],
    },
    todate: {
      type: Date,
      required: [true, "To date is required"],
      validate: {
        validator: function (value) {
          return value >= this.fromdate;
        },
        message: "To date must be greater than or equal to From date",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    threshold: {
      type: Number,
      required: [true, "Threshold is required"],
      min: [0, "Threshold cannot be negative"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentSpending: {
      type: Number,
      default: 0,
      min: [0, "Current spending cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
