// src/pages/HomePage.js
import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import JobCard from './JobCard';

const HomePage = () => {
    const jobListings = [
        { title: "Software Engineer", company: "Tech Corp", location: "San Francisco, CA", description: "Develop and maintain web applications..." },
        { title: "Data Analyst", company: "Data Inc.", location: "New York, NY", description: "Analyze and interpret data to inform business decisions..." },
        { title: "Product Manager", company: "Innovate Ltd.", location: "Remote", description: "Lead product teams to define and develop product features..." },
        // Add more job listings as needed
    ];

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Welcome to the Job Portal</Typography>
            <Typography variant="body1" align="center" gutterBottom>Explore job opportunities and connect with top companies.</Typography>
            <Grid container spacing={2} justifyContent="center">
                {jobListings.map((job, index) => (
                    <Grid item key={index}>
                        <JobCard
                            title={job.title}
                            company={job.company}
                            location={job.location}
                            description={job.description}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default HomePage;
