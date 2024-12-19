import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import Spinner from "../../components/Spinner/Spinner"
import Auth from "../../Api/Auth";
import { Modal, Button } from 'react-bootstrap';
import useToast from "../../hooks/UseToast";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {setUser} from "../../redux/slices/AuthSlice"

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, setError, } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [data, setData] = useState(null)
  const showToast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (formData) => {
    console.log("login form data - ",formData); 
    setData(formData)
    try{
      setIsLoading(true)
        const response = await Auth.login(formData);
        console.log("response at login success -", response);
        setIsLoading(false)
        setShowModal(true);
    }catch(error){
      setIsLoading(false)
        console.log("Response error upon Login :", error);
        setError("email", {
            type: "manual",
            message:
              error.response.data.non_field_errors || "Invalid credentials.",
          });
    }
  };

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value.length === 1 && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async () => {
    try{
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

  if(isLoading){
    return <Spinner />
  };

  return (
    <div className='container'>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className="mt-4 ">Login</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary">Login</button>
          <p>
            If not registered, please <a className="text-primary" href="/signup">Signup</a>.
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
