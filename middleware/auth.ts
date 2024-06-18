import {
  sign,
  Secret,
  verify,
  decode,
} from "jsonwebtoken";
import express, { Application, NextFunction, Request, Response } from "express";

const JWT_KEY = process.env.JWT_KEY as Secret;

const Auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.AUTH) {
    return res.redirect("/login");
  } else {
    const authCookie = req.cookies.AUTH;
    try {
      const validAuth = verify(authCookie, JWT_KEY);
      const data = decode(authCookie);
      console.log(data);
    } catch (err) {
      console.log(err);
      return res.redirect("/login");
    }
    return next();
  }
};

export default Auth;
