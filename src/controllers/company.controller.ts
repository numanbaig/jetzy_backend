import { Company } from '../models/company.model.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { sendNewCompanyEmail } from '../utils/mailer.ts';

import * as path from "path";
import * as fs from "fs";

export const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({ user_id: req.user._id });
  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies
  });
});



export const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({
    _id: req.params.id,
    user_id: req.user._id
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      error: 'Company not found'
    });
  }

  res.status(200).json({
    success: true,
    data: company
  });
});



export const createCompany = asyncHandler(async (req, res) => {
  const { name, email, website } = req.body;

  // Validate required fields
  if (!name || !email) {
    // Clean up uploaded file if validation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({
      success: false,
      error: "Name and email are required",
    });
  }

  const existingCompany = await Company.findOne({ email });
  if (existingCompany) {
    // Clean up uploaded file if email already exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({
      success: false,
      error: "Email already exists in our system",
    });
  }

  let logoPath;
  if (req.file) {
    // Multer has already saved the file with the correct name
    logoPath = `company_logos/${req.file.filename}`;
  }

  const company = await Company.create({
    name,
    email,
    website,
    logo: logoPath,
    user_id: req.user._id,
  });

  try {
    await sendNewCompanyEmail({
      companyName: company.name,
      email: company.email,
      website: company.website,
    });
  } catch (emailError) {
    console.error("Failed to send welcome email:", emailError);
  }

  res.status(201).json({
    success: true,
    data: company,
  });
});

export const updateCompany = asyncHandler(async (req, res) => {
  let company = await Company.findOne({
    _id: req.params.id,
    user_id: req.user._id
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      error: 'Company not found'
    });
  }

  const updateData = { ...req.body };

  // Handle logo upload
  if (req.file) {
    // Delete old logo file if it exists
    if (company.logo) {
      const oldLogoPath = path.join("public", company.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }
    
    // Set new logo path
    updateData.logo = `company_logos/${req.file.filename}`;
  }

  company = await Company.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: company
  });
});



export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      error: "Company not found",
    });
  }

  // Delete logo file if it exists
  if (company.logo) {
    const logoFullPath = path.join("public", company.logo);
    if (fs.existsSync(logoFullPath)) {
      fs.unlinkSync(logoFullPath);
    }
  }

  await company.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});