const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const VerificationToken = require("../models/verificationTokenModel");
const { sendEmail } = require("../utils/mailer");
const validator = require("validator");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ user: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Extended token expiry
  });
};

// Input validation helper
const validateUserInput = (data, isLogin = false) => {
  const errors = [];

  if (!isLogin) {
    if (!data.firstName || data.firstName.trim().length < 2) {
      errors.push("First name must be at least 2 characters long");
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
      errors.push("Last name must be at least 2 characters long");
    }
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.password || data.password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  return errors;
};

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found",
        users: [],
      });
    }
    res.status(200).json({
      message: "Users retrieved successfully",
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Register user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    console.log("Registration attempt:", {
      firstName,
      lastName,
      email,
      password: password ? "***" : "undefined",
    });

    // Validate input
    const validationErrors = validateUserInput(req.body);
    if (validationErrors.length > 0) {
      console.log("Validation errors:", validationErrors);
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.log(
        "User already exists:",
        userExists.email,
        "isVerified:",
        userExists.isVerified
      );

      // Always delete existing user to allow re-registration (for testing purposes)
      console.log("Deleting existing user to allow re-registration");
      await User.deleteOne({ _id: userExists._id });
    }

    // Create new user (not verified yet)
    console.log("Creating new user...");
    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      isVerified: false,
    });
    console.log("User created successfully:", newUser.email);

    // Generate verification token
    const verificationToken = await VerificationToken.generateToken(
      newUser._id
    );

    // Send verification email
    try {
      await sendEmail({
        to: newUser.email,
        subject: "Confirmez votre compte AI-HABITS",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🤖 Bienvenue sur AI-HABITS</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Confirmez votre compte</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Bonjour ${
                newUser.firstName
              } !</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Merci de vous être inscrit sur AI-HABITS ! Pour activer votre compte et commencer à suivre vos habitudes, 
                veuillez cliquer sur le bouton ci-dessous pour confirmer votre adresse email.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                  ${verificationToken.token}
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5; text-align: center;">
                Utilisez ce code de 6 chiffres sur la page de vérification :<br>
                <a href="${
                  process.env.FRONTEND_URL || "http://localhost:5173"
                }/verify-email" 
                   style="color: #667eea;">
                  ${
                    process.env.FRONTEND_URL || "http://localhost:5173"
                  }/verify-email
                </a>
              </p>
              
              <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
                <p style="margin: 0; color: #1976d2; font-weight: bold;">⏰ Ce lien expire dans 24 heures</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              <p>Si vous n'avez pas créé de compte sur AI-HABITS, vous pouvez ignorer cet email.</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error(
        "Erreur lors de l'envoi de l'email de vérification:",
        emailError
      );
      // Ne pas faire échouer l'inscription si l'email ne peut pas être envoyé
    }

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt,
      },
      // Ne pas envoyer de token JWT tant que l'email n'est pas vérifié
    });
  } catch (error) {
    console.error("Register user error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validationErrors = validateUserInput(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        message:
          "Please verify your email before logging in. Check your inbox for a verification email.",
        needsVerification: true,
      });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "User info retrieved successfully",
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      message: "Failed to get user info",
      error: error.message,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user._id;

    // Validate input
    if (firstName && firstName.trim().length < 2) {
      return res.status(400).json({
        message: "First name must be at least 2 characters long",
      });
    }

    if (lastName && lastName.trim().length < 2) {
      return res.status(400).json({
        message: "Last name must be at least 2 characters long",
      });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already taken by another user",
        });
      }
    }

    // Update user
    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    // Verify token and get user
    const user = await VerificationToken.verifyToken(token);

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    // Update user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({
      message: "Failed to verify email",
      error: error.message,
    });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = await VerificationToken.generateToken(user._id);

    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: "Confirmez votre compte AI-HABITS",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🤖 Confirmez votre compte AI-HABITS</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Nouveau lien de vérification</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Bonjour ${
                user.firstName
              } !</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Vous avez demandé un nouveau lien de vérification. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                  ${verificationToken.token}
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5; text-align: center;">
                Utilisez ce code de 6 chiffres sur la page de vérification :<br>
                <a href="${
                  process.env.FRONTEND_URL || "http://localhost:5173"
                }/verify-email" 
                   style="color: #667eea;">
                  ${
                    process.env.FRONTEND_URL || "http://localhost:5173"
                  }/verify-email
                </a>
              </p>
              
              <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
                <p style="margin: 0; color: #1976d2; font-weight: bold;">⏰ Ce lien expire dans 24 heures</p>
              </div>
            </div>
          </div>
        `,
      });

      res.status(200).json({
        message: "Verification email sent successfully",
      });
    } catch (emailError) {
      console.error(
        "Erreur lors de l'envoi de l'email de vérification:",
        emailError
      );
      res.status(500).json({
        message: "Failed to send verification email",
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      message: "Failed to resend verification email",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  verifyEmail,
  resendVerification,
};
