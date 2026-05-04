import AppError from "../../utils/AppError";
import { generateJwt } from "../../utils/generateJwt";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IRole, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";

const signUp = async (data: Partial<IUser>) => {
  if (!data.email || !data.password || !data.fullName) {
    throw new AppError(400, "fullName, email & password are required");
  }

  // allowed domains
  const allowedDomains = ["@gmail.com"];

  const isValidDomain = allowedDomains.some((domain) =>
    data.email!.toLowerCase().endsWith(domain),
  );

  if (!isValidDomain) {
    throw new AppError(
      400,
      "Invalid email domain. Please use a valid email address.",
    );
  }

  const existUser = await User.findOne({ email: data.email });

  if (existUser) {
    throw new AppError(400, `${data.email} already exists`);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await User.create({
    fullName: data.fullName,
    email: data.email,
    provider: "CREADIENTIAL",
    password: hashedPassword,
    phone: data.phone,
  });

  // remove password
  const { password, ...rest } = newUser.toObject();
  return rest;
};
const createEmployee = async (data: Partial<IUser>) => {
  if (!data.email || !data.password || !data.fullName) {
    throw new AppError(400, "fullName, email & password are required");
  }

  const existUser = await User.findOne({ email: data.email });

  if (existUser) {
    throw new AppError(400, `${data.email} already exists`);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await User.create({
    fullName: data.fullName,
    email: data.email,
    password: hashedPassword,
    provider: "CREADIENTIAL",
    phone: data.phone,
    role: IRole.EMPLOYEE,
  });

  // remove password
  const { password, ...rest } = newUser.toObject();
  return rest;
};

const signIn = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError(400, "Email and password must be required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(400, "Invalid email");
  }

  if (user.provider === "MICROSOFT")
    throw new AppError(
      400,
      "Please login with microsoft. You are not creadiential user",
    );

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(400, "Invalid password");
  }

  const tokens = await generateJwt(user);

  user.lastLogin = new Date();
  await user.save();

  const { password: pass, ...rest } = user.toObject();

  return {
    tokens: tokens,
    user: rest,
  };
};

const getAllUser = async (query: Record<string, string>) => {
  // base query
  const userQuery = User.find();

  // QueryBuilder use
  const queryBuilder = new QueryBuilder(userQuery, query)
    .filter() // filter
    .search(["phone", "email", "fullName"]) // searchable fields
    .sort() // sort
    .paginate(); // pagination

  // final data
  const result = await queryBuilder.build();

  // meta data (pagination info)
  const meta = await queryBuilder.getMeta();

  return {
    meta,
    data: result,
  };
};
const getAllEmployee = async (query: Record<string, string>) => {
  // base query
  const userQuery = User.find({ role: "EMPLOYEE" });

  // QueryBuilder use
  const queryBuilder = new QueryBuilder(userQuery, query)
    .filter() // filter
    .search(["phone", "email", "fullName"]) // searchable fields
    .sort() // sort
    .paginate(); // pagination

  // final data
  const result = await queryBuilder.build();

  // meta data (pagination info)
  const meta = await queryBuilder.getMeta();

  return {
    meta,
    data: result,
  };
};

export const UserServices = {
  signUp,
  signIn,
  getAllUser,
  getAllEmployee,
  createEmployee,
};
