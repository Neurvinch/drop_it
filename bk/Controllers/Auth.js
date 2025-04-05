// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { doHash, doHashValidation, hmacProcess } = require('../utils/hashing'); // Adjust path as needed
const UserModel = require('../Models/UserSchema'); // Adjust path as needed
const nodemailer = require('nodemailer'); // Assuming transport is from nodemailer
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, email, roles } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username }); // Fixed from rollNo
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await doHash(password, 12);
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
      roles,
    });
    const savedUser = await newUser.save();
    const userWithoutPassword = savedUser.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      message: 'User saved successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email }).select('+password');
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isPasswordValid = await doHashValidation(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id, username: existingUser.username, roles: existingUser.roles }, // Fixed from rollNo
      process.env.SECRET_KEY,
      { expiresIn: '5h' }
    );

    res.cookie('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000), // 1 hour
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Sign out a user
router.post('/signout', (req, res) => {
  res.clearCookie('Authorization');
  res.status(200).json({
    success: true,
    message: 'User signed out successfully',
  });
});

// Change password
router.put('/change-password', async (req, res) => {
  const { username } = req.user; // From auth middleware
  const { oldPassword, newPassword } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username }).select('+password');
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isValid = await doHashValidation(oldPassword, existingUser.password);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid old password',
      });
    }

    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Send forgot password code
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'naveenpandian68@gmail.com', pass: process.env.EMAIL_PASS },
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString();
    const info = await transport.sendMail({
      from: 'naveenpandian68@gmail.com',
      to: existingUser.email,
      subject: 'Password Reset Code',
      html: `<h1>${codeValue}</h1>`,
    });

    if (info.accepted[0] === existingUser.email) {
      const hashedCodeValue = hmacProcess(codeValue, '123456');
      existingUser.forgotPasswordCode = hashedCodeValue;
      existingUser.forgotPasswordCodeValidation = Date.now();
      await existingUser.save();

      res.status(200).json({
        success: true,
        message: 'Code sent successfully',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Verify forgot password code and reset password
router.post('/verify-forgot-password', async (req, res) => {
  const { email, providedCode, newPassword } = req.body;

  try {
    const code = providedCode.toString();
    const existingUser = await UserModel.findOne({ email }).select('+forgotPasswordCode +forgotPasswordCodeValidation');
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
      return res.status(400).json({
        success: false,
        message: 'Code not sent',
      });
    }

    if (Date.now() - existingUser.forgotPasswordCodeValidation > 10 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: 'Code expired',
      });
    }

    const hashedValue = hmacProcess(code, '123456');
    if (hashedValue !== existingUser.forgotPasswordCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid code',
      });
    }

    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    existingUser.forgotPasswordCode = undefined;
    existingUser.forgotPasswordCodeValidation = undefined;
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

module.exports = router;