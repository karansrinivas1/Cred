import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Typography, Button, Snackbar } from '@mui/material';
import axios from 'axios';

const AdminUserList = () => {
    const { user } = useSelector((state) => state.user);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);  // State for Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState('');  // Snackbar message

    console.log('Rendering EmployeeListPage for admin user.');

    // Fetch the employee data from the backend API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Get the token from localStorage
                const token = localStorage.getItem('token');

                // Make the API request with Authorization header
                const response = await axios.get('http://localhost:3000/user/getAllUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add JWT token in the header
                    },
                });

                setEmployees(response.data.users); // Assuming the API returns a `users` array
                setLoading(false); // Stop loading once data is fetched
            } catch (err) {
                setError('Failed to fetch employee data.');
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    // If the user is not an admin, show unauthorized message
    if (user.type !== 1) {
        return <p>You are not authorized to view this page.</p>;
    }

    // Render loading or error state if the data is being fetched
    if (loading) {
        return (
            <div style={{ textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body1">Loading employees...</Typography>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
            </div>
        );
    }

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');

            // Make the API request to delete the user
            await axios.delete(`http://localhost:3000/user/deleteUser/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add JWT token in the header
                },
            });

            // Remove the deleted user from the list
            setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee._id !== userId));

            // Show the success message
            setSnackbarMessage('User successfully deleted!');
            setOpenSnackbar(true);

        } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user');
        }
    };

    // Handle Snackbar close
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Paper>
            <Typography variant="h4" gutterBottom style={{ padding: '16px' }}>
                User List
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Actions</TableCell> {/* Added Actions column */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee._id}>
                            {/* Display First Name, Last Name, Username, Email */}
                            <TableCell>{employee.firstName}</TableCell>
                            <TableCell>{employee.lastName}</TableCell>
                            <TableCell>{employee.username}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>
                                <Button
                                    color="secondary"
                                    onClick={() => handleDeleteUser(employee._id)}
                                    variant="contained"
                                    size="small"
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Snackbar for success message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}  // Automatically hide the message after 3 seconds
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </Paper>
    );
};

export default AdminUserList;
