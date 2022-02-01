import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    mobile: number;
  };
}

export interface userPayload {
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  mobile: number;
  password: string;
}
