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
      firstName: data.firstName,
      lastName: data.lastName,
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
  const user = await db.User.findOne({
    where: { email },
  });

  const otpRecord = await db.OTP.findOne({
    where: {
      userId: user.id,
      code,
    },
  });

  if (!otpRecord) {
    throw new Error("Invalid OTP");
  }

  if (new Date() > otpRecord.expiresAt) {
    throw new Error("OTP expired");
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

  // await db.OTP.destroy({
  //   where: { userId: user.id },
  // });

  return {
    message: "Verify account successfully",
  };
};

export default {
  handleRegister,
  verifyOTP,
};
