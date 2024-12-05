import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid, TextField, Button, CircularProgress } from '@mui/material';

const AboutPage = () => {
  // Get user details from Redux
  const { user } = useSelector((state) => state.user);  
  const username = user?.username;  // Extracting username from Redux store

  // Initialize state with the user details from Redux
  const [userDetails, setUserDetails] = useState({
    firstName: user?.firstName || '',  // Use Redux state if available
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    userType: 1,  // Default to "Admin" user type, which is hidden from UI
  });

  const [loading, setLoading] = useState(true);  // Loading state for fetching user data
  const [error, setError] = useState('');
  const [editable, setEditable] = useState(false);

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/getUser/${username}`); // Use username from Redux
        const { firstName, lastName, username, email } = response.data.user;
        setUserDetails({
          firstName,
          lastName,
          username,
          email,
          userType: 2, // Ensuring the userType is set to 1 but hidden in the UI
        });
        setLoading(false);  // Set loading to false after data is fetched
      } catch (err) {
      
        setLoading(false);  // Set loading to false if there's an error
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);  // Only run once when username is available

  // Handle user details update
  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      setError('');
      const { firstName, lastName, email } = userDetails; // Only send the fields that are editable
      const response = await axios.put(`http://localhost:3000/user/editUser/${username}`, {
        firstName,
        lastName,
        email,
        userType: 1, // Set userType to 1 but don't show it in the form
      });
      setUserDetails(response.data.updatedUser);
      setEditable(false);  // Disable editing after successful update
      setLoading(false);
    } catch (err) {
      setError('Failed to update user details');
      setLoading(false);
    }
  };

  // Handle input change for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  // Show loading spinner if data is still loading
  if (loading) {
    return (
      <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" align="center" gutterBottom>Edit Details</Typography>

      {/* Display User Details */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>User Details</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>First Name</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="firstName"
                  value={userDetails.firstName}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Last Name</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="lastName"
                  value={userDetails.lastName}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Username</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="username"
                  value={userDetails.username}
                  onChange={handleInputChange}
                  disabled
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Email</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  disabled={!editable}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Remove UserType from UI */}
          {/* If needed for some reason, you can handle it in the backend, but it won't be visible here. */}
        </Grid>
      </Box>

      {/* Display Errors */}
      {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}

      {/* Update button and toggle edit mode */}
      {editable ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateUser}
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? 'Updating...' : 'Save Changes'}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setEditable(true)}
          sx={{ marginTop: 2 }}
        >
          Edit Details
        </Button>
      )}
    </Box>
  );
};

export default AboutPage;
