import {
  Box,
  Button,
  LinearProgress,
  Typography,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useToastStore from "../store/toastStore";

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter your full name")
    .max(10, "Name can be at most 10 characters"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password is too short")
    .required("Please enter your password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const { showToast } = useToastStore();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Box
        sx={{
          height: 680,
          width: 480,
          display: "flex",
          alignItems: "center",
          p: 6,
          borderRadius: 2,
          boxShadow: 3,
          gap: 2,
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Button
          variant="text"
          size="small"
          onClick={() => navigate("/login")}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            textTransform: "none",
          }}
        >
          ← Back to Login
        </Button>

        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 1 }}>
          Create an Account
        </Typography>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const { confirmPassword, ...submitValues } = values;

            const { token, error } = await register(submitValues);

            setSubmitting(false);
            if (error) {
              showToast(error, "error");
              return;
            }
            showToast("Registration successful!", "success");
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
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                fullWidth
                autoFocus
              />

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

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                fullWidth
              />

              {isSubmitting && <LinearProgress />}

              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
};

export default Register;
