import bcrypt from "bcrypt";
import User from "../model/UserSchema.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv"
dotenv.config();
/*
 *Register a new user
 *validate if the user exist
 *@param username-username of the user
 *@param password-hash encrypted password
 */
class AuthController {
  constructor() {
    (this.jwtsecret = process.env.JWTTOKEN || "projecttool123$"),
      (this.transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADMIN,
          pass: process.env.PASS_ADMIN,
        },
      }));
  }
  register = async (req, res) => {
    const { email, password } = req.body;
    console.log('Registration attempt for:', email);
    
    try {
      console.log('Checking if user exists...');
      const exists_user = await User.findOne({ email });
      if (exists_user) {
        console.log('User already exists');
        return res.status(400).json({ msg: "User already exist" });
      }
      
      console.log('Hashing password...');
      const hash_pass = await bcrypt.hash(password, 10);
      
      console.log('Creating new user...');
      const user = new User({ email, password: hash_pass, verified: false });
      
      console.log('Saving user to database...');
      await user.save();
      console.log('User saved successfully:', user._id);
      
      try {
        if (process.env.EMAIL_ADMIN && process.env.PASS_ADMIN && process.env.CLIENT_URL) {
          console.log('Sending verification email...');
          const token = jwt.sign({ id: user._id }, this.jwtsecret, {
            expiresIn: "1d",
          });
          const verify_url = `${process.env.CLIENT_URL}/verify-email/${token}`;
          await this.transport.sendMail({
            from: process.env.EMAIL_ADMIN,
            to: email,
            subject: "Verify Your Email",
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for signing up! Please click the button below to verify your email address.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verify_url}" 
               style="display: inline-block; 
                      background-color: #007bff; 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              Verify Email Address
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${verify_url}" style="color: #007bff;">${verify_url}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent automatically. Please do not reply to this email.
          </p>
        </div>`,
          });
          
          console.log('Email sent successfully');
          res.status(201).json({
            msg: "Registered Successfully, Verification mail has been sent successfully",
            userId: user._id
          });
        } else {
          console.log('Email not configured, skipping email verification');
          res.status(201).json({
            msg: "Registered Successfully (Email verification not configured)",
            userId: user._id
          });
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        res.status(201).json({
          msg: "Registered Successfully (Email verification failed)",
          userId: user._id
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error stack:', err.stack);
      res.status(500).json({ msg: "Oops something went wrong", error: err.message });
    }
  };

  /*
   *verifies the email of the user
   *@params token-for the token
   */
  verify_email = async (req, res) => {
    const { token } = req.params;
    try {
      const decoded = jwt.verify(token, this.jwtsecret);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ msg: "User not found" });
      user.verified = true;
      await user.save();
      const filePath = path.join(process.cwd(), "public", "email-verified.html");
      return res.sendFile(filePath);
    } catch (err) {
      console.error('Verify email error:', err);
      res.status(500).json({ msg: "Oops something went wrong", error: err.message });
    }
  };
  /*
   *Handles the login of the user
   *validates if the user doesnt exists
   *@param username-username of the user
   *@param password-hash encrypted password
   */
  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const exists_user = await User.findOne({ email });
      if (!exists_user || !(await bcrypt.compare(password, exists_user.password)))
        return res.status(400).json({ msg: "Invalid User credentials" });
      if (!exists_user.verified)
        return res.status(400).json({ msg: "Email is not verified" });
      const accesstoken = jwt.sign({ id: exists_user._id }, this.jwtsecret, {
        expiresIn: "30m",
      });
      res.status(200).json({ msg: "Logged in successfully.", accesstoken });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ msg: "Oops something went wrong", error: err.message });
    }
  };

  /*
   *get user details by id from the database
   */
  getUserByID = async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Getting user by ID:', id);
      
      const user = await User.findById(id).select("-password");
      console.log('User found:', user);
      
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ msg: "User not Found!" });
      }
      
      res.status(200).json(user);
    } catch (err) {
      console.error('GetUserByID error:', err);
      console.error('Error stack:', err.stack);
      res.status(500).json({ msg: "Oops something went wrong", error: err.message });
    }
  };
  logout = (req, res) => {
    res.status(200).json({ msg: "Logout successful (client clears token)" });
  };
}
export default new AuthController();
