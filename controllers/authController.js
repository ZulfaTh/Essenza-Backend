import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/UserModel.js";
import transporter from "../config/nodemailer.js";

//Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      // if user exists but is not verified, allow OTP sending instead
      if (!existingUser.isAccountVerified) {
        return res.json({
          success: true,
          message: "User exists but not verified",
          userId: existingUser._id,
        });
      }
      return res.json({ success: false, message: "User already exists" });
    }

    //encrpyt the  passwprd using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user and save to db
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    //generate token using jwt
    //whenever new user created therie will be a field called _id,we are using it to genretate token
    //create  secret ket in .env -add it
    //add expiresIn
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //after genrating the token we hvae to send this token to users in the response and response will add cookies.so using the cookie we will send this token

    //name and value,object
    res.cookie("token", token, {
      httpOnly: true, //only http requeast can access this cookie
      secure: process.env.NODE_ENV === "production", //if the environment is production,it will be true .so the will be https,if it si development/local server will be htttp
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //if it is live server can have same port
      maxAge: 7 * 24 * 60 * 60 * 1000, //expiry time in msec
    });

    //sending Welcome Email!! (just to send email)
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Salon Essenza",
      text: `Welcome to Salon Essenza Website! Your account has been created wth the email ID: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Login
export const login = async (req, res) => {
  const { email, password } = req.body; //we need email and pw onl for login

  //check whether missing any field to login
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  //if we have the email and pw this block will work
  try {
    //we have to find user with email we get from req.body
    const user = await userModel.findOne({ email });

    //if cant find email
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    //suppose user exist in db,we have to check pw against user given password->db pw.if those match,isMarch will be true
    const isMatch = await bcrypt.compare(password, user.password);

    //if pw not matched
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    //if pw matching
    //user also exists
    //this line will be executed by genreating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //user successfully logged in
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Send verification OTP to the user's Email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    //we have isAccverified property in userzmodel ,if ir=ts true user already verified
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already verified" });
    }

    //if user not verified we have to send OTP.for that we use math.random
    const otp = String(Math.floor(100000 + Math.random() * 900000)); //this will create random 6 digit otp

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification OTP sent on Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//verify user via OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified Successfully!!!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//check user authenticated(loggedin or not)
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User Logged In" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password  is ${otp}. Use this OTP to proceed with resetting your password`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent to your Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Reset User Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and New Password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
