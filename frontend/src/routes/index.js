import { Routes, Route } from "react-router-dom";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import Map from '../pages/Map';

export default function AppRoutes() {
    return ( <
        Routes >
        <
        Route path = "/"
        element = { < ForgotPasswordPage / > }
        /> <
        Route path = "/forgot-password"
        element = { < ForgotPasswordPage / > }
        /> <
        Route path = "/map"
        element = { < Map / > }
        /> <
        /Routes>
    );
}