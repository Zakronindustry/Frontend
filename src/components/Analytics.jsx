import React, { useState } from 'react';
import { Box, Grid, Typography, Card, List, ListItem, ListItemText } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PieChartIcon from '@mui/icons-material/PieChart';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import TradeForm from './TradeForm';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Analytics = () => {
  const moods = [
    { emoji: '😠', label: 'Frustrated', trades: 19, avgPL: '-$4,579', winRate: '32%', bgColor: '#d3d3d3' },
    { emoji: '🤯', label: 'Anxious', trades: 18, avgPL: '+$1,572', winRate: '42%', bgColor: '#F5BCBB' },
    { emoji: '😊', label: 'Calm', trades: 21, avgPL: '+$1,645', winRate: '79%', bgColor: '#D0E9BC' },
    { emoji: '😎', label: 'Confident', trades: 15, avgPL: '+$4,855', winRate: '86%', bgColor: '#B0DCF0' },
    { emoji: '🤑', label: 'Greedy', trades: 23, avgPL: '+$1,479', winRate: '52%', bgColor: '#F5E0B2' },
  ];

  const topSessions = [
    { session: 'Morning Session', avgPL: '+$6K', trades: 27, win: '72%', bgColor: '#ffeb99' },
    { session: 'After-hours Session', avgPL: '+$3K', trades: 12, win: '68%', bgColor: '#d9d9d9' },
    { session: 'Afternoon Session', avgPL: '+$679', trades: 8, win: '66%', bgColor: '#ffcc99' },
  ];

  const topInstruments = [
    { instrument: 'USD/CAD', avgPL: '+$6K', trades: 27, win: '72%', bgColor: '#ffeb99' },
    { instrument: 'BTC/USD', avgPL: '+$3K', trades: 12, win: '68%', bgColor: '#d9d9d9' },
    { instrument: 'EUR/GBP', avgPL: '+$679', trades: 8, win: '66%', bgColor: '#ffcc99' },
  ];

  const topStrategies = [
    { strategy: 'News-Driven', avgPL: '+$6K', trades: 27, win: '72%', bgColor: '#ffeb99' },
    { strategy: 'Trend Following', avgPL: '+$3K', trades: 12, win: '68%', bgColor: '#d9d9d9' },
    { strategy: 'Breakout', avgPL: '+$679', trades: 8, win: '66%', bgColor: '#ffcc99' },
  ];

  const doughnutData = {
    labels: ['😠', '🤯', '😊', '😎', '🤑'],
    datasets: [{
      data: [10, 5, 40, 30, 15],
      backgroundColor: ['#C1BCBC', '#F5BCBB', '#D0E9BC', '#B0DCF0', '#F5E0B2'],
    }],
  };

  const options = {
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

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEmotion(null);
  };

  const handleFormSave = (tradeData) => {
    const newTradeCard = {
      ...tradeData,
      emotion: selectedEmotion,
      color: getColorForEmotion(selectedEmotion),
      emoji: getEmojiForEmotion(selectedEmotion),
      isPublic: true,
    };
    setAllTradeCards([newTradeCard, ...allTradeCards]); // Update allTradeCards
    handleFormClose();
  };

  const getColorForEmotion = (emotion) => {
    switch (emotion) {
      case 'Anxious': return '#F5BCBB';
      case 'Calm': return '#D0E9BC';
      case 'Confident': return '#B0DCF0';
      case 'Greedy': return '#F5E0B2';
      case 'Frustrated': return '#C1BCBC';
      default: return '#FFFFFF';
    }
  };

  const getEmojiForEmotion = (emotion) => {
    switch (emotion) {
      case 'Anxious': return '🤯';
      case 'Calm': return '😊';
      case 'Confident': return '😎';
      case 'Greedy': return '🤑';
      case 'Frustrated': return '😠';
      default: return '😊';
    }
  };

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Box sx={{ bgcolor: '#FCF6F1', minHeight: '100vh', pb: '100px' }}>
      <TopBar />
      <Box sx={{ width: '90%', mx: 'auto', pt: '125px' }}>
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          {moods.map((mood, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card sx={{
                padding: 3,
                textAlign: 'center',
                bgcolor: mood.bgColor,
                borderRadius: '20px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
                <Typography variant="h6" sx={{ fontSize: '4rem', marginBottom: '2px' }}>
                  {mood.emoji}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  {mood.label}
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
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{mood.winRate}</Typography>
                    <Typography variant="caption" sx={{ color: '#555' }}>Win Rate</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} md={8}> {/* Changed from md={6} to md={8} */}
            <Card sx={{
              padding: 3,
              textAlign: 'center',
              height: '100%',
              borderRadius: '25px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h6" sx={{ marginBottom: 3 }}>Mood per Session</Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                height: '350px',
              }}>
                {/* Session 1: 4AM - 9AM */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '18%' }}>
                  <Box sx={{ width: '100%', height: '30%', backgroundColor: '#F5E0B2', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤑 */}
                  <Box sx={{ width: '100%', height: '5%', backgroundColor: '#B0DCF0', borderRadius: '20px 20px 20px 20px' }} /> {/* 😎 */}
                  <Box sx={{ width: '100%', height: '35%', backgroundColor: '#D0E9BC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😊 */}
                  <Box sx={{ width: '100%', height: '20%', backgroundColor: '#C1BCBC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😠 */}
                  <Box sx={{ width: '100%', height: '10%', backgroundColor: '#F5BCBB', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤯 */}
                  <Typography variant="caption" sx={{ marginTop: 1 }}>4AM - 9AM</Typography>
                </Box>
                {/* Session 2: 9AM - 12PM */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '18%' }}>
                  <Box sx={{ width: '100%', height: '15%', backgroundColor: '#F5E0B2', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤑 */}
                  <Box sx={{ width: '100%', height: '30%', backgroundColor: '#B0DCF0', borderRadius: '20px 20px 20px 20px' }} /> {/* 😎 */}
                  <Box sx={{ width: '100%', height: '45%', backgroundColor: '#D0E9BC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😊 */}
                  <Box sx={{ width: '100%', height: '5%', backgroundColor: '#C1BCBC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😠 */}
                  <Box sx={{ width: '100%', height: '5%', backgroundColor: '#F5BCBB', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤯 */}
                  <Typography variant="caption" sx={{ marginTop: 1 }}>9AM - 12PM</Typography>
                </Box>
                {/* Session 3: 12PM - 2PM */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '18%' }}>
                  <Box sx={{ width: '100%', height: '5%', backgroundColor: '#F5E0B2', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤑 */}
                  <Box sx={{ width: '100%', height: '45%', backgroundColor: '#B0DCF0', borderRadius: '20px 20px 20px 20px' }} /> {/* 😎 */}
                  <Box sx={{ width: '100%', height: '35%', backgroundColor: '#D0E9BC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😊 */}
                  <Box sx={{ width: '100%', height: '10%', backgroundColor: '#C1BCBC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😠 */}
                  <Box sx={{ width: '100%', height: '5%', backgroundColor: '#F5BCBB', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤯 */}
                  <Typography variant="caption" sx={{ marginTop: 1 }}>12PM - 2PM</Typography>
                </Box>
                {/* Session 4: 2PM - 4PM */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '18%' }}>
                  <Box sx={{ width: '100%', height: '30%', backgroundColor: '#F5E0B2', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤑 */}
                  <Box sx={{ width: '100%', height: '20%', backgroundColor: '#B0DCF0', borderRadius: '20px 20px 20px 20px' }} /> {/* 😎 */}
                  <Box sx={{ width: '100%', height: '10%', backgroundColor: '#D0E9BC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😊 */}
                  <Box sx={{ width: '100%', height: '25%', backgroundColor: '#C1BCBC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😠 */}
                  <Box sx={{ width: '100%', height: '15%', backgroundColor: '#F5BCBB', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤯 */}
                  <Typography variant="caption" sx={{ marginTop: 1 }}>2PM - 4PM</Typography>
                </Box>
                {/* Session 5: 4PM - 8PM */}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', width: '18%' }}>
                  <Box sx={{ width: '100%', height: '30%', backgroundColor: '#F5E0B2', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤑 */}
                  <Box sx={{ width: '100%', height: '35%', backgroundColor: '#B0DCF0', borderRadius: '20px 20px 20px 20px' }} /> {/* 😎 */}
                  <Box sx={{ width: '100%', height: '20%', backgroundColor: '#D0E9BC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😊 */}
                  <Box sx={{ width: '100%', height: '5%', backgroundColor: '#C1BCBC', borderRadius: '20px 20px 20px 20px' }} /> {/* 😠 */}
                  <Box sx={{ width: '100%', height: '10%', backgroundColor: '#F5BCBB', borderRadius: '20px 20px 20px 20px' }} /> {/* 🤯 */}
                  <Typography variant="caption" sx={{ marginTop: 1 }}>4PM - 8PM</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}> {/* Changed from md={6} to md={4} */}
            <Card sx={{
              padding: 3,
              textAlign: 'center',
              height: '100%',
              borderRadius: '25px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h6" sx={{ marginBottom: 3 }}>Mood in the Nutshell</Typography>
              <Doughnut data={doughnutData} options={options} />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              padding: 3,
              borderRadius: '24px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
                Top Sessions
              </Typography>
              <List sx={{ p: 0 }}>
                {topSessions.map((session, index) => (
                  <ListItem key={index} sx={{
                    padding: 2,
                    mb: 2,
                    borderRadius: '16px',
                    bgcolor: '#FFF',
                    border: '1px solid #E0E0E0',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box sx={{
                      bgcolor: session.bgColor,
                      width: 32,
                      height: 32,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      mr: 2,
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFF' }}>
                        {index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {session.session}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          💰 {session.avgPL}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          📊 {session.trades} Trades
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          🏆 {session.winRate} Win Rate
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              padding: 3,
              borderRadius: '24px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
                Top Instruments
              </Typography>
              <List sx={{ p: 0 }}>
                {topInstruments.map((instrument, index) => (
                  <ListItem key={index} sx={{
                    padding: 2,
                    mb: 2,
                    borderRadius: '16px',
                    bgcolor: '#FFF',
                    border: '1px solid #E0E0E0',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box sx={{
                      bgcolor: instrument.bgColor,
                      width: 32,
                      height: 32,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      mr: 2,
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFF' }}>
                        {index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {instrument.instrument}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          💰 {instrument.avgPL}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          📊 {instrument.trades} Trades
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          🏆 {instrument.winRate} Win Rate
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              padding: 3,
              borderRadius: '24px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
                Top Strategies
              </Typography>
              <List sx={{ p: 0 }}>
                {topStrategies.map((strategy, index) => (
                  <ListItem key={index} sx={{
                    padding: 2,
                    mb: 2,
                    borderRadius: '16px',
                    bgcolor: '#FFF',
                    border: '1px solid #E0E0E0',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box sx={{
                      bgcolor: strategy.bgColor,
                      width: 32,
                      height: 32,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      mr: 2,
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFF' }}>
                        {index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {strategy.strategy}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          💰 {strategy.avgPL}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          📊 {strategy.trades} Trades
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          🏆 {strategy.winRate} Win Rate
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
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
    </Box>
  );
};

export default Analytics;
