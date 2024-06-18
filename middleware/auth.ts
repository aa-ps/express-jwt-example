import { sign, Secret, verify } from "jsonwebtoken";
import express, { Application, NextFunction, Request, Response } from "express";

const PRIVATE_KEY = process.env.PRIVATE_KEY as Secret;

const Auth = (req: Request, res: Response, next: NextFunction) => {

    if (!req.cookies.AUTH) {
        res.redirect("/login")
    } else {
      const authCookie = req.cookies.AUTH;
      const authData = verify(authCookie, PRIVATE_KEY);
      console.log(authData);
      next();
    }

}

export default Auth;