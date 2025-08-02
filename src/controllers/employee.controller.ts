import { Employee } from '../models/employee.model.ts';
import { Company } from '../models/company.model.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';



export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({ user_id: req.user._id }).populate('company_id', 'name');
  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees
  });
});


export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.id,
    user_id: req.user._id
  }).populate('company_id', 'name');

  if (!employee) {
    return res.status(404).json({
      success: false,
      error: 'Employee not found'
    });
  }

  res.status(200).json({
    success: true,
    data: employee
  });
});


export const createEmployee = asyncHandler(async (req, res) => {
  const { first_name, last_name, company_id, email, phone } = req.body;

  console.log(req.body);
  const company = await Company.findOne({
    _id: company_id,
    user_id: req.user._id
  });

  if (email) {
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error: "Email already exists in our system"
      });
    }
  }
  if (!company) {
    return res.status(400).json({
      success: false,
      error: 'Company not found or unauthorized'
    });
  }


  const employee = await Employee.create({
    first_name,
    last_name,
    company_id,
    email,
    phone,
    user_id: req.user._id
  });

  res.status(201).json({
    success: true,
    data: employee
  });
});


export const updateEmployee = asyncHandler(async (req, res) => {
  let employee = await Employee.findOne({
    _id: req.params.id,
    user_id: req.user._id
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      error: 'Employee not found'
    });
  }

  if (req.body.company_id) {
    const company = await Company.findOne({
      _id: req.body.company_id,
      user_id: req.user._id
    });
    if (!company) {
      return res.status(400).json({
        success: false,
        error: 'Company not found or unauthorized'
      });
    }
  }

  employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: employee
  });
});


export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    _id: req.params.id,
    user_id: req.user._id
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      error: 'Employee not found'
    });
  }

  await employee.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});