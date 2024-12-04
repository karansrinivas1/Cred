import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';

const MainLayout = ({ onLogout }) => {
    const location = useLocation();
    const { user } = useSelector((state) => state.user);
    console.log('Logged-in user:', user);

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    backgroundColor: '#000', // Set the background color to black
                    color: '#fff', // Set the text color to white for readability
                    minHeight: '100vh', // Ensure it covers the full viewport height
                    padding: 0,
                }}
            >
                {/* Display Navbar except on the login page */}
                {location.pathname !== '/login' && <Navbar onLogout={onLogout} />}

                {/* Main Content */}
                <Box sx={{ padding: '20px' }}>
                    {/* Conditionally render admin-specific links */}
                    {user?.type === 'admin' && (
                        <div style={{ margin: '20px 0' }}>
                            <a
                                href="/admin/add-job"
                                style={{ marginRight: 20, color: 'white' }}
                            >
                                Add Job
                            </a>
                            <a href="/admin/employees" style={{ color: 'white' }}>
                                Employee List
                            </a>
                        </div>
                    )}

                    {/* Conditionally render employee-specific content */}
                    {user?.type === 'employee' && (
                        <div style={{ margin: '20px 0', color: 'white' }}>
                            <p>Welcome, {user.name}! You have employee access.</p>
                        </div>
                    )}

                    {/* Render child components */}
                    <Outlet />
                </Box>
            </Box>
        </>
    );
};

export default MainLayout;
