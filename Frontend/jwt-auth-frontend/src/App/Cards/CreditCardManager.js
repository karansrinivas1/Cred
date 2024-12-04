import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';


const CreditCardManager = () => {
    const [cards, setCards] = useState([]);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardType, setCardType] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Access user data from Redux
    const { user } = useSelector((state) => state.user);
    const username = user?.username;

    // Detect card type based on card number
    const detectCardType = (number) => {
        const patterns = {
            Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            MasterCard: /^5[1-5][0-9]{14}$/,
            Amex: /^3[47][0-9]{13}$/,
            Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        };

        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(number)) {
                return type;
            }
        }
        return 'Unknown';
    };

    // Fetch credit cards on component load
    useEffect(() => {
        if (!username) return;
        const fetchCards = async () => {
            try {
                const response = await api.get(`api/credit-cards/${username}`);
                setCards(response.data.data.cards || []);
            } catch (err) {
                setError('Failed to retrieve credit cards.');
            }
        };

        fetchCards();
    }, [username]);

    const handleAddCard = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await api.post('api/credit-cards/add-card', {
                username,
                cardNumber,
                expiryDate,
                cvv,
                cardType: detectCardType(cardNumber),
                creditLimit: 1000, // Default credit limit
                creditBalance: 3000, // Default credit balance
            });

            setMessage('Card added successfully!');
            setIsAddingCard(false);

            // Refresh the card list
            const updatedResponse = await api.get(`api/credit-cards/${username}`);
            setCards(updatedResponse.data.data.cards || []);
        } catch (err) {
            setError('Failed to add credit card. Please try again.');
        }
    };

    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            {!isAddingCard ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        My Credit Cards
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {cards.map((card, index) => (
                            <Grid
                                item
                                key={index}
                                xs={12}
                                sm={6}
                                md={4}
                                sx={{
                                    position: 'relative',
                                    marginBottom: '20px',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '180px',
                                        borderRadius: '15px',
                                        background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
                                        boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
                                        padding: '20px',
                                        color: 'white',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="h6">{card.cardType}</Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ letterSpacing: '2px', marginBottom: '10px' }}
                                    >
                                        **** **** **** {card.cardNumber.slice(-4)}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="body2">
                                            Balance: ${card.creditBalance.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body2">
                                            Credit Limit: ${card.creditLimit.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '20px' }}
                        onClick={() => setIsAddingCard(true)}
                    >
                        Add Another Card
                    </Button>
                </>
            ) : (
                <Box sx={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Add Credit Card
                    </Typography>
                    <form onSubmit={handleAddCard} style={{ marginTop: '20px' }}>
                        <TextField
                            fullWidth
                            label="Card Number"
                            variant="outlined"
                            value={cardNumber}
                            onChange={(e) => {
                                setCardNumber(e.target.value);
                                setCardType(detectCardType(e.target.value));
                            }}
                            margin="normal"
                            required
                        />
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Detected Card Type: {cardType || 'Unknown'}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Expiry Date (MM/YY)"
                                    variant="outlined"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="CVV"
                                    variant="outlined"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: '20px', marginRight: '10px' }}
                        >
                            Add Card
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ marginTop: '20px' }}
                            onClick={() => setIsAddingCard(false)}
                        >
                            Cancel
                        </Button>
                        {error && (
                            <Typography color="error" sx={{ marginTop: '10px' }}>
                                {error}
                            </Typography>
                        )}
                        {message && (
                            <Typography color="primary" sx={{ marginTop: '10px' }}>
                                {message}
                            </Typography>
                        )}
                    </form>
                </Box>
            )}
        </Box>
    );
};

export default CreditCardManager;
