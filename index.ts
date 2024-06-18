import "dotenv/config";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { sign, Secret, verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { check, matchedData, query, validationResult } from "express-validator";
import { compare, hash, genSaltSync, compareSync } from "bcryptjs";
import Auth from "./middleware/auth";

const JWT_KEY = process.env.JWT_KEY as Secret;
const PORT = process.env.PORT;
const SALT = genSaltSync(10);

const app: Application = express();
const prisma = new PrismaClient();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/", Auth, (req: Request, res: Response) => {
  res.render("index", { data: req.cookies.AUTH });
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login");
});

app.post(
  "/login",
  check("username").notEmpty().escape(),
  check("password").notEmpty().escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { username, password } = matchedData(req);
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });
    if (user == null) {
      return res.status(409).json({ error: "Invalid Username/Password" });
    }
    const hashedPassword = user.password;
    const isValidLogin = compareSync(password, hashedPassword);
    if (!isValidLogin) {
      return res.status(409).json({ error: "Invalid Username/Password" });
    }
    const jwtToken = sign(
      { username: username, password: hashedPassword },
      JWT_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("AUTH", jwtToken);
    return res.redirect("/");
  }
);

app.get("/register", (req: Request, res: Response) => {
  return res.render("register");
});

app.post(
  "/register",
  check("username").notEmpty().escape(),
  check("password").notEmpty().escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { username, password } = matchedData(req);
      const userExists = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
          },
        },
      });
      if (userExists != null) {
        return res.status(409).json({ error: "Username is taken." });
      }
      const hashedPassword = await hash(password, SALT);
      const registeredResult = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      });
      const jwtToken = sign(
        { username: username, password: hashedPassword },
        JWT_KEY,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("AUTH", jwtToken);
      return res.redirect("/");
    } else {
      return res.status(400).json({ errors: result.array() });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
