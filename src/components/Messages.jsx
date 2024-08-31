import React, { useState } from 'react';
import { Box, Grid, Typography, Button, TextField, IconButton, Avatar, AvatarGroup } from '@mui/material';
import TopBar from './TopBar';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import DatePickerOverlay from './DatePickerOverlay'; // Import DatePickerOverlay

const sampleChats = [
  { id: 1, name: 'AxelMathilda', lastMessage: 'Yep, BTC/USD short opportunity this week.', avatar: '/api/placeholder/32/32', isActive: true },
  { id: 2, name: 'Bankman', lastMessage: 'Exactly what I am talking about and I...', avatar: '/api/placeholder/32/32' },
  { id: 3, name: 'M@rkmill', lastMessage: 'Hello, I saw your log on BTC/USD this article might be interesting to you. Let\'s connect.', avatar: '/api/placeholder/32/32', isRequest: true },
  { id: 4, name: 'Project Team', lastMessage: 'When will we do group work? It\'s been a while guys.', avatar: '/api/placeholder/32/32', isGroup: true },
  { id: 5, name: 'Hustle@cash', lastMessage: 'I can see a short opportunity for NDQ 🚀', avatar: '/api/placeholder/32/32' },
];

const Messages = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [activeChat, setActiveChat] = useState(sampleChats[0]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // State for Date Picker

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
  };

  const handleDatePickerOpen = () => {
    setIsDatePickerOpen(true);
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
  };

  const handleApplyDateRange = (startDate, endDate) => {
    console.log(`Selected date range: ${startDate} - ${endDate}`);
    // Add your logic here to filter messages based on the selected date range
    setIsDatePickerOpen(false);
  };

  return (
    <Box sx={{ bgcolor: '#FCF6F1', minHeight: '100vh' }}>
      <TopBar onDatePickerOpen={handleDatePickerOpen} />
      <Box sx={{ width: '90%', mx: 'auto', pt: '125px' }}>
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 125px)' }}>
          {/* Left Column */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            <Box sx={{ height: '100%', bgcolor: 'white', borderRadius: 5, p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {['All', 'New', 'Groups', 'Requests'].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? 'contained' : 'outlined'}
                    onClick={() => handleTabChange(tab)}
                    sx={{
                      borderRadius: '20px',
                      bgcolor: activeTab === tab ? 'black' : 'transparent',
                      color: activeTab === tab ? 'white' : 'black',
                      px: 3,
                      flexGrow: 1,
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>

              {/* Chat List */}
              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {sampleChats.map((chat) => (
                  <Box
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: chat.isActive ? 'black' : chat.isRequest ? '#FF7043' : '#F4F4F4',
                      color: chat.isActive || chat.isRequest ? 'white' : 'black',
                      borderRadius: '16px',
                      mb: 2,
                      cursor: 'pointer',
                    }}
                  >
                    {chat.isGroup ? (
                      <AvatarGroup max={3} sx={{ mr: 2 }}>
                        <Avatar src="/api/placeholder/32/32" />
                        <Avatar src="/api/placeholder/32/32" />
                        <Avatar src="/api/placeholder/32/32" />
                      </AvatarGroup>
                    ) : (
                      <Avatar src={chat.avatar} alt={chat.name} sx={{ mr: 2 }} />
                    )}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{chat.name}</Typography>
                      <Typography variant="body2" color={chat.isActive || chat.isRequest ? 'grey.300' : 'text.secondary'}>{chat.lastMessage}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            <Box sx={{ height: '100%', bgcolor: 'white', borderRadius: 5, p: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={activeChat.avatar} alt={activeChat.name} />
                  <Typography variant="h6">{activeChat.name}</Typography>
                  <IconButton sx={{ ml: 1, bgcolor: '#F5F5F5', borderRadius: '50%' }}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Chat Area */}
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, bgcolor: '#FCF6F1', p: 2, borderRadius: '20px' }}>
                {/* Chat messages would go here */}
                <Box sx={{ bgcolor: '#FFFFFF', p: 2, borderRadius: '12px', mb: 2, maxWidth: '75%' }}>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    id hate to say short it and it puts a giant boondoggle candle up or its sell the news dump candle down probably the 2 options.
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: '#FFFFFF', p: 2, borderRadius: '12px', mb: 2, maxWidth: '75%' }}>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    I’m convinced first minute Monday will start killing already
                  </Typography>
                </Box>
              </Box>

              {/* Message Input Area */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  variant="outlined"
                  placeholder="New Messages"
                  fullWidth
                  sx={{ bgcolor: '#F4F4F4', borderRadius: '50px', '& fieldset': { border: 'none' } }}
                />
                <IconButton sx={{ bgcolor: 'white', color: 'black', borderRadius: '50%', p: 1.5 }}>
                  <ImageIcon />
                </IconButton>
                <IconButton sx={{ bgcolor: 'black', color: 'white', borderRadius: '50%', p: 1.5 }}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
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

export default Messages;