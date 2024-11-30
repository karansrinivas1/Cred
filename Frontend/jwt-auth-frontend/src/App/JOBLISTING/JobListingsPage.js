// src/App/pages/JobListingsPage.js
import React from 'react';
import { Card, CardContent, Typography, Button, Grid, Chip } from '@mui/material';
import './JobList.css';

const jobPosts = [
    {
        id: 1,
        title: 'Full Stack Developer',
        description: 'Join our dynamic team to work on cutting-edge technologies. Develop and maintain sophisticated web applications for our diverse client base.',
        salary: '$80,000 - $120,000',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        lastUpdated: 'Last updated 2 days ago',
        applyLink: 'https://example.com/apply/full-stack-developer',
    },
    {
        id: 2,
        title: 'Digital Marketing Specialist',
        description: 'Elevate our digital marketing strategies to promote our innovative products. Proficiency in SEO, SEM, and social media marketing is highly valued.',
        salary: '$50,000 - $70,000',
        requiredSkills: ['SEO', 'SEM', 'Social Media Marketing', 'Google Analytics'],
        lastUpdated: 'Last updated 1 day ago',
        applyLink: 'https://example.com/apply/digital-marketing-specialist',
    },
    {
        id: 3,
        title: 'UX/UI Designer',
        description: 'Shape engaging user experiences and create visually captivating designs. Work alongside cross-functional teams to turn ideas into reality.',
        salary: '$70,000 - $90,000',
        requiredSkills: ['Adobe XD', 'Figma', 'User Research', 'Prototyping'],
        lastUpdated: 'Last updated 4 hours ago',
        applyLink: 'https://example.com/apply/ux-ui-designer',
    },
    {
        id: 4,
        title: 'Data Scientist',
        description: 'Leverage advanced analytics and machine learning to uncover insights from vast data sets. Proficiency with Python and R is a must.',
        salary: '$100,000 - $140,000',
        requiredSkills: ['Python', 'R', 'Machine Learning', 'Data Analysis'],
        lastUpdated: 'Last updated 3 days ago',
        applyLink: 'https://example.com/apply/data-scientist',
    },
    {
        id: 5,
        title: 'Customer Support Representative',
        description: 'Deliver unparalleled customer service and support. Exceptional communication skills and a knack for solving problems are key.',
        salary: '$40,000 - $50,000',
        requiredSkills: ['Customer Service', 'Communication', 'Problem Solving'],
        lastUpdated: 'Last updated 6 hours ago',
        applyLink: 'https://example.com/apply/customer-support-representative',
    },
];


const JobListingsPage = () => {
    return (
        <div className="job-listings-container">
            <Typography variant="h4" gutterBottom>
                Job Listings
            </Typography>
            <Grid container spacing={3}>
                {jobPosts.map((job) => (
                    <Grid item xs={12} md={6} key={job.id}>
                        <Card className="job-card">
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {job.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" className="job-description">
                                    {job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}
                                </Typography>
                                <Typography variant="body1" color="textPrimary">
                                    <strong>Salary:</strong> {job.salary}
                                </Typography>
                                <Typography variant="body1" color="textPrimary">
                                    <strong>Required Skills:</strong>
                                </Typography>
                                <div className="skills-container">
                                    {job.requiredSkills.map((skill, index) => (
                                        <Chip key={index} label={skill} className="skill-chip" />
                                    ))}
                                </div>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {job.lastUpdated}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href={job.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="apply-button"
                                >
                                    Apply Here
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default JobListingsPage;
