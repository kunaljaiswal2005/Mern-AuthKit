import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'
import transporter from '../config/nodemailer.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';


export const register = async (req, res, next) => {
    const { name, email, password } = req.body

    // Validate required fields
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            throw new ApiError(409, "User already exists",)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = new userModel({ name, email, password: hashedPassword })

        await user.save();

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        // Send token via cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        //Send welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome user',
            text: `welcome here your account has been created with email id : ${email} `
        }

        await transporter.sendMail(mailOptions)

        //Success response
        return res.status(201).json(
            new ApiResponse(201, { user }, "User registered successfully")
        )
    } catch (error) {
        return next(new ApiError(500, error.message))

    }
}


export const login = async (req, res, next) => {
    const { email, password } = req.body

    //Validate Fields
    if (!email || !password) {
        return next(new ApiError(400, "Email and password are required"))
    }
    try {
        //Find User
        const user = await userModel.findOne({ email })
        if (!user) {
            return next(new ApiError(404, "user doesn't exist "))
        }

        //Validate Email
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return next(new ApiError(401, "Invalid password"))
        }

        //Create Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        //Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,

        })

        //Success response
        return res
            .status(200)
            .json(new ApiResponse(200, { user }, "Login successful"))

    } catch (error) {
        return next(new ApiError(500, error.message))
    }
}

export const logout = async (req, res, next) => {
    try {
        //Clear Authentication cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        })

        //Success Response
        return res.status(200).json(
            new ApiResponse(200, null, "Logged out successfully")
        )

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const sendVerifyOtp = async (req, res, next) => {
    try {
        const { userId } = req.body

        const user = await userModel.findById(userId)
        if (user.isAccountVerified) {
            return res.json({ success: false, message: "account already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification otp',
            // text: `Your otp is ${otp}. verify your account using this otp.`
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOption)

        return res.json({ success: true, message: 'verification otp sent on email' })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

export const verifyEmail = async (req, res, next) => {
    const { userId, otp } = req.body
    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing details" })
    }
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "invalid otp" })
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "otp expired" })
        }

        user.isAccountVerified = true;
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0
        await user.save()
        return res.json({ success: true, message: "email verified successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })

    }
}

export const isAuthenticated = async (req, res, next) => {
    try {
        return res.json({ success: true })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//send password rest otp

export const sendResetOtp = async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return res.json({ success: false, message: "email is required" })
    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "user not found" })


        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Otp',
            // text: `Your otp for resetting your password is ${otp}.use this otp to proceed with resetting your password.`
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)

        }

        await transporter.sendMail(mailOption)

        return res.json({ success: true, message: 'otp sent to your email' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
// reset user password 
export const resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "email otp and new password are required" })

    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "invalid otp" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "otp expired" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword

        user.resetOtp = ''
        user.resetOtpExpireAt = 0
        await user.save()

        return res.json({ success: true, message: "password has been reset successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}