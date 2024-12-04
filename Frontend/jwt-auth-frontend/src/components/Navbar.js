import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Access user data from Redux
    const { user } = useSelector((state) => state.user);

    const handleLogout = () => {
        onLogout(); // This function will remove the JWT token from localStorage
        navigate('/login'); // Redirect to login page after logout
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const navLinks = user?.type === 1
        ? [
              { to: '/admin/employees', label: 'Employee List' },
              { to: '/admin/add-job', label: 'Add Job' },
          ]
        : user?.type === 2
        ? [
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About' },
              { to: '/cards', label: 'Cards' },
              { to: '/contact', label: 'Contact' },
              { to: '/ChatAi', label: 'QuikChat' },
          ]
        : [
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/chatAi', label: 'Chat' },
          ];

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#000', // Black background
                boxShadow: 'none',
                padding: '10px 0',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/')}
                >
                    Cred
                </Typography>

                {/* Render links based on user type */}
                {user?.type === 1 ? (
                    // Admin-specific links
                    <>
                        <Button color="inherit" component={Link} to="/admin/employees">Employee List</Button>
                        <Button color="inherit" component={Link} to="/admin/add-job">Add Job</Button>
                    </>
                ) : user?.type === 2? (
                    // Employee-specific links
                    <>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/about">About</Button>
                        <Button color="inherit" component={Link} to="/cards">Cards</Button>
                        <Button color="inherit" component={Link} to="/contact">Contact</Button>
                        <Button color="inherit" component={Link} to="/ChatAi">QuikChat</Button>
                    </>
                ) : (
                    // Links for unauthenticated users
                    <>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/about">About</Button>
                        <Button color="inherit" component={Link} to="/contact">Contact</Button>
                        <Button color="inherit" component={Link} to="/chatAi">Chat</Button>
                    </>
                )}

                {/* Logout Button */}
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <Box
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        flexDirection: 'column',
                        backgroundColor: '#000',
                        padding: '10px',
                        borderTop: '1px solid #333',
                    }}
                >
                    {navLinks.map((link) => (
                        <Button
                            key={link.to}
                            component={Link}
                            to={link.to}
                            sx={{
                                color: '#FFF',
                                textTransform: 'none',
                                fontWeight: 'normal',
                                borderBottom: 'none',
                                '&:hover': {
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                },
                                justifyContent: 'flex-start',
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Button>
                    ))}
                    <Button
                        sx={{
                            color: '#FFF',
                            textTransform: 'none',
                            '&:hover': { fontWeight: 'bold' },
                            justifyContent: 'flex-start',
                        }}
                        onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            )}
        </AppBar>
    );
};

export default Navbar;
