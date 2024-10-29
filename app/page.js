"use client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import * as yup from "yup";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email format").when('isLogin', {
      is: false,
      then: () => yup.string().required("Email is required"),
      otherwise: () => yup.string().notRequired(),
    }),
    password: yup.string().min(8, "Password must be at least 8 characters").required(),
    username: yup.string().required("Username is required"),
  });

  const validateWithSchema = async () => {
    try {
      await schema.validate({ username, password, email, isLogin });
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const isValid = await validateWithSchema();
      if (!isValid) return;

      const url = "http://localhost/pet_management_system/api/users.php";
      const jsonData = {
        Username: username,
        Password: password,
      };

      const formData = new FormData();
      formData.append('operation', 'handleLogin');
      formData.append('json', JSON.stringify(jsonData));

      const res = await axios.post(url, formData);
      const data = res.data;

      console.log("Login response:", data); // For debugging

      if (data && data.UserID) {
        toast.success(`Welcome, ${data.Username}!`, { duration: 1200 });
        
        // Store user data
        secureLocalStorage.setItem("isLoggedIn", "true");
        // const userId = secureLocalStorage.getItem("userId");
        secureLocalStorage.setItem("userId", data.UserID);
        secureLocalStorage.setItem("username", data.Username);
        secureLocalStorage.setItem("role", data.user_level);
        
        // Route based on user_level
        setTimeout(() => {
          switch (parseInt(data.user_level)) {
            case 1:
              router.push("/admin");
              break;
            case 2:
              router.push("/veterinarian");
              break;
            case 3:
              router.push("/owner");
              break;
            default:
              router.push("/");
              break;
          }
        }, 1500);
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data === 0) {
        toast.error("Invalid credentials!");
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    const isValid = await validateWithSchema();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const url = "http://localhost/pet_management_system/api/users.php";
      const jsonData = {
        Username: username,
        Password: password,
        Email: email,
        FirstName: firstName,
        LastName: lastName,
      };

      const formData = new FormData();
      formData.append('operation', 'register');
      formData.append('json', JSON.stringify(jsonData));

      const res = await axios.post(url, formData);
      const data = res.data;

      console.log("Registration response:", data);

      if (data.success) {
        toast.success("Registration successful! Please log in.");
        setIsLogin(true); // Switch to login form
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setFirstName("");
        setLastName("");
      } else {
        toast.error("Registration failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed: " + (error.response?.data?.message || error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-green-300">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">
          {isLogin ? "🐾 Login" : "🐶 Register"}
        </h1>

        <FloatingLabel label="Username" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FloatingLabel>

        {!isLogin && (
          <>
            <FloatingLabel label="First Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </FloatingLabel>

            <FloatingLabel label="Last Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </FloatingLabel>
          </>
        )}

        {!isLogin && (
          <FloatingLabel label="Email" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FloatingLabel>
        )}

        <FloatingLabel label="Password" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FloatingLabel>

        {!isLogin && (
          <FloatingLabel label="Confirm Password" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FloatingLabel>
        )}

        <Button
          onClick={isLogin ? handleLogin : handleRegister}
          disabled={isLoading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
        >
          {isLoading ? <Spinner animation="border" size="sm" /> : isLogin ? "Login" : "Register"}
        </Button>

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="text-pink-600 cursor-pointer"
            onClick={() => setIsLogin((prev) => !prev)}
          >
            {isLogin ? "Register here!" : "Login here!"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
