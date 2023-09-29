const Auth = require("../../models/auth/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingEmail = await Auth.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const securePassword = await bcrypt.hash(password, 10);
    const user = await Auth.create({
      name,
      email,
      password: securePassword,
    });

    if (user) {
      const payload = {
        userId: user.id,
      };
      const data = { ...user.toObject() };
      delete data.password;
      return res.status(200).json({
        token: jwt.sign(payload, process.env.JWT_SECRET),
        success: true,
        message: "User registered successfully",
        data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required",
      });
    }

    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const payload = {
      userId: user.id,
    };

    return res.status(200).json({
      token: jwt.sign(payload, process.env.JWT_SECRET),
      success: true,
      message: "User login successful",
      data: user.toObject(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkauth = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await Auth.findById(userId).select("-password");
    const payload = {
      userId: user.id,
    };

    return res.status(201).json({
      token: jwt.sign(payload, process.env.JWT_SECRET),
      success: true,
      message: "user data fetched successfully",
      data: user.toObject(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  checkauth,
};



