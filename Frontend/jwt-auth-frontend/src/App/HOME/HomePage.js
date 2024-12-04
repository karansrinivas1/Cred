import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  ButtonGroup,
  Button,
  IconButton,
} from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HomePage = () => {
  const [spendingData, setSpendingData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("1M");
  const [chartType, setChartType] = useState("line");
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const periodMapping = {
    "1D": "day",
    "1W": "week",
    "1M": "month",
    "1Y": "year",
    "5Y": "year",
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const period = periodMapping[selectedPeriod];
        const spendingResponse = await axios.post(
          "http://localhost:3000/api/transactions/spending-trend",
          {
            username: "userone",
            period: period,
          }
        );
        const transactionsResponse = await axios.get(
          "http://localhost:3000/api/transactions/userone"
        );

        setSpendingData(spendingResponse.data);
        setRecentTransactions(transactionsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const formatSpendingData = (data) => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Spending Trend",
            data: [],
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
          },
        ],
      };
    }

    const labels = data.map((item) => item._id);
    const values = data.map((item) => item.totalAmount);

    return {
      labels,
      datasets: [
        {
          label: "Spending Trend",
          data: values,
          fill: false,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 2,
        },
      ],
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "#FFA500";
      case "declined":
        return "red";
      default:
        return "gray";
    }
  };

  const renderChart = () => {
    const chartData = formatSpendingData(spendingData);

    if (chartType === "line") {
      return <Line data={chartData} />;
    } else if (chartType === "bar") {
      return <Bar data={chartData} />;
    } else if (chartType === "pie") {
      return <Pie data={chartData} />;
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        backgroundColor: "#000", // Black background
        minHeight: "100vh", // Full viewport height
        width: "100%", // Ensure full width
        color: "#fff", // White text
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
        }}
      >
        Spending Trends & Recent Transactions
      </Typography>

      {/* Chart Type Selection */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 2,
          flexWrap: "wrap", // Wrap buttons on smaller screens
        }}
      >
        {["line", "bar", "pie"].map((type) => (
          <Button
            key={type}
            onClick={() => handleChartTypeChange(type)}
            sx={{
              backgroundColor: chartType === type ? "#1F1F1F" : "#333",
              color: chartType === type ? "white" : "#BBB",
              "&:hover": { backgroundColor: "#555" },
              marginX: 1,
              marginY: 1, // Add vertical margin for smaller screens
            }}
          >
            {type.toUpperCase()}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 4,
          flexWrap: "wrap", // Wrap buttons on smaller screens
        }}
      >
        <ButtonGroup
          variant="contained"
          aria-label="period selection"
          sx={{ flexWrap: "wrap" }}
        >
          {["1D", "1W", "1M", "1Y", "5Y"].map((period) => (
            <Button
              key={period}
              value={period}
              onClick={handlePeriodChange}
              sx={{
                backgroundColor: selectedPeriod === period ? "#1F1F1F" : "#333",
                color: selectedPeriod === period ? "white" : "#BBB",
                "&:hover": { backgroundColor: "#555" },
                marginX: { xs: 0.5, sm: 1 },
              }}
            >
              {period}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {/* Chart */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              margin: "0 auto",
              width: { xs: "100%", sm: "90%", md: "80%" },
            }}
          >
            {renderChart()}
          </Grid>

          {/* Transactions Table */}
          <Grid item xs={12}>
            <Box
              sx={{
                background: "#1F1F1F",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.8)",
                marginTop: "20px",
                overflowX: "auto", // Enable horizontal scrolling on smaller screens
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 2,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "white",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                Your Transactions
              </Typography>

              {/* Table Headers */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #333",
                  fontSize: { xs: "0.75rem", sm: "1rem" }, // Adjust font size for mobile
                  flexWrap: { xs: "wrap", sm: "nowrap" }, // Wrap content on smaller screens
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#BBB",
                    width: { xs: "100%", sm: "25%" }, // Full width on mobile
                    textAlign: { xs: "left", sm: "center" }, // Adjust alignment for mobile
                  }}
                >
                  Merchant
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#BBB",
                    width: { xs: "100%", sm: "15%" },
                    textAlign: { xs: "left", sm: "center" },
                  }}
                >
                  Amount
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#BBB",
                    width: { xs: "100%", sm: "35%" },
                    textAlign: { xs: "left", sm: "center" },
                  }}
                >
                  Account
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#BBB",
                    width: { xs: "100%", sm: "25%" },
                    textAlign: { xs: "left", sm: "right" },
                  }}
                >
                  Transaction ID
                </Typography>
              </Box>

              {/* Table Data */}
              {recentTransactions
                .slice(0, showAllTransactions ? recentTransactions.length : 5)
                .map((transaction) => (
                  <Box
                    key={transaction.transaction_id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #333",
                      fontSize: { xs: "0.75rem", sm: "1rem" },
                      flexWrap: { xs: "wrap", sm: "nowrap" }, // Wrap on smaller screens
                      ":last-child": { borderBottom: "none" },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#BBB",
                        width: { xs: "100%", sm: "25%" },
                        textAlign: { xs: "left", sm: "center" },
                      }}
                    >
                      {transaction.merchant_type}
                    </Typography>
                    <Typography
                      sx={{
                        color: getStatusColor(transaction.transaction_status),
                        width: { xs: "100%", sm: "15%" },
                        textAlign: { xs: "left", sm: "center" },
                      }}
                    >
                      ${transaction.transaction_amount.toFixed(2)}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#BBB",
                        width: { xs: "100%", sm: "35%" },
                        textAlign: { xs: "left", sm: "center" },
                      }}
                    >
                      {`${transaction.card_type} •••• ${transaction.card_number.slice(
                        -4
                      )}`}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#BBB",
                        width: { xs: "100%", sm: "25%" },
                        textAlign: { xs: "left", sm: "right" },
                      }}
                    >
                      {transaction.transaction_id}
                    </Typography>
                  </Box>
                ))}


              {/* Expand/Collapse Button */}
              <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                <IconButton
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                  sx={{
                    backgroundColor: "#333",
                    color: "white",
                    "&:hover": { backgroundColor: "#555" },
                    borderRadius: "50%",
                  }}
                >
                  <ExpandMoreIcon
                    sx={{
                      transform: showAllTransactions
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default HomePage;
