      import React, { useState, useEffect } from 'react';
      import { Box, Grid, Typography, Card, List, ListItem, ListItemText } from '@mui/material';
      import { Doughnut, Bar } from 'react-chartjs-2';
      import ChartDataLabels from 'chartjs-plugin-datalabels';
      import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
      import PieChartIcon from '@mui/icons-material/PieChart';
      import {
        Chart as ChartJS,
        ArcElement,
        Tooltip,
        Legend,
        CategoryScale,
        LinearScale,
        BarElement,
      } from 'chart.js';
      import TopBar from './TopBar';
      import BottomBar from './BottomBar';
      import TradeForm from './TradeForm';
      import DatePickerOverlay from './DatePickerOverlay';
      import { getUserTrades } from '../firebaseRealtimeCrud'; // Import the Firebase function to fetch trades

      // Register the required components
      ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, CategoryScale, LinearScale, BarElement);

      const Analytics = ({ userId }) => {
        const [selectedEmotion, setSelectedEmotion] = useState(null);
        const [isFormOpen, setIsFormOpen] = useState(false);
        const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
        const [selectedDateRange, setSelectedDateRange] = useState({
          startDate: null,
          endDate: null,
        });

        const [tradeNotes, setTradeNotes] = useState([]); // Hold fetched trades
        const [topInstruments, setTopInstruments] = useState([]);
        const [topStrategies, setTopStrategies] = useState([]);

        useEffect(() => {
          const fetchTrades = async () => {
            if (!userId) return;

            try {
              const trades = await getUserTrades(userId); // Fetch user's trades from Firebase
              setTradeNotes(trades || []); // Set trades or fallback to empty array
              calculateTopInstruments(trades || []);
              calculateTopStrategies(trades || []);
            } catch (error) {
              console.error('Error fetching trade notes:', error);
            }
          };

          fetchTrades();
        }, [userId]);

        // Function to calculate the top 5 instruments dynamically based on the trades
        const calculateTopInstruments = (trades) => {
          const instrumentCounts = {};

          trades.forEach((trade) => {
            const instrument = trade.symbol;
            if (instrument) {
              instrumentCounts[instrument] = (instrumentCounts[instrument] || 0) + 1;
            }
          });

          const sortedInstruments = Object.entries(instrumentCounts)
            .sort((a, b) => b[1] - a[1]) // Sort by count
            .slice(0, 5); // Get top 5

          setTopInstruments(sortedInstruments.map(([instrument, count]) => ({
            instrument,
            trades: count,
            winRate: calculateWinRateForInstrument(trades, instrument),
          })));
        };

        // Function to calculate the win rate for a specific instrument
        const calculateWinRateForInstrument = (trades, instrument) => {
          const relevantTrades = trades.filter(trade => trade.symbol === instrument);
          const wins = relevantTrades.filter(trade => trade.profitLoss > 0).length;
          return relevantTrades.length > 0 ? Math.round((wins / relevantTrades.length) * 100) : 0;
        };

        // Function to calculate the top 5 strategies dynamically based on the trades
        const calculateTopStrategies = (trades) => {
          const strategyCounts = {};

          trades.forEach((trade) => {
            const strategies = trade.tags || []; // Assuming tags are stored as an array in trade data
            strategies.forEach((strategy) => {
              strategyCounts[strategy] = (strategyCounts[strategy] || 0) + 1;
            });
          });

          const sortedStrategies = Object.entries(strategyCounts)
            .sort((a, b) => b[1] - a[1]) // Sort by count
            .slice(0, 5); // Get top 5

          setTopStrategies(sortedStrategies.map(([strategy, count]) => ({
            strategy,
            trades: count,
            winRate: calculateWinRateForStrategy(trades, strategy),
          })));
        };

        // Function to calculate the win rate for a specific strategy
        const calculateWinRateForStrategy = (trades, strategy) => {
          const relevantTrades = trades.filter(trade => trade.tags && trade.tags.includes(strategy));
          const wins = relevantTrades.filter(trade => trade.profitLoss > 0).length;
          return relevantTrades.length > 0 ? Math.round((wins / relevantTrades.length) * 100) : 0;
        };

        // Default values for analytics when no user data is present
        const defaultMoods = [
          { emotion: 'Frustrated', trades: 0, winRate: 0 },
          { emotion: 'Anxious', trades: 0, winRate: 0 },
          { emotion: 'Calm', trades: 0, winRate: 0 },
          { emotion: 'Confident', trades: 0, winRate: 0 },
          { emotion: 'Greedy', trades: 0, winRate: 0 },
        ];

        const defaultSessions = [
          { sessionName: 'Morning Session', trades: 0, winRate: 0 },
          { sessionName: 'Midday Session', trades: 0, winRate: 0 },
          { sessionName: 'Afternoon Session', trades: 0, winRate: 0 },
          { sessionName: 'Evening Session', trades: 0, winRate: 0 },
          { sessionName: 'Late Session', trades: 0, winRate: 0 },
        ];

        const doughnutData = {
          labels: ['Frustrated', 'Anxious', 'Calm', 'Confident', 'Greedy'],
          datasets: [{
            data: [0, 0, 0, 0, 0], // Default to 0 until user creates trades
            backgroundColor: ['#C1BCBC', '#F5BCBB', '#D0E9BC', '#B0DCF0', '#F5E0B2'],
          }],
        };

        const doughnutOptions = {
          plugins: {
            legend: {
              display: false, // Disable the legend
            },
            datalabels: {
              color: '#fff',
              font: {
                size: 35,
              },
              formatter: (value, context) => {
                return context.chart.data.labels[context.dataIndex];
              },
            },
          },
          cutout: '60%',
        };

        // Function to handle date picker overlay
        const handleDatePickerOpen = () => {
          setIsDatePickerOpen(true);
        };

        const handleDatePickerClose = () => {
          setIsDatePickerOpen(false);
        };

        const handleApplyDateRange = (range) => {
          setSelectedDateRange(range);
          console.log("Selected date range:", range);
        };

        const handleEmotionSelect = (emotion) => {
          setSelectedEmotion(emotion);
          setIsFormOpen(true);
        };

        const handleFormClose = () => {
          setIsFormOpen(false);
          setSelectedEmotion(null);
        };

        // Handle form save (stub, actual save logic can go here)
        const handleFormSave = (tradeData) => {
          console.log("Trade saved:", tradeData);
          handleFormClose();
        };

        return (
          <Box sx={{ bgcolor: '#FCF6F1', minHeight: '100vh', pb: '100px' }}>
            <TopBar onDatePickerOpen={handleDatePickerOpen} />
            <Box sx={{ width: '90%', mx: 'auto', pt: '125px' }}>

              {/* Emotion Cards */}
              <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                {defaultMoods.map((mood, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                    <Card sx={{
                      padding: 3,
                      textAlign: 'center',
                      bgcolor: getColorForEmotion(mood.emotion),
                      borderRadius: '20px',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}>
                      <Typography variant="h6" sx={{ fontSize: '4rem', marginBottom: '2px' }}>
                        {getEmojiForEmotion(mood.emotion)}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        {mood.emotion}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '10px' }}>
                        <Box sx={{
                          textAlign: 'center',
                          bgcolor: 'white',
                          padding: '10px',
                          borderRadius: '12px',
                          minWidth: '80px',
                        }}>
                          <PieChartIcon sx={{ fontSize: 20, color: '#FFC107', marginBottom: '2px' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{mood.trades}</Typography>
                          <Typography variant="caption" sx={{ color: '#555' }}>Trades</Typography>
                        </Box>
                        <Box sx={{
                          textAlign: 'center',
                          bgcolor: 'white',
                          padding: '10px',
                          borderRadius: '12px',
                          minWidth: '80px',
                        }}>
                          <EmojiEventsIcon sx={{ fontSize: 20, color: '#4CAF50', marginBottom: '2px' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{mood.winRate}%</Typography>
                          <Typography variant="caption" sx={{ color: '#555' }}>Win Rate</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Mood per Session */}
              <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                <Grid item xs={12} md={8}>
                  <Card sx={{
                    padding: 3,
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: '25px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  }}>
                    <Typography variant="h6" sx={{ marginBottom: 3 }}>Mood per Session</Typography>
                    <Bar
                      data={{
                        labels: defaultSessions.map(session => session.sessionName),
                        datasets: defaultMoods.map((mood, i) => ({
                          label: mood.emotion,
                          backgroundColor: getColorForEmotion(mood.emotion),
                          data: defaultSessions.map(session => session.trades),
                        })),
                      }}
                      options={{
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          x: { stacked: true },
                          y: { stacked: true },
                        },
                      }}
                    />
                  </Card>
                </Grid>

                {/* Mood in the Nutshell */}
                <Grid item xs={12} md={4}>
                  <Card sx={{
                    padding: 3,
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: '25px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  }}>
                    <Typography variant="h6" sx={{ marginBottom: 3 }}>Mood in the Nutshell</Typography>
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </Card>
                </Grid>
              </Grid>

              {/* Top Sessions, Instruments, Strategies */}
              <Grid container spacing={3}>
                {/* Top Sessions */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ padding: 3, borderRadius: '24px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>Top Sessions</Typography>
                    <List sx={{ p: 0 }}>
                      {defaultSessions.map((session, index) => (
                        <ListItem key={index} sx={{ padding: 2, mb: 2, borderRadius: '16px', bgcolor: '#FFF', border: '1px solid #E0E0E0' }}>
                          <Box sx={{ bgcolor: '#FFD700', width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', mr: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFF' }}>{index + 1}</Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{session.sessionName}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>📊 {session.trades} Trades</Typography>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>🏆 {session.winRate}% Win Rate</Typography>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>

                {/* Top Instruments */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ padding: 3, borderRadius: '24px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>Top Instruments</Typography>
                    <List sx={{ p: 0 }}>
                      {topInstruments.length > 0 ? (
                        topInstruments.map((instrument, index) => (
                          <ListItem key={index} sx={{ padding: 2, mb: 2, borderRadius: '16px', bgcolor: '#FFF', border: '1px solid #E0E0E0' }}>
                            <Box sx={{ bgcolor: '#FFD700', width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', mr: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFF' }}>{index + 1}</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{instrument.instrument}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>📊 {instrument.trades} Trades</Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>🏆 {instrument.winRate}% Win Rate</Typography>
                              </Box>
                            </Box>
                          </ListItem>
                        ))
                      ) : (
                        <Typography>No trade notes available for instruments.</Typography>
                      )}
                    </List>
                  </Card>
                </Grid>

                {/* Top Strategies */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ padding: 3, borderRadius: '24px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>Top Strategies</Typography>
                    <List sx={{ p: 0 }}>
                      {topStrategies.length > 0 ? (
                        topStrategies.map((strategy, index) => (
                          <ListItem key={index} sx={{ padding: 2, mb: 2, borderRadius: '16px', bgcolor: '#FFF', border: '1px solid #E0E0E0' }}>
                            <Box sx={{ bgcolor: '#FFD700', width: 32, height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', mr: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFF' }}>{index + 1}</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{strategy.strategy}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>📊 {strategy.trades} Trades</Typography>
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>🏆 {strategy.winRate}% Win Rate</Typography>
                              </Box>
                            </Box>
                          </ListItem>
                        ))
                      ) : (
                        <Typography>No trade notes available for strategies.</Typography>
                      )}
                    </List>
                  </Card>
                </Grid>
              </Grid>

              <BottomBar onCreateTradeCard={handleEmotionSelect} />
              {isFormOpen && (
                <TradeForm
                  emotion={selectedEmotion}
                  onClose={handleFormClose}
                  onSave={handleFormSave}
                />
              )}
            </Box>

            {/* Date Picker Overlay */}
            <DatePickerOverlay 
              open={isDatePickerOpen} 
              onClose={handleDatePickerClose} 
              onApply={handleApplyDateRange} 
            />
          </Box>
        );
      };

      // Helper functions for color and emoji mapping
      const getColorForEmotion = (emotion) => {
        switch (emotion) {
          case 'Frustrated': return '#C1BCBC';
          case 'Anxious': return '#F5BCBB';
          case 'Calm': return '#D0E9BC';
          case 'Confident': return '#B0DCF0';
          case 'Greedy': return '#F5E0B2';
          default: return '#FFFFFF';
        }
      };

      const getEmojiForEmotion = (emotion) => {
        switch (emotion) {
          case 'Frustrated': return '😠';
          case 'Anxious': return '🤯';
          case 'Calm': return '😊';
          case 'Confident': return '😎';
          case 'Greedy': return '🤑';
          default: return '😊';
        }
      };

      export default Analytics;
