"use client";
import React, { useState } from "react";
import CenterModal from "../global/CenterModal";
import { Formik } from "formik";
import InputField from "../global/InputField";
import * as Yup from "yup";
import api, { endPoints } from "@/utils/api";
import notify from "@/utils/notify";
import { clientCookieManager } from "@/utils/cookie-manager";
import { cookies_keys } from "@/constants";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import useLoader from "@/hooks/useLoader";

const LoginModal = () => {
  const [modal, setModal] = useState("none");
  const { loading, setLoading } = useLoader();

  const { user } = useUserContext();

  const setUser = (userToken: string) => {
    clientCookieManager.set(cookies_keys.USER_TOKEN, userToken, 7);
    window.location.reload();
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    if (loading) return;
    setLoading("Logging in...");
    const payload: Api_LOGIN_payload = {
      identifier: values.email,
      password: values.password,
    };

    const response = await api.post<Api_LOGIN_response>(endPoints.LOGIN, payload);

    setLoading("");
    if (!response.success) {
      notify.error(response.error);
      return;
    }

    notify.success("Logged in successfully");
    setUser(response.data.jwt);
  };

  const handleSignup = async (values: { email: string; password: string; username: string }) => {
    if (loading) return;
    setLoading("Signing up...");
    const payload: Api_SIGNUP_payload = {
      email: values.email,
      password: values.password,
      username: values.username,
    };
    const response = await api.post(endPoints.REGISTER, payload);

    setLoading("");
    if (!response.success) {
      notify.error(response.error);
      return;
    }

    notify.success("Signed up successfully");
    handleLogin({ email: values.email, password: values.password });
  };

  if (user?.id) {
    return <div>@{user.username}</div>;
  }

  return (
    <>
      <button
        onClick={() => {
          setModal("login");
        }}
        className="w-full bg-primary text-white rounded-md font-medium py-2 mt-4"
      >
        Log in
      </button>
      {/* Login Modal */}
      <CenterModal
        isOpen={modal === "login"}
        setOpen={() => {
          setModal("none");
        }}
      >
        <div className="bg-app-gray-2 py-5 p-4 rounded-md w-96">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-15">
              <img src="/images/tiktok-logo.svg" className="w-[140px]" alt="TikTok Logo" />
            </div>
          </div>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email().required("*Required"),
              password: Yup.string().min(6).required("*Required"),
            })}
            onSubmit={handleLogin}
          >
            {({ handleSubmit, handleBlur, values, handleChange, errors, touched }) => (
              <form className="mt-4" onSubmit={handleSubmit}>
                <InputField
                  label="Email"
                  name="email"
                  placeholder="any@mail.com"
                  value={values.email}
                  onChange={handleChange}
                  handleBlur={handleBlur}
                  fieldProps={{
                    type: "email",
                  }}
                  error={errors.email && touched.email ? errors.email : ""}
                />
                <InputField
                  label="Password"
                  fieldProps={{
                    type: "password",
                    onChange: handleChange,
                    value: values.password,
                    placeholder: "Password",
                    name: "password",
                    onBlur: handleBlur,
                  }}
                  error={errors.password && touched.password ? errors.password : ""}
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-opacity-55 rounded-md font-medium py-2 mt-4"
                >
                  Log in
                </button>
              </form>
            )}
          </Formik>
          <div className="w-full items-center flex justify-center">
            <p className="mt-5 text-xs text-app-gray font-bold ">Don't have a account?</p>
            <p
              onClick={() => {
                setModal("signup");
              }}
              className="mt-5 text-xs text-primary font-bold ml-1 cursor-pointer hover:underline"
            >
              Sign up
            </p>
          </div>
        </div>
      </CenterModal>

      {/* Signup Modal */}
      <CenterModal
        isOpen={modal === "signup"}
        setOpen={() => {
          setModal("none");
        }}
      >
        <div className="bg-app-gray-2 py-5 p-4 rounded-md w-96">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-15">
              <img src="/images/tiktok-logo.svg" className="w-[140px]" alt="TikTok Logo" />
            </div>
          </div>
          <Formik
            initialValues={{
              email: "",
              username: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={handleSignup}
            validationSchema={Yup.object().shape({
              email: Yup.string().email().required("*Required"),
              password: Yup.string().min(6).required("*Required"),
              username: Yup.string().required("*Required"),
              confirmPassword: Yup.string().oneOf([Yup.ref("password"), ""], "Passwords must match"),
            })}
          >
            {({ handleSubmit, values, errors, touched, handleBlur, handleChange }) => (
              <form className="mt-4" onSubmit={handleSubmit}>
                <InputField
                  label="Email"
                  name="email"
                  fieldProps={{
                    type: "email",
                  }}
                  placeholder="any@mail.com"
                  value={values.email}
                  onChange={handleChange}
                  handleBlur={handleBlur}
                  error={errors.email && touched.email ? errors.email : ""}
                />
                <InputField
                  fieldProps={{
                    type: "text",
                  }}
                  label="Username"
                  name="username"
                  placeholder="zaryan"
                  value={values.username}
                  onChange={handleChange}
                  handleBlur={handleBlur}
                  error={errors.username && touched.username ? errors.username : ""}
                />
                <InputField
                  fieldProps={{
                    type: "password",
                  }}
                  label="Password"
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  handleBlur={handleBlur}
                  error={errors.password && touched.password ? errors.password : ""}
                />
                <InputField
                  fieldProps={{
                    type: "password",
                  }}
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  handleBlur={handleBlur}
                  error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ""}
                />

                <button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-opacity-55 rounded-md font-medium py-2 mt-4"
                >
                  Sign Up
                </button>
              </form>
            )}
          </Formik>
          <div className="w-full items-center flex justify-center">
            <p className="mt-5 text-xs text-app-gray font-bold ">Already have a account?</p>
            <p
              onClick={() => {
                setModal("login");
              }}
              className="mt-5 text-xs text-primary font-bold ml-1 cursor-pointer hover:underline"
            >
              Log in
            </p>
          </div>
        </div>
      </CenterModal>
    </>
  );
};

export default LoginModal;
