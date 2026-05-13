import React, { useState } from "react";
import { notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { createUserApi } from "../util/api";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await createUserApi(email, password);

      if (res) {
        notification.success({
          message: "CREATE USER",
          description: "Register successfully",
        });

        navigate("/login");
      }
    } catch (err) {
      setError("Register failed");

      notification.error({
        message: "CREATE USER",
        description: "Register failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        px-4
      "
    >
      <Card>
        {/* Title */}
        <h1
          className="
            text-3xl
            font-bold
            text-center
            mb-6
          "
        >
          Register
        </h1>

        {/* Error Alert */}
        {error && <Alert message={error} type="error" />}

        {/* Form */}
        <form onSubmit={onFinish} className="space-y-5">
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
          />

          {/* Button */}
          {loading ? <Spinner /> : <Button>Register</Button>}
        </form>

        {/* Back Home */}
        <div className="mt-5">
          <Link
            to="/"
            className="
              text-blue-500
              hover:text-blue-600
            "
          >
            <ArrowLeftOutlined /> Back to Home
          </Link>
        </div>

        {/* Divider */}
        <div
          className="
            my-6
            border-t
            border-gray-300
          "
        ></div>

        {/* Login */}
        <div
          className="
            text-center
            text-gray-600
          "
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              text-blue-500
              hover:text-blue-600
              font-medium
            "
          >
            Login here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
