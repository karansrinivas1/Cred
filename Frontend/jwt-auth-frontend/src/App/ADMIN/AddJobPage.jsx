import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addJob } from '../redux/slices/jobSlice';
import { TextField, Button, Box, Typography, CircularProgress, Snackbar } from '@mui/material';

const AddJobPage = () => {
    console.log('Rendering AddJobPage for admin user.');

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        salary: '',
        applyLink: '',
        skills: '',  // New field for skills
        companyName: ''  // New field for company name
    });

    const [loading, setLoading] = useState(false); // To manage loading state
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Split skills input by comma and trim each skill
        const skillsArray = formData.skills.split(',').map(skill => skill.trim());

        // Add the skills array and companyName to formData before dispatching
        const jobData = { ...formData, skills: skillsArray };

        try {
            setLoading(true); // Set loading to true while making the API request
            await dispatch(addJob(jobData));
            
            // On success, display success message
            setMessage('Job created successfully!');
            setOpenSnackbar(true);
        } catch (error) {
            // Handle errors if any
            setMessage('Failed to create job.');
            setOpenSnackbar(true);
        } finally {
            setLoading(false); // Set loading to false once the process is done
        }

        // Reset the form after submission
        setFormData({ id: '', title: '', description: '', salary: '', applyLink: '', skills: '', companyName: '' });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto' }}>
            <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '20px' }}>
                Add a New Job
            </Typography>
            
            <TextField
                label="Job ID"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                multiline
            />
            <TextField
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Apply Link"
                name="applyLink"
                value={formData.applyLink}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Skills (comma separated)"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                helperText="Enter skills as comma separated values (e.g. JavaScript, React, Node.js)"
            />
            <TextField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            
            {/* Displaying Loader while adding job */}
            {loading ? (
                <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
            ) : (
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Add Job
                </Button>
            )}

            {/* Snackbar to show success or error message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={message}
            />
        </Box>
    );
};

export default AddJobPage;
