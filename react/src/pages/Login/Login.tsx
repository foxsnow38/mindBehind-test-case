import React, { Component } from "react";
import moduleCSS from "./Login.module.scss";
import * as yup from "yup";
import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useCompanyContext } from "../../context/PrismaContext/PrismaContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const nagivate = useNavigate();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Email is required"),
    password: yup
      .string()
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
  });

  const { getUser, setUser } = useCompanyContext();

  const checkUser = async (values: any) => {
    const res = await getUser(values.name);

    if (res.password === values.password && res.nickname === values.name) {
      // alert("Login Success");
      localStorage.setItem("user", JSON.stringify(res.nickname));
      await nagivate("/main");
    } else {
      alert("Login Failed Try Again");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "admin",
      password: "12345678",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => checkUser(values),
  });

  return (
    <div
      style={{
        margin: "auto",
        width: 500,
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ marginBottom: 2 }}
        />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

//////////////////////

export default Login;
