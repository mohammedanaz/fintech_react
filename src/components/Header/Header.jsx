import React from 'react';
import { IoPersonSharp } from "react-icons/io5";
import Finalysis_logo from "../../assets/Finalysis_logo.png";
import { MdLogout } from "react-icons/md";
import { useSelector } from "react-redux";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import { logout } from "../../redux/slices/AuthSlice";
import useToast from "../../hooks/UseToast";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  const handleLogout = () => {
    dispatch(logout());
    showToast("Successfully Logged Out", "success");
    navigate("/login");
  };

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
          <img src={Finalysis_logo} alt="Brand Logo" height="45" />
          </a>
          <button className="navbar-toggler" type="button" 
            data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" 
            aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">Contact Us</a>
              </li>
              <li className="nav-item">
                {isAuthenticated ? (
                  <a className="nav-link" href="#">
                  <MdLogout  size={20} style={{ marginRight: '5px' }} onClick={handleLogout} />
                  </a>
                ) : (
                  <a className="nav-link" href="/login">
                    <IoPersonSharp size={20} style={{ marginRight: '5px' }} />
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
  
  export default Header;
