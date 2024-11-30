// src/pages/AboutPage.js
import React from 'react';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';

const AboutPage = () => {
    return (
        <Box sx={{ padding: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box>
                <Typography variant="h4" align="center" gutterBottom>About Us</Typography>
                <Typography variant="body1" align="center" paragraph>
                    Our mission is to bridge the gap between talented job seekers and top employers, creating opportunities for everyone.
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {/* Mission Section */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Our Mission</Typography>
                                <Typography variant="body2">
                                    We aim to empower job seekers by providing a platform where they can explore a diverse range of opportunities, and to help companies find the perfect candidates for their roles.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Core Values Section */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Our Core Values</Typography>
                                <Typography variant="body2">
                                    Integrity, inclusivity, and innovation are at the heart of what we do. We strive to create a welcoming environment for all, promoting growth and learning at every stage of the job search.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* What Sets Us Apart Section */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>What Sets Us Apart</Typography>
                                <Typography variant="body2">
                                    Our platform leverages cutting-edge technology and user-friendly design to offer a seamless experience, making it easier than ever for job seekers to find roles that match their skills and interests.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Remove Spacer Box or minimize it */}
            <Box sx={{ flexGrow: 0.3 }} />

            {/* Join Us Section */}
            <Box mt={3} align="center">
                <Typography variant="h6">Join Us</Typography>
                <Typography variant="body2">
                    Whether you're looking for your dream job or trying to fill an open position, we're here to support your journey. Let's build a brighter future together!
                </Typography>
            </Box>
        </Box>
    );
};

export default AboutPage;
