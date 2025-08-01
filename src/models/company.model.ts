import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  logo: {
    type: String 
  },
  website: {
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

export const Company = mongoose.model("Company", companySchema);