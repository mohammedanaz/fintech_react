import {Suspense, lazy} from "react";
import {Routes, Route} from "react-router-dom";

// Lazy load components 
const LandingPage = lazy(()=> import("../../pages/user/LandingPage"))

export default function UserRoutes(){
    return(
        <Suspense>
            <Routes>
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </Suspense>
    )
}
