const express = require("express");
const zod = require("zod");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const app = express();
app.use(express.json());
const router = express.Router();

const signUpSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signUpSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  try {
    const existingUser = await User.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken/ Incorrect inputs",
      });
    }
  } catch (err) {
    console.log(err);
  }

  const dbUser = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });
  const userId = dbUser._id;
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET
  );
  res.json({
    message: "User created successfully!",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post(
  "/signin",
  asyncHandler(async (req, res) => {
    const { success, data } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect input format",
      });
    }

    const { username, password } = data;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: "Incorrect password",
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
        },
        JWT_SECRET
      );

      res.json({
        message: "Sign-in successful!",
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  })
);

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  if (req.body.password) {
    const saltRounds = 10;
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  }
  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

 
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

router.get("/info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Only send necessary user information (omit sensitive data like password)
    const { username, firstName, lastName } = user;
    res.json({ username, firstName, lastName });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
