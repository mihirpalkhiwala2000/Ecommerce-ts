import { Response } from "express";

export const sendResponse = (res: Response, data: any, statusCode: number) => {
  return res.status(statusCode).send(data);
};
