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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .min(6, "Mật khẩu quá ngắn")
    .required("Vui lòng nhập mật khẩu"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [openAlert, setOpenAlert] = useState(false);

  const handleCloseAlert = () => setOpenAlert(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
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
          Đăng nhập
        </Typography>

        <Snackbar
          open={openAlert}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alertType}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const data = await login(values);
            setSubmitting(false);
            if (!data) {
              setAlertMessage("Đăng nhập thất bại. Vui lòng thử lại.");
              setAlertType("error");
              setOpenAlert(true);
              return;
            }
            setAlertMessage("Đăng nhập thành công!");
            setAlertType("success");
            setOpenAlert(true);
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

              {isSubmitting && <LinearProgress />}

              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Đăng nhập
              </Button>
              <Button
                variant="text"
                color="primary"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Chưa có tài khoản? Đăng ký
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
};

export default Login;
