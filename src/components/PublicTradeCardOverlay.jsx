import React, { useState } from 'react';
import { Box, Typography, Card, IconButton, Chip, Avatar, TextField, Button, Menu, MenuItem, Link as MuiLink } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { updateTrade, flagTrade, updateUserProfile } from '../firebaseRealtimeCrud'; // Ensure updateTrade, flagTrade, and updateUserProfile are imported

const PublicTradeCardOverlay = ({ card, onClose, userId }) => {
  const [likes, setLikes] = useState(card.likes || 0);
  const [dislikes, setDislikes] = useState(card.dislikes || 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Handle the menu open/close logic
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle liking the trade
  const handleLike = async () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    await updateTrade(card.userId, card.id, { likes: newLikes });
  };

  // Handle disliking the trade
  const handleDislike = async () => {
    const newDislikes = dislikes + 1;
    setDislikes(newDislikes);
    await updateTrade(card.userId, card.id, { dislikes: newDislikes });
  };

  // Handle sharing the trade
  const handleShare = () => {
    const cardLink = `${window.location.origin}/publicTrades/${id}`;
    navigator.clipboard.writeText(cardLink);
    alert('Link copied to clipboard');
    handleMenuClose();
  };

  // Handle bookmarking the trade
  const handleBookmark = async () => {
    try {
      const userProfile = await getUserProfile(userId); // Fetch the user's profile
      const bookmarks = userProfile.bookmarks || [];

      // Check if the card is already bookmarked
      const isBookmarked = bookmarks.some(bookmark => bookmark.id === card.id);
      if (isBookmarked) {
        alert('This trade is already bookmarked.');
      } else {
        const newBookmark = { id: card.id, emotion: card.emotion, reason: card.title, emoji: card.emoji, description: card.description, color: card.color, tags: card.tags };
        const updatedBookmarks = [...bookmarks, newBookmark];

        // Update Firebase
        await updateUserProfile(userId, { bookmarks: updatedBookmarks });
        alert('Trade bookmarked');
      }

      handleMenuClose();
    } catch (error) {
      console.error('Error bookmarking trade:', error);
      alert('Error occurred while bookmarking.');
    }
  };

  // Handle flagging the trade
  const handleFlagTrade = async () => {
    await flagTrade(card.id, userId); // Flagging the trade with the user's ID
    alert('Trade flagged');
    handleMenuClose();
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1300,
      padding: '20px',
    }}>
      <Card sx={{ 
        maxWidth: '1000px', 
        width: '100%', 
        height: '95vh',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Trade Overview Section */}
        <Box sx={{ 
          width: '55%', 
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: card.color,
          borderRadius: '20px 0 0 20px',
          overflowY: 'auto'
        }}>
          <Box sx={{ fontSize: '3rem', marginBottom: '10px' }}>
            {card.emoji}
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontWeight: 'light' }}>By </Typography>
            <MuiLink 
              component={Link} 
              to={`/user/${card.userId}`} 
              sx={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}
            >
              {card.userId}
            </MuiLink>
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            {card.reason}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={card.instrument} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: '0.75rem' }} />
            <Chip label={card.profitLoss} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: '0.75rem' }} />
            <Chip label={card.entryPoint} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }} />
            <Chip label={card.exitPoint} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }} />
            <Chip label={card.positionSize} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }} />
          </Box>

          <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
            {card.description}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1 }}>
            {card.time}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {card.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', height: '20px' }} 
              />
            ))}
          </Box>
        </Box>

        {/* Comment Section */}
        <Box sx={{ width: '45%', display: 'flex', flexDirection: 'column', backgroundColor: '#FCF6F1', borderRadius: '0 20px 20px 0' }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '10px 10px', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleLike}>
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption">{likes}</Typography>
              <IconButton onClick={handleDislike}>
                <ThumbDownIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption">{dislikes}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    borderRadius: '10px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <MenuItem onClick={handleShare}>Share</MenuItem>
                <MenuItem onClick={handleBookmark}>Bookmark</MenuItem>
                <MenuItem onClick={handleFlagTrade}>Flag Trade</MenuItem>
              </Menu>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Comments List */}
          <Box sx={{ flexGrow: 1, padding: '10px 20px', overflowY: 'auto' }}>
            {card.commentsList && card.commentsList.map((comment, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{comment.userInitials}</Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{comment.userName}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{comment.text}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{comment.time}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Footer */}
          <Box sx={{ 
            padding: '20px 20px', 
            display: 'flex', 
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <TextField
              variant="outlined"
              placeholder="Have something to say?"
              fullWidth
              sx={{ 
                backgroundColor: 'white', 
                borderRadius: '25px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
            />
            <Button 
              variant="contained" 
              sx={{ 
                marginLeft: '10px', 
                borderRadius: '25px',
                minWidth: '48px',
                width: '48px',
                height: '48px',
                padding: 0
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default PublicTradeCardOverlay;
