import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        return <Navigate to="/" replace />; // redirect to login
    }

    return children;
};
