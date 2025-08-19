import {
  Box,
  Button,
  LinearProgress,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useToastStore from "../store/toastStore";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password is too short")
    .required("Please enter your password"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useToastStore();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Box
        sx={{
          height: 580,
          width: 480,
          display: "flex",
          alignItems: "center",
          p: 6,
          borderRadius: 2,
          boxShadow: 3,
          gap: 2,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
          Login
        </Typography>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const { token, error } = await login(values);
            setSubmitting(false);

            if (error) {
              showToast(error, "error");
              return;
            }

            showToast("Login successful!", "success");
            navigate("/");
          }}
        >
          {({
            isSubmitting,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
          }) => (
            <Form className="gap-5 flex flex-col w-full">
              <TextField
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
                autoFocus
                autoComplete="email"
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
              />

              {isSubmitting && <LinearProgress />}

              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Login
              </Button>
              <Button
                variant="text"
                color="primary"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Don’t have an account? Register
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
};

export default Login;
