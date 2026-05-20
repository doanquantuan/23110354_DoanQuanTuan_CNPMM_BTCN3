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
  Alert,
} from "antd";
import { resetPasswordApi } from "../util/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = React.useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const onFinish = async (values) => {
    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      notification.error({
        message: "ĐẶT LẠI MẬT KHẨU",
        description: "Mật khẩu không khớp",
      });
      return;
    }

    if (!token || !email) {
      notification.error({
        message: "ĐẶT LẠI MẬT KHẨU",
        description: "Liên kết không hợp lệ",
      });
      return;
    }

    setLoading(true);

    const res = await resetPasswordApi(email, token, password);

    setLoading(false);

    if (res && res.EC === 0) {
      notification.success({
        message: "ĐẶT LẠI MẬT KHẨU",
        description: res?.EM ?? "Mật khẩu đã được đặt lại thành công",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      notification.error({
        message: "ĐẶT LẠI MẬT KHẨU",
        description: res?.EM ?? "Đặt lại mật khẩu thất bại",
      });
    }
  };

  if (!token || !email) {
    return (
      <Row justify={"center"} style={{ marginTop: "30px" }}>
        <Col xs={24} md={16} lg={8}>
          <Alert
            message="Liên kết không hợp lệ"
            description="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu một liên kết mới."
            type="error"
            showIcon
          />
          <div style={{ marginTop: "20px" }}>
            <Link to={"/forgot-password"}>
              <ArrowLeftOutlined /> Quay lại yêu cầu đặt lại mật khẩu
            </Link>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Spin spinning={loading}>
      <Row justify={"center"} style={{ marginTop: "30px" }}>
        <Col xs={24} md={16} lg={8}>
          <fieldset
            style={{
              padding: "15px",
              margin: "15px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <legend>Đặt lại mật khẩu</legend>
            <p style={{ marginBottom: "20px", color: "#666" }}>
              Nhập mật khẩu mới cho email: <strong>{email}</strong>
            </p>
            <Form
              name="reset-password"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>
            </Form>

            <Link to={"/login"}>
              <ArrowLeftOutlined /> Quay lại đăng nhập
            </Link>
            <Divider />
            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản? <Link to={"/register"}>Đăng ký ngay</Link>
            </div>
          </fieldset>
        </Col>
      </Row>
    </Spin>
  );
};

export default ResetPasswordPage;
