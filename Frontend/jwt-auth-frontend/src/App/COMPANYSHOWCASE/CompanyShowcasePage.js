import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

const CompanyShowcase = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:3000/image/images'); // Adjust URL if necessary
                setImages(response.data);
            } catch (err) {
                setError('Failed to fetch images');
            }
        };
        fetchImages();
    }, []);

    return (
        <Container sx={{ paddingY: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Company Showcase
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Grid container spacing={4}>
                {images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {image.image && image.image.data && image.image.contentType ? (
                                <CardMedia
                                    component="img"
                                    sx={{ width: '100%', height: 140 }}
                                    image={`data:${image.image.contentType};base64,${image.image.data}`}
                                    alt={image.name}
                                />
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ padding: 2 }}>
                                    Image not available
                                </Typography>
                            )}
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    {image.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CompanyShowcase;
