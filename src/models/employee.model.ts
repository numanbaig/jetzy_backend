import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

export const Employee = mongoose.model("Employee", employeeSchema);