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

                {/* Desktop Navigation */}
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        gap: '10px',
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
                                    borderBottom: '2px solid #FFF',
                                },
                            }}
                        >
                            {link.label}
                        </Button>
                    ))}
                    <Button
                        sx={{
                            color: '#FFF',
                            textTransform: 'none',
                            '&:hover': { fontWeight: 'bold' },
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>

                {/* Mobile Navigation */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleMobileMenu}
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        color: '#FFF',
                    }}
                >
                    <MenuIcon />
                </IconButton>
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
