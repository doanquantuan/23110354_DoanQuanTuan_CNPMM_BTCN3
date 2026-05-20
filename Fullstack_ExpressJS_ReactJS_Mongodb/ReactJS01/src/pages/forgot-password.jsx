import React from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Spin,
} from "antd";
import { forgotPasswordApi, verifyOtpApi } from "../util/api";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, KeyOutlined, MailOutlined } from "@ant-design/icons";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(1); // 1: Send OTP, 2: Verify OTP
  const [email, setEmail] = React.useState("");

  const onSendOtp = async (values) => {
    const { email: inputEmail } = values;
    setLoading(true);
    setEmail(inputEmail);

    const res = await forgotPasswordApi(inputEmail);
    setLoading(false);

    if (res && res.EC === 0) {
      notification.success({
        title: "GỬI MÃ OTP",
        description: res?.EM ?? "Mã OTP đã được gửi vào email của bạn",
      });
      setStep(2);
    } else {
      notification.error({
        title: "GỬI MÃ OTP THẤT BẠI",
        description: res?.EM ?? "Không thể gửi OTP, vui lòng thử lại",
      });
    }
  };

  const onVerifyOtp = async (values) => {
    const { otp } = values;
    setLoading(true);

    const res = await verifyOtpApi(email, otp);
    setLoading(false);

    if (res && res.EC === 0) {
      notification.success({
        title: "XÁC THỰC THÀNH CÔNG",
        description: res?.EM ?? "Mã OTP hợp lệ, đang chuyển hướng...",
      });
      setTimeout(() => {
        navigate(`/reset-password?token=${res.resetToken}&email=${email}`);
      }, 1500);
    } else {
      notification.error({
        title: "XÁC THỰC THẤT BẠI",
        description: res?.EM ?? "Mã OTP không chính xác hoặc đã hết hạn",
      });
    }
  };

  return (
    <Spin spinning={loading}>
      <Row justify={"center"} style={{ marginTop: "50px" }}>
        <Col xs={24} md={16} lg={8}>
          <fieldset
            style={{
              padding: "25px",
              margin: "15px",
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <legend style={{ fontSize: "20px", fontWeight: "600", padding: "0 10px", color: "#1890ff" }}>
              Quên mật khẩu
            </legend>

            {step === 1 ? (
              <>
                <p style={{ marginBottom: "20px", color: "#666" }}>
                  Nhập email của bạn để nhận mã OTP 6 chữ số dùng để xác minh tài khoản.
                </p>
                <Form
                  name="forgot-password"
                  onFinish={onSendOtp}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input prefix={<MailOutlined style={{ color: "#bfbfbf" }} />} placeholder="Nhập email của bạn" size="large" />
                  </Form.Item>

                  <Form.Item style={{ marginTop: "24px" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      size="large"
                      style={{ borderRadius: "4px" }}
                    >
                      Gửi mã OTP
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  Mã xác thực OTP đã được gửi đến email: <br />
                  <strong style={{ color: "#1890ff" }}>{email}</strong>
                </p>
                <p style={{ marginBottom: "20px", color: "#ffa940", fontWeight: "500" }}>
                  Vui lòng nhập mã OTP để tiếp tục đặt lại mật khẩu.
                </p>
                <Form
                  name="verify-otp"
                  onFinish={onVerifyOtp}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    label="Mã OTP (6 chữ số)"
                    name="otp"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã OTP!" },
                      { len: 6, message: "Mã OTP phải có đúng 6 chữ số!" },
                    ]}
                  >
                    <Input prefix={<KeyOutlined style={{ color: "#bfbfbf" }} />} placeholder="Nhập 6 chữ số OTP" size="large" maxLength={6} style={{ letterSpacing: "2px", textAlign: "center", fontWeight: "bold", fontSize: "18px" }} />
                  </Form.Item>

                  <Form.Item style={{ marginTop: "24px" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      size="large"
                      style={{ borderRadius: "4px" }}
                    >
                      Xác thực mã OTP
                    </Button>
                  </Form.Item>
                </Form>

                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <Button type="link" onClick={() => setStep(1)} icon={<ArrowLeftOutlined />}>
                    Thay đổi email khác
                  </Button>
                </div>
              </>
            )}

            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link to={"/login"}>
                <ArrowLeftOutlined /> Quay lại đăng nhập
              </Link>
              <Link to={"/register"}>Đăng ký ngay</Link>
            </div>
          </fieldset>
        </Col>
      </Row>
    </Spin>
  );
};

export default ForgotPasswordPage;

