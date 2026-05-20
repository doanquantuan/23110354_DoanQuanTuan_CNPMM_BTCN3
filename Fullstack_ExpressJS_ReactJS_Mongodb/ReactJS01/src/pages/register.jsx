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
import { createUserApi, verifyRegisterOtpApi } from "../util/api";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(1); // 1: Fill form, 2: Verify OTP
  const [email, setEmail] = React.useState("");

  const onFinishRegister = async (values) => {
    const { name, email: inputEmail, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      notification.error({
        message: "ĐĂNG KÝ",
        description: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    setLoading(true);
    setEmail(inputEmail);

    const res = await createUserApi(name, inputEmail, password);
    setLoading(false);

    if (res && res.EC === 0) {
      notification.success({
        message: "ĐĂNG KÝ THÀNH CÔNG",
        description: res?.EM ?? "Mã OTP đã được gửi vào email của bạn. Vui lòng kiểm tra email!",
      });
      setStep(2);
    } else {
      notification.error({
        message: "ĐĂNG KÝ THẤT BẠI",
        description: res?.EM ?? "Đăng ký thất bại, vui lòng thử lại",
      });
    }
  };

  const onVerifyOtp = async (values) => {
    const { otp } = values;
    setLoading(true);

    const res = await verifyRegisterOtpApi(email, otp);
    setLoading(false);

    if (res && res.EC === 0) {
      notification.success({
        message: "XÁC THỰC THÀNH CÔNG",
        description: res?.EM ?? "Đăng ký tài khoản thành công! Đang chuyển hướng...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      notification.error({
        message: "XÁC THỰC THẤT BẠI",
        description: res?.EM ?? "Mã OTP không chính xác hoặc đã hết hạn",
      });
    }
  };

  return (
    <Spin spinning={loading}>
      <Row justify={"center"} style={{ marginTop: "30px" }}>
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
            <legend
              style={{
                fontSize: "20px",
                fontWeight: "600",
                padding: "0 10px",
                color: "#52c41a",
              }}
            >
              Đăng ký tài khoản
            </legend>

            {step === 1 ? (
              <Form
                name="basic"
                onFinish={onFinishRegister}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Họ tên"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên của bạn!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Nhập họ và tên của bạn"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Nhập email đăng ký"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Nhập lại mật khẩu để xác nhận"
                    size="large"
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: "24px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    style={{
                      borderRadius: "4px",
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                  >
                    Đăng ký thành viên
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  Mã xác thực OTP đăng ký đã được gửi đến email: <br />
                  <strong style={{ color: "#52c41a" }}>{email}</strong>
                </p>
                <p
                  style={{
                    marginBottom: "20px",
                    color: "#fa8c16",
                    fontWeight: "500",
                  }}
                >
                  Vui lòng nhập mã OTP 6 chữ số từ email của bạn để hoàn tất việc kích hoạt tài khoản.
                </p>
                <Form
                  name="verify-register-otp"
                  onFinish={onVerifyOtp}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    label="Mã OTP xác thực (6 chữ số)"
                    name="otp"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã OTP!" },
                      { len: 6, message: "Mã OTP phải có đúng 6 chữ số!" },
                    ]}
                  >
                    <Input
                      prefix={<KeyOutlined style={{ color: "#bfbfbf" }} />}
                      placeholder="Nhập 6 chữ số OTP"
                      size="large"
                      maxLength={6}
                      style={{
                        letterSpacing: "2px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginTop: "24px" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      style={{
                        borderRadius: "4px",
                        backgroundColor: "#52c41a",
                        borderColor: "#52c41a",
                      }}
                    >
                      Kích hoạt tài khoản
                    </Button>
                  </Form.Item>
                </Form>

                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <Button
                    type="link"
                    onClick={() => setStep(1)}
                    icon={<ArrowLeftOutlined />}
                    style={{ color: "#52c41a" }}
                  >
                    Thay đổi thông tin / Gửi lại
                  </Button>
                </div>
              </>
            )}

            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link to={"/"}>
                <ArrowLeftOutlined /> Quay lại trang chủ
              </Link>
              <div style={{ textAlign: "right" }}>
                Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
              </div>
            </div>
          </fieldset>
        </Col>
      </Row>
    </Spin>
  );
}

export default RegisterPage
