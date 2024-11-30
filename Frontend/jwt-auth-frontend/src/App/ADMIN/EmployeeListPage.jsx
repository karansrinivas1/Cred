import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

const EmployeeListPage = () => {
    const { user } = useSelector((state) => state.user);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    console.log('Rendering EmployeeListPage for admin user.');

    // Fetch the employee data from the backend API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Get the token from localStorage
                const token = localStorage.getItem('token');

                // Make the API request with Authorization header
                const response = await axios.get('http://localhost:3000/user/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add JWT token in the header
                    },
                });

                setEmployees(response.data);
                setLoading(false); // Stop loading once data is fetched
            } catch (err) {
                setError('Failed to fetch employee data.');
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    // If the user is not an admin, show unauthorized message
    if (user.type !== 2) {
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

    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee._id}>
                            {/* Removed ID column */}
                            <TableCell>{employee.fullName}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default EmployeeListPage;
