import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Container, Typography, Button, Box, CircularProgress, 
  MenuItem, Select, TextField, Dialog, DialogActions, 
  DialogContent, Table, TableHead, TableRow, TableCell, TableBody 
} from '@mui/material';

const BillPaymentPage = () => {
  const { user } = useSelector((state) => state.user);  // Getting user details from Redux store
  const username = user?.username;  // Extracting username from user object in Redux store

  const [bills, setBills] = useState([]); // Store bill summary (bill_id, pending_amount)
  const [selectedBill, setSelectedBill] = useState('');
  const [billDetails, setBillDetails] = useState(null); // Store full bill details
  const [accounts, setAccounts] = useState([]); // Store account details
  const [selectedAccount, setSelectedAccount] = useState(null); // Store the full account object
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [balanceError, setBalanceError] = useState(false);

  // Fetch all bills summary and accounts on page load
  useEffect(() => {
    const fetchBillsAndAccounts = async () => {
      try {
        const billResponse = await axios.get(`http://localhost:3000/api/bills/getSummary/${username}`);  // Fetch bill summary (bill_id, pending_amount)
        const accountResponse = await axios.get(`http://localhost:3000/api/account/getAccount/${username}`); // Fetch accounts

        console.log('Bills Response:', billResponse.data);
        console.log('Accounts Response:', accountResponse.data);

        // Fix: Set accounts using correct response key
        setBills(billResponse.data.bills);  // Set the bills in state
        setAccounts(accountResponse.data.accounts || []);  // Access the 'accounts' key in the response and set the accounts in state
      } catch (err) {
        console.error('Error fetching bills or accounts:', err);
        setError('Failed to fetch bills or accounts');
      }
    };

    if (username) {
      fetchBillsAndAccounts();
    }
  }, [username]);

  // Fetch full bill details when a bill is selected
  useEffect(() => {
    if (selectedBill) {
      const fetchBillDetails = async () => {
        try {
          const billResponse = await axios.get(`http://localhost:3000/api/bills/get/${username}/${selectedBill}`);
          console.log('Bill Details:', billResponse.data);  // Log the fetched bill details
          setBillDetails(billResponse.data);  // Set the full bill details
        } catch (err) {
          console.error('Error fetching bill details:', err);
          setError('Failed to fetch bill details');
        }
      };

      fetchBillDetails();
    }
  }, [selectedBill, username]);

  // Handle opening and closing of the payment dialog
  const handleOpen = () => {
    console.log('Opening dialog...');
    setOpen(true);
  };

  const handleClose = () => {
    console.log('Closing dialog...');
    setOpen(false);
    setBalanceError(false);  // Reset balance error when closing the modal
  };

  // Handle account selection and payment amount change
  const handleAccountChange = (event) => {
    const selectedAccount = accounts.find((account) => account.accountNumber === event.target.value);
    console.log('Selected Account:', selectedAccount);
    setSelectedAccount(selectedAccount); // Store the full account object
  };

  const handleAmountChange = (event) => {
    console.log('Payment Amount:', event.target.value);
    setPaymentAmount(event.target.value);
  };

  // Handle bill payment submission
  const handlePayBill = async () => {
    try {
      if (!selectedAccount) {
        console.error('No account selected');
        setError('No account selected');
        return;
      }

      const { accountBalance } = selectedAccount;
      const billAmount = billDetails.pending_amount;

      console.log('Selected Account Balance:', accountBalance);
      console.log('Payment Amount:', paymentAmount);

      const parsedAccountBalance = parseFloat(accountBalance);
      const parsedPaymentAmount = parseFloat(paymentAmount);

      // Ensure the values are valid numbers for the balance and payment amount
      if (parsedAccountBalance < parsedPaymentAmount) {
        console.error('Insufficient balance');
        setBalanceError(true);
        return;
      }

      setLoading(true);
      setError('');
      
      // Call API to update the bill and account balance
      console.log('Updating bill and account balance...');
      const billResponse = await axios.put(`http://localhost:3000/api/bills/update/${username}/${selectedBill}`, {
        payment_amount: paymentAmount,
        transactionType: 'payment'
      });

      console.log('Updated Bill Response:', billResponse.data);
      const newBalance = parsedAccountBalance - parsedPaymentAmount;

      // Call API to update the account balance
      await axios.put(`http://localhost:3000/api/account/updateAccount/${username}`, {
        accountBalance: newBalance
      });

      // Delete the bill if fully paid
      if (billResponse.data.bill.pending_amount === 0) {
        await axios.delete(`http://localhost:3000/api/bills/delete/${username}/${selectedBill}`);
        console.log('Bill fully paid and deleted');
      }

      setLoading(false);
      setOpen(false);
      setPaymentAmount('');
      setBalanceError(false);
      setBills((prevBills) => prevBills.filter((bill) => bill.bill_id !== selectedBill));  // Remove paid bill from the list
    } catch (err) {
      console.error('Error processing payment:', err);
      setLoading(false);
      setError('Error processing payment');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Bill Payment</Typography>

      {/* Bill List */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Select Bill</Typography>
        <Select
          value={selectedBill}
          onChange={(e) => setSelectedBill(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="" disabled>Select a bill</MenuItem>
          {bills.map((bill) => (
            <MenuItem key={bill.bill_id} value={bill.bill_id}>
              {bill.bill_id} - ${bill.pending_amount} Pending
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Account Selection */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Select Account</Typography>
        <Select
          value={selectedAccount?.accountNumber || ''}  // Use accountNumber as value for the Select component
          onChange={handleAccountChange}
          displayEmpty
          fullWidth
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="" disabled>Select an account</MenuItem>
          {accounts.map((account) => (
            <MenuItem key={account.accountNumber} value={account.accountNumber}>
              {account.accountNumber} - ${account.accountBalance} Balance
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Payment Amount */}
      <Box sx={{ marginBottom: 4 }}>
        <TextField
          label="Payment Amount"
          value={paymentAmount}
          onChange={handleAmountChange}
          type="number"
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
      </Box>

      {/* Insufficient balance error */}
      {balanceError && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          Insufficient balance in the selected account.
        </Typography>
      )}

      {/* Payment Button */}
      <Button variant="contained" color="primary" onClick={handleOpen} disabled={!selectedBill || !selectedAccount || !paymentAmount}>
        Pay Bill
      </Button>

      {/* Error handling */}
      {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}

      {/* Bill Details Table - Transactions */}
      {billDetails && selectedBill && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6">Bill Details</Typography>
          <Typography variant="body1">Total Amount: ${billDetails.total_amount}</Typography>
          <Typography variant="body1">Pending Amount: ${billDetails.pending_amount}</Typography>

          {/* Transactions Table */}
          <Table sx={{ marginTop: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billDetails.transactions && billDetails.transactions.length > 0 ? (
                billDetails.transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>{transaction.transaction_id}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.transactionType}</TableCell>
                    <TableCell>{new Date(transaction.transactionDate).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No transactions available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Modal for Confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography variant="h6">Confirm Payment</Typography>
          <Typography variant="body1">
            Are you sure you want to pay ${paymentAmount} for bill ID: {selectedBill}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handlePayBill} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BillPaymentPage;
