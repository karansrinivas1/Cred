// src/pages/ContactPage.js
import React from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';

const ContactPage = () => {
    return (
        <Box>
            <Typography variant="h4">Contact Us</Typography>
            <form>
                <TextField label="Name" fullWidth margin="normal" />
                <TextField label="Email" fullWidth margin="normal" />
                <TextField label="Message" multiline rows={4} fullWidth margin="normal" />
                <Button variant="contained" color="primary">Send Message</Button>
            </form>
        </Box>
    );
};

export default ContactPage;
