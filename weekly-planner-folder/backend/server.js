const express = require("express");
const cors = require("cors");
const session = require("express-session");

const planRouter = require("./plan");
const postRouter = require("./post");
const signupRouter = require("./signup");
const loginRouter = require("./login");
const calorieRouter = require("./calorie");
//CORS is basically used for frontend and backend communication
const app = express();
const PORT = 3001; // backend runs here
//Middleware set up
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(session({
  secret: "notasecret", 
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: false, secure: false }
}));
//Router on its paths
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

// Use plan routes
app.use("/plan", planRouter);

app.use("/post", postRouter);
app.use("/calorie", calorieRouter);



//testing the server
app.get("/", (req, res) => {
  res.send("Backend server is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

