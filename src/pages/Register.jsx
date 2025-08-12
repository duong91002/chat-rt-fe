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

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required("Vui lòng nhập họ tên")
    .max(10, "Tên chỉ được tối đa 10 ký tự"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .min(6, "Mật khẩu quá ngắn")
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
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
          ← Quay lại đăng nhập
        </Button>

        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 1 }}>
          Đăng ký tài khoản
        </Typography>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={alertType}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>

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

            const data = await register(submitValues);

            setSubmitting(false);
            if (!data) {
              setAlertMessage("Đăng ký thất bại. Vui lòng thử lại.");
              setAlertType("error");
              setOpenSnackbar(true);
              return;
            }
            setAlertMessage("Đăng ký thành công!");
            setAlertType("success");
            setOpenSnackbar(true);
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
                label="Họ tên"
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
                label="Mật khẩu"
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
                label="Xác nhận mật khẩu"
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
                Đăng ký
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
};

export default Register;
