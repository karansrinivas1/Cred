import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './App/HOME/HomePage';
import AboutPage from './App/ABOUT/AboutPage';
import Cards from './App/Cards/CreditCardManager';
import ContactPage from './App/CONTACT/ContactPage';
import ChatAi from './App/QuickChat/ChatAi';
import Login from './App/pages/Login';
import AddJobPage from './App/ADMIN/AddJobPage';
import EmployeeListPage from './App/ADMIN/EmployeeListPage';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import SignUp from './App/pages/SignUp';
import ForgotPassword from './App/pages/ForgotPassword';
import ResetPassword  from './App/pages/ResetPassword';

function App() {
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return Boolean(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const { user } = useSelector((state) => state.user);

    console.log('App.js - Logged-in User:', user);

    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/reset-password/:token" element={<ResetPassword/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
               
              

                {/* Protected Routes under MainLayout */}
                <Route element={<MainLayout onLogout={handleLogout} />}>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/about"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <AboutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cards"
                        element={
                            <RoleBasedRoute allowedRoles={[2]}>
                                <Cards />
                            </RoleBasedRoute>
                        }
                    />
                    <Route
                        path="/contact"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <ContactPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ChatAi"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <ChatAi />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin-Specific Routes */}
                    <Route
                        path="/admin/add-job"
                        element={
                            <RoleBasedRoute allowedRoles={[1]}>
                                <AddJobPage />
                            </RoleBasedRoute>
                        }
                    />
                    <Route
                        path="/admin/employees"
                        element={
                            <RoleBasedRoute allowedRoles={[1]}>
                                <EmployeeListPage />
                            </RoleBasedRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
