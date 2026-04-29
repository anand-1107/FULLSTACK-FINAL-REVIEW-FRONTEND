import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRole }) => {
  return children;
};

export default PrivateRoute;
