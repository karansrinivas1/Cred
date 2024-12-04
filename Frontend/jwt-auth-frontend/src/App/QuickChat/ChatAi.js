import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Container, Typography, TextField, Box, CircularProgress, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const UserTransactionChat = () => {
  const { user } = useSelector((state) => state.user);
  const username = user?.username;
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query) {
      setError('Please enter a query.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/api/openai/query', {
        username,
        query
      });

      setResponse(res.data.response); // Set response from backend (AI or transaction data)
      setIsLoading(false);
    } catch (err) {
      setError('Error: Could not fetch response.');
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          User Transaction Chat
        </Typography>

        {/* Chat Messages */}
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 2 }}>
          {/* User's query */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 1 }}>
            <Typography variant="body2" sx={{ background: '#f0f0f0', padding: '8px 12px', borderRadius: '8px' }}>
              {query}
            </Typography>
          </Box>
          
          {/* ChatGPT's response */}
          <Box sx={{ marginTop: 1 }}>
            {response && (
              <Typography variant="body2" sx={{ background: '#e0f7fa', padding: '8px 12px', borderRadius: '8px' }}>
                {response}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Input Field */}
        <TextField
          label="Ask a Question"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{
              padding: '12px',
              background: '#00796b',
              borderRadius: '50%',
              ':hover': {
                backgroundColor: '#004d40', // Hover effect for better UX
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : <ArrowForwardIcon />}
          </IconButton>
        </Box>

        {/* Error Message */}
        {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default UserTransactionChat;
