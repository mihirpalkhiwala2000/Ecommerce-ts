import * as express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  deleteUserByAdmin,
  updateUser,
  validateUpdates,
  logOut,
} from "./user-controller";
import { successMsgs, errorMsgs, statusCodes } from "../../constant";
import { auth, superAdminAuth, adminAuth } from "../../middlware/auth";
import { Request, Response } from "express";
import { RoleEnum } from "./enums";
import { sendResponse } from "../../utils/resUtil";

const userRouter = express.Router();
export default userRouter;

const { successfulLogout, created, login } = successMsgs;
const { invalidFields, serverError } = errorMsgs;

userRouter.post("", async (req: Request, res: Response) => {
  try {
    req.body.role = RoleEnum.user;
    const { createdUser, token } = await createUser(req.body);
    sendResponse(
      res,
      {
        data: createdUser,
        token,
        message: created,
      },
      statusCodes.created
    );
  } catch (e: any) {
    sendResponse(res, e.message, statusCodes.badRequest);
  }
});

userRouter.post(
  "/createadmin",
  superAdminAuth,
  async (req: Request, res: Response) => {
    try {
      req.body.role = RoleEnum.admin;
      const { createdUser, token } = await createUser(req.body);

      sendResponse(
        res,
        {
          data: createUser,
          token,
          message: createdUser,
        },
        statusCodes.created
      );
    } catch (e: any) {
      sendResponse(res, e.message, statusCodes.badRequest);
    }
  }
);

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    sendResponse(
      res,
      { user: user, token, message: login },
      statusCodes.success
    );
  } catch (error: any) {
    sendResponse(res, error.message, statusCodes.badRequest);
  }
});

userRouter.post("/logout", auth, async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    await logOut(user);
    sendResponse(res, successfulLogout, statusCodes.success);
  } catch (e) {
    sendResponse(res, serverError, statusCodes.serverError);
  }
});

userRouter.get("/me", auth, async (req, res) => {
  const { user } = req.body;
  serverError;
  sendResponse(res, { data: user }, statusCodes.success);
});

userRouter.patch("/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body.data);
    const isValidOperation = await validateUpdates(updates);

    if (!isValidOperation) {
      sendResponse(res, invalidFields, statusCodes.badRequest);
    }
    const { user } = req.body;

    const retuser = await updateUser(user, req.body.data);
    sendResponse(res, { data: retuser }, statusCodes.success);
  } catch (e: any) {
    sendResponse(res, e.message, statusCodes.badRequest);
  }
});

userRouter.delete("/me", auth, async (req, res) => {
  try {
    const { user } = req.body;
    await deleteUser(user._id);
    sendResponse(res, { data: user }, statusCodes.success);
  } catch (e) {
    sendResponse(res, serverError, statusCodes.badRequest);
  }
});

userRouter.delete("/deleteuser", superAdminAuth, async (req, res) => {
  try {
    const { email, _id } = req.body;
    const deletedUser = await deleteUserByAdmin(email);
    sendResponse(res, { data: deletedUser }, statusCodes.success);
  } catch (e: any) {
    sendResponse(res, e.message, statusCodes.serverError);
  }
});
