import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Grid, ButtonGroup, Button, Card, CardContent, CardActions } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registering the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HomePage = () => {
    const [spendingData, setSpendingData] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('1M'); // Default period to '1 month'

    const periodMapping = {
        '1D': 'day',
        '1W': 'week',
        '1M': 'month',
        '1Y': 'year',
        '5Y': 'year',
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const period = periodMapping[selectedPeriod]; // Convert the selected period to match backend format
                const spendingResponse = await axios.post('http://localhost:3000/api/transactions/spending-trend', {
                    username: 'userone',
                    period: period
                });
                const transactionsResponse = await axios.get('http://localhost:3000/api/transactions/userone');
                
                // Set the fetched data
                setSpendingData(spendingResponse.data);
                setRecentTransactions(transactionsResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedPeriod]);

    // Handle empty or null data to display an empty graph
    const formatSpendingData = (data) => {
        if (!data || data.length === 0) {
            return {
                labels: [],
                datasets: [
                    {
                        label: 'Spending Trend',
                        data: [],
                        fill: false,
                        borderColor: 'rgba(75,192,192,1)',
                        tension: 0.1,
                    }
                ]
            };
        }

        const labels = data.map(item => item._id); // Use appropriate labels like Date, Month, etc.
        const values = data.map(item => item.totalAmount); // Transaction amount per period

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Spending Trend',
                    data: values,
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.1,
                }
            ]
        };
    };

    // Function to color transactions based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'green';
            case 'pending':
                return 'orange';
            case 'declined':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Welcome to Cred</Typography>
            <Typography variant="h6" align="center" gutterBottom>Spending Trends & Recent Transactions</Typography>

            {/* Period selection buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                <ButtonGroup variant="contained" aria-label="period selection">
                    {['1D', '1W', '1M', '1Y', '5Y'].map((period) => (
                        <Button
                            key={period}
                            value={period}
                            onClick={handlePeriodChange}
                            sx={{ 
                                backgroundColor: selectedPeriod === period ? 'primary.main' : 'default',
                                color: selectedPeriod === period ? 'white' : 'default',
                                '&:hover': { backgroundColor: selectedPeriod === period ? 'primary.dark' : 'lightgray' },
                            }}
                        >
                            {period}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {/* Display Spending Trend Line Chart */}
                    <Grid item xs={12}>
                        <Line data={formatSpendingData(spendingData)} />
                    </Grid>

                    {/* Display Recent Transactions */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
                        {recentTransactions.map((transaction) => (
                            <Card key={transaction.transaction_id} sx={{ marginBottom: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{transaction.card_type} - ${transaction.transaction_amount.toFixed(2)}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(transaction.transaction_date).toLocaleDateString()} - {transaction.merchant_type}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: getStatusColor(transaction.transaction_status), fontWeight: 'bold' }}
                                    >
                                        {transaction.transaction_status.toUpperCase()}
                                    </Typography>
                                </CardActions>
                            </Card>
                        ))}
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default HomePage;
