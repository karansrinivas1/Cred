import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';

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
      <Box>
        <Typography variant="h6" gutterBottom>
          User Transaction Chat
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Chat:</Typography>
          <Box sx={{ minHeight: 200, border: '1px solid #ddd', padding: 2, overflowY: 'auto' }}>
            {response && <Typography variant="body2">{response}</Typography>}
          </Box>
        </Box>

        <TextField
          label="Ask a Question"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Send'}
        </Button>

        {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default UserTransactionChat;
