import "dotenv/config";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { sign, Secret, verify } from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY! as Secret;
const SESSION_KEY = process.env.SESSION_KEY!;

const app: Application = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login");
});

app.post("/login", (req: Request, res: Response) => {});

app.get("/register", (req: Request, res: Response) => {
  res.render("register");
});

app.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body;
  // Verify input
  // Check if username is not taken.
  const jwtToken = sign({ username: username, password: password }, JWT_KEY, {
    expiresIn: "7d",
  });
  res.cookie("AUTH", jwtToken);
  res.json({ token: jwtToken });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// if (!req.cookies.AUTH) {
//   const jwtToken = sign({ user: "aaron" }, JWT_KEY, {
//     expiresIn: 60 * 60,
//   });
//   res.cookie("AUTH", jwtToken)
//   res.json({ token: jwtToken });
// } else {
//   console.table(req.cookies)
//   const authCookie = req.cookies.AUTH;
//   const authData = verify(authCookie, JWT_KEY);
//   res.json(authData);
// }
