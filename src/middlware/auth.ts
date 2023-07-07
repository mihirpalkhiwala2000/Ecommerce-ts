import * as jwt from "jsonwebtoken";
import User from "../modules/users/user-models";
import constants from "../constant";
const { errorMsgs, statusCodes } = constants;
const { unauthorized, superadminError, adminError } = errorMsgs;

import { Request, Response, NextFunction } from "express";
import { RoleEnum } from "../modules/users/enums";
import { sendResponse } from "../utils/resUtil";

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<undefined> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") as string;

    const decoded = jwt.verify(
      token,
      process.env.JWT_CODE as string
    ) as jwt.JwtPayload;

    const user = await User.findOne(
      {
        _id: decoded._id,
        "tokens.token": token,
      },
      "_id"
    );

    if (!user) {
      throw new Error();
    }
    req.body.token = token;
    req.body.user = user._id;

    next();
  } catch (e) {
    sendResponse(res, unauthorized, statusCodes.unauthorized);
  }
};

export const superAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<undefined> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") as string;

    const decoded = jwt.verify(
      token,
      process.env.JWT_CODE as string
    ) as jwt.JwtPayload;

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error(unauthorized);
    }

    if (user.role !== RoleEnum.superadmin) {
      throw new Error(superadminError);
    }
    req.body.token = token;
    req.body.user = user;
    next();
  } catch (e: any) {
    sendResponse(res, unauthorized, statusCodes.unauthorized);
  }
};

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<undefined> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") as string;

    const decoded = jwt.verify(
      token,
      process.env.JWT_CODE as string
    ) as jwt.JwtPayload;

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error(unauthorized);
    }

    if (user.role !== RoleEnum.superadmin && user.role !== RoleEnum.admin) {
      throw new Error(adminError);
    }
    req.body.token = token;
    req.body.user = user;
    next();
  } catch (e: any) {
    sendResponse(res, unauthorized, statusCodes.unauthorized);
  }
};
