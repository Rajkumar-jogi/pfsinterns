import { useLocation, Navigate, Outlet } from 'react-router-dom';
import cookies from 'js-cookie';

const ProtectedRoute = () => {
    const token = cookies.get('token');
    const location = useLocation();

    if (token === undefined) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
