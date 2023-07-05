import * as express from "express";
import User from "./user-models";
import {
  createUser,
  loginUser,
  deleteUser,
  deleteUserByAdmin,
  updateUser,
  validateUpdates,
} from "./user-controller";
import constants from "../../constant";
import { auth, superAdminAuth, adminAuth } from "../../middlware/auth";
import { Request, Response } from "express";
import { RoleEnum } from "./enums";

const userRouter = express.Router();
export default userRouter;

const { successMsgs, errorMsgs, statusCodes } = constants;
const { successfulLogout, created, login } = successMsgs;
const {
  invalidFields,
  badRequest,
  serverError,
  emailError,
  emailLoginError,
  emailusedError,
} = errorMsgs;
const { createdC, badRequestC, serverErrorC } = statusCodes;

userRouter.post("", async (req: Request, res: Response) => {
  try {
    req.body.role = RoleEnum.user;
    const { user, token } = await createUser(req.body);
    res.status(createdC).send({
      data: user,
      token,
      message: created,
    });
  } catch (e: any) {
    res.status(badRequestC).send(e.message);
  }
});

userRouter.post(
  "/createadmin",
  superAdminAuth,
  async (req: Request, res: Response) => {
    try {
      req.body.role = RoleEnum.admin;
      const { user, token } = await createUser(req.body);
      res.status(createdC).send({
        data: user,
        token,
        message: created,
      });
    } catch (e: any) {
      res.status(badRequestC).send(e.message);
    }
  }
);

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.send({ user: user, token, message: login });
  } catch (error: any) {
    console.log(
      "🚀 ~ file: user-router.ts:69 ~ userRouter.post ~ error:",
      error
    );
    res.status(badRequestC).send(error.message);
  }
});

userRouter.post("/logout", auth, async (req: Request, res: Response) => {
  try {
    const { user, token } = req.body;
    user.tokens = user.tokens.filter((tokenIn: { token: string }) => {
      return tokenIn.token !== token;
    });
    await User.create(user);

    res.send(successfulLogout);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

userRouter.get("/me", auth, async (req, res) => {
  const { user } = req.body;

  res.send({ data: user });
});

userRouter.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body.data);

  const isValidOperation = await validateUpdates(updates);

  if (!isValidOperation) {
    return res.status(badRequestC).send(invalidFields);
  }
  try {
    const { user } = req.body;

    const retuser = await updateUser(user, req.body.data);

    res.send({ data: retuser });
  } catch (e: any) {
    res.status(badRequestC).send(e.message);
  }
});

userRouter.delete("/me", auth, async (req, res) => {
  try {
    const { user } = req.body;
    await deleteUser(user._id);
    res.send({ data: user });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

userRouter.delete("/deleteuser", adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const deletedUser = await deleteUserByAdmin(email);
    res.send({ "following user deleted": deletedUser });
  } catch (e: any) {
    res.status(serverErrorC).send(e.message);
  }
});
