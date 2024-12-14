import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import Auth from "../../Api/Auth";
import { Modal, Button } from 'react-bootstrap';
import useToast from "../../hooks/UseToast";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {setUser} from "../../redux/slices/AuthSlice"
import Spinner from "../../components/Spinner/Spinner"

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [data, setData] = useState(null)
  const showToast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData) => {
    console.log("signup form data - ", formData);
    setData(formData)
    try {
      setIsLoading(true)
      const response = await Auth.signup(formData);
      console.log("response at signup success -", response);
      setIsLoading(false)
      setShowModal(true);
    } catch (error) {
      setIsLoading(false)
      console.log("Response error upon signup:", error);
      setError("email", {
        type: "manual",
        message: error.response.data.email || "Invalid credentials.",
      });
    }
  };

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Auto focus to the next field when the user types
    if (value.length === 1 && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async () => {
    try{
        // Check if all OTP fields are filled
        const isOtpComplete = otp.every((digit) => digit !== "");
        
        if (isOtpComplete) {
            setIsLoading(true)
            console.log("Entered OTP:", otp.join(""));
            setOtpError(false); 
            setShowModal(false); 
            setOtp(["", "", "", "", "", ""]);
            const newOtp = otp.join("")
            const newData = {...data, otp: newOtp} 
            const response = await Auth.loginOtp(newData); 
            setIsLoading(false)
            console.log("response at otp success -", response);
            const {access, refresh, user} = response;
            dispatch(
                setUser({
                isActive: user.is_active,
                email: user.email,
                fullName: user.full_name || "",
                accessToken: access,
                refreshToken: refresh,
                role: user.role,
                })
            );
            showToast(response.message, "success");
            navigate("/home");
        } else {
        setOtpError(true); 
        }
    }catch(error){
      setIsLoading(false)
      console.log("Response error upon OTP Login :", error);
      showToast("Invalid OTP", "error");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setOtp(["", "", "", "", "", ""]); 
    setOtpError(false);
  };

  // Watch password and confirm password values
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  if(isLoading){
      return <Spinner />
    };

  return (
    <div className='container'>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className="mt-4">Signup</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address"
                }
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long"
                }
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              className={`form-control ${errors.role ? 'is-invalid' : ''}`}
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select a role</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
              <option value="advisor">Financial Advisor</option>
            </select>
            {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary">Signup</button>
          <p>
            If already registered, please <a className="text-primary" href="/login">Login</a>.
          </p>
        </div>
      </form>

      {/* OTP Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center gap-2">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                id={`otp-${index}`}
                className="form-control text-center"
                style={{ width: "50px", fontSize: "1.5rem", height: "50px" }}
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(e.target.value, index)}
              />
            ))}
          </div>
          {otpError && <div className="invalid-feedback d-block">Please fill all OTP fields.</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleOtpSubmit}>
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
