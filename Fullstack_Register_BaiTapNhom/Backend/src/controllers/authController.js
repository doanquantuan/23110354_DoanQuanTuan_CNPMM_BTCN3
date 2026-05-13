import authService from "../services/authService";

let handleRegister = async (req, res) => {
  try {
    // Đợi Service xử lý logic và trả về kết quả
    let result = await authService.handleRegister(req.body);

    // Trả kết quả về cho client (Postman/Trình duyệt)
    return res.status(200).json(result);
  } catch (error) {
    // Nếu Service ném lỗi (throw error), nó sẽ nhảy vào đây
    return res.status(500).json({
      errCode: -1,
      message: "Lỗi hệ thống (Internal Server Error)",
    });
  }
};

let verifyOTPController = async (req, res) => {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyOTP(email, code);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      errCode: -1,
      message: error.message || "Lỗi xác thực OTP",
    });
  }
};

export default { handleRegister, verifyOTPController };
// export default { handleRegister, verifyOTPController }; --- IGNORE ---
