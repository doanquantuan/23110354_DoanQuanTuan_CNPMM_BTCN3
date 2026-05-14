import db from "../models/index";
import bcrypt from "bcryptjs";
import generateOTP from "../utils/generateOTP.js";

import { sendOTPEmail } from "./mailService.js";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = async (password) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (e) {
    throw e;
  }
};

const handleRegister = async (data) => {
  try {
    if (!data.email || !data.email.includes("@")) {
      return {
        errCode: 1,
        message: "Email không đúng định dạng!",
      };
    }

    let userExists = await db.User.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      return {
        errCode: 2,
        message: "Email này đã được sử dụng. Hãy dùng email khác!",
      };
    }

    let hashedPassword = await hashUserPassword(data.password);

    const newUser = await db.User.create({
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      gender: data.gender === "1" ? true : false,
      roleId: 2, // Mặc định roleId = 2 (User)
      isVerified: false,
    });

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.OTP.create({
      userId: newUser.id,
      code: otp,
      expiresAt: expiresAt,
    });

    sendOTPEmail(data.email, otp);

    return {
      errCode: 0,
      message: "Mã OTP đã được gửi đến email của bạn!",
    };
  } catch (error) {
    console.error("Lỗi tại authService:", error);
    throw error;
  }
};

const verifyOTP = async (email, code) => {
  try {
    if (!email || !email.includes("@")) {
      return {
        errCode: 1,
        message: "Email không đúng định dạng!",
      };
    }

    if (!code) {
      return {
        errCode: 2,
        message: "Vui lòng nhập mã OTP!",
      };
    }

    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return {
        errCode: 3,
        message: "Email không tồn tại!",
      };
    }

    const otpRecord = await db.OTP.findOne({
      where: {
        userId: user.id,
        code,
      },
    });

    if (!otpRecord) {
      return {
        errCode: 4,
        message: "Mã OTP không chính xác!",
      };
    }

    if (otpRecord.isUsed) {
      return {
        errCode: 5,
        message: "Mã OTP đã được sử dụng!",
      };
    }

    if (new Date() > otpRecord.expiresAt) {
      return {
        errCode: 6,
        message: "Mã OTP đã hết hạn!",
      };
    }

    await db.User.update(
      {
        isVerified: true,
      },
      {
        where: { id: user.id },
      },
    );

    await db.OTP.update(
      {
        isUsed: true,
      },
      {
        where: { id: otpRecord.id },
      },
    );

    return {
      errCode: 0,
      message: "Xác thực tài khoản thành công!",
    };
  } catch (error) {
    console.error("Lỗi tại verifyOTP:", error);
    throw error;
  }
};

export default {
  handleRegister,
  verifyOTP,
};
