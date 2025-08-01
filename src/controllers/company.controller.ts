import { Company } from '../models/company.model.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';
const fs = 'fs';
const path = 'path';


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
  const logoPath = req.file?.path;

  // Check if email already exists
  const existingCompany = await Company.findOne({ email });
  if (existingCompany) {
    return res.status(400).json({
      success: false,
      error: "Email already exists in our system"
    });
  }
  const company = await Company.create({
    name,
    email,
    website,
    logo: logoPath,
    user_id: req.user._id
  });

  res.status(201).json({
    success: true,
    data: company
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

  // if (req.file) {
  //   if (company.logo) {
  //     const oldLogoPath = path.join(__dirname, '..', company.logo);
  //     if (fs.existsSync(oldLogoPath)) {
  //       fs.unlinkSync(oldLogoPath);
  //     }
  //   }
  //   req.body.logo = req.file.path;
  // }

  company = await Company.findByIdAndUpdate(req.params.id, req.body, {
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
    user_id: req.user._id
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      error: 'Company not found'
    });
  }

  // if (company.logo) {
  //   const logoPath = path.join(__dirname, '..', company.logo);
  //   if (fs.existsSync(logoPath)) {
  //     fs.unlinkSync(logoPath);
  //   }
  // }

  await company.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});