import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = {
    name,
    email,
    password,
  };

  return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = {
    email,
    password,
  };

  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get(URL_API);
};

const forgotPasswordApi = (email) => {
  const URL_API = "/v1/api/forgot-password";
  const data = {
    email,
  };

  return axios.post(URL_API, data);
};

const verifyOtpApi = (email, otp) => {
  const URL_API = "/v1/api/verify-otp";
  const data = {
    email,
    otp,
  };

  return axios.post(URL_API, data);
};

const resetPasswordApi = (email, token, password) => {
  const URL_API = "/v1/api/reset-password";
  const data = {
    email,
    token,
    password,
  };

  return axios.post(URL_API, data);
};

const verifyRegisterOtpApi = (email, otp) => {
  const URL_API = "/v1/api/verify-register-otp";
  const data = {
    email,
    otp,
  };

  return axios.post(URL_API, data);
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
  verifyRegisterOtpApi,
};
