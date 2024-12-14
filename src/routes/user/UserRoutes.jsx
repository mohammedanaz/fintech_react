import {Suspense, lazy} from "react";
import {Routes, Route} from "react-router-dom";
import HomeRoutes from "../protectedRoutes/HomeRoutes";
import AuthProtectionRoutes from "../protectedRoutes/AuthProtectionRoutes";
import SignUpLoginProtectRoutes from "../protectedRoutes/SignUpLoginProtectRoutes"

// Lazy load components 
const LandingPage = lazy(()=> import("../../pages/user/LandingPage"))
const LoginPage = lazy(()=> import("../../pages/user/LoginPage"))
const SignupPage = lazy(()=> import("../../pages/user/SignupPage"))
const IndividualHome = lazy(()=> import("../../pages/user/IndividualHome"))
const CorporateHome = lazy(()=> import("../../pages/user/CorporateHomePage"))

export default function UserRoutes(){
    return(
        <Suspense>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" 
                element={<SignUpLoginProtectRoutes element={LoginPage} />} 
                />
                <Route path="/signup" 
                element={<SignUpLoginProtectRoutes element={SignupPage} />} 
                />
                <Route path="/home" element={<HomeRoutes />} />
                <Route path="/individualHome" 
                element={<AuthProtectionRoutes element={IndividualHome} userRole="individual" />} 
                />
                <Route path="/corporateHome" 
                element={<AuthProtectionRoutes element={CorporateHome} userRole="corporate" />} 
                />
            </Routes>
        </Suspense>
    )
}
