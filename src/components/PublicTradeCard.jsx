import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; 
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MailIcon from '@mui/icons-material/Mail';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { ref, update } from "firebase/database"; // Import from Realtime Database
import { realtimeDb } from "../firebase"; // Import your Realtime Database instance
import { getUserProfile, updateUserProfile, flagTrade } from '../firebaseRealtimeCrud'; // Import your Firebase CRUD
import PublicTradeCardOverlay from './PublicTradeCardOverlay';  // Adjust the path if necessary

const PublicTradeCard = ({ 
  id, 
  color, 
  title, 
  symbol, 
  change, 
  price1, 
  price2, 
  quantity, 
  description = '', 
  time, 
  tags = [], 
  emoji, 
  likes: initialLikes, 
  comments,
  commentsList = [],
  userId 
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for the menu
  const truncatedDescription =
    description && description.length > 60
      ? `${description.substring(0, 60)}...`
      : description || "";

  const truncatedTitle =
    title && title.length > 35
      ? `${title.substring(0, 35)}...`
      : title || "";

  // Handle opening and closing of the three-dot menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    let newLikes = likes;

    if (liked) {
      newLikes -= 1;
      setLiked(false);
    } else {
      newLikes += disliked ? 2 : 1;
      setLiked(true);
      setDisliked(false);
    }

    setLikes(newLikes);

    try {
      const tradeRef = ref(realtimeDb, `publicTrades/${id}`);
      await update(tradeRef, { likes: newLikes });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleDislike = async () => {
    let newLikes = likes;

    if (disliked) {
      newLikes += 1;
      setDisliked(false);
    } else {
      newLikes -= liked ? 2 : 1;
      setDisliked(true);
      setLiked(false);
    }

    setLikes(newLikes);

    try {
      const tradeRef = ref(realtimeDb, `publicTrades/${id}`);
      await update(tradeRef, { likes: newLikes });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Handle comment overlay opening
  const handleCommentClick = () => {
    setIsOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
  };

  // Handle share action (copy link to clipboard)
  const handleShare = () => {
    const cardLink = `${window.location.origin}/publicTrades/${id}`;
    navigator.clipboard.writeText(cardLink);
    alert("Link copied to clipboard");
    handleMenuClose();
  };

  const handleBookmark = async () => {
    try {
      // Retrieve the user profile
      const userProfile = await getUserProfile(userId); // Assume userId is passed as a prop
      const bookmarks = userProfile.bookmarks || [];  // Existing bookmarks or an empty array

      // Check if this trade is already bookmarked
      const isBookmarked = bookmarks.some(bookmark => bookmark.id === id);
      if (isBookmarked) {
        alert("This trade is already bookmarked.");
        handleMenuClose();
        return;
      }

      // Add the new bookmark
      const newBookmark = { id, title, emoji, description, color, tags };

      // Update the user's bookmarks
      const updatedBookmarks = [...bookmarks, newBookmark];

      // Update the user profile in Firebase
      await updateUserProfile(userId, { bookmarks: updatedBookmarks });

      alert("Trade bookmarked");
      handleMenuClose();
    } catch (error) {
      console.error("Error bookmarking trade:", error);
    }
  };

  // Handle flagging a trade
  const handleFlag = async () => {
    await flagTrade(id, userId); // Assuming flagTrade increments the flag count
    alert("Trade flagged");
    handleMenuClose();
  };

  return (
    <>
      <Card 
        sx={{ 
          backgroundColor: color, 
          borderRadius: '20px', 
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          height: '100%',
          display: 'flex',
          padding: '12px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'start',
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', pt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography 
              sx={{ 
                fontSize: '3rem', 
                lineHeight: 1,
                mb: 1,
                filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))'
              }}
            >
              {emoji}
            </Typography>

            {/* Three-dot menu */}
            <IconButton 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 15, 
                right: 15, 
                backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                borderRadius: '50%',
                zIndex: 10,
              }}
              onClick={handleMenuOpen}
            >
              <MoreHorizOutlinedIcon fontSize="small" />
            </IconButton>

            {/* Menu for Share, Bookmark, and Flag options */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <MenuItem onClick={handleShare}>Share</MenuItem>
              <MenuItem onClick={handleBookmark}>Bookmark</MenuItem>
              <MenuItem onClick={handleFlag}>Flag</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, mt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'semibold', fontSize: '1.2rem', maxWidth: '100%' }}>{truncatedTitle}</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Chip 
              label={symbol} 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.7)', 
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }} 
            />
            <Chip 
              label={change} 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.7)', 
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }} 
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip label={price1} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }} />
            <Chip label={price2} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }} />
            <Chip label={quantity} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }} />
          </Box>

          <Typography variant="body2" sx={{ mb: 2, fontSize: '0.9rem', fontStyle: 'italic', flexGrow: 1 }}>
            {truncatedDescription}
          </Typography>

          <Box sx={{ mt: 'auto' }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>{time}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.7)', 
                    fontSize: '0.7rem',
                    height: '20px',
                  }} 
                />
              ))}
            </Box>
          </Box>
        </CardContent>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '5px 15px', 
            backgroundColor: 'transparent',
            borderRadius: '25px', 
            width: '100%',
            mb: 1,
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: 'transparent',
              borderRadius: '50px',
              padding: '1px 3px',
              border: '1px solid rgba(255,255,255,0.5)', 
              flex: 'none',  
              justifyContent: 'space-between',
            }}
          >
            <IconButton sx={{ color: liked ? 'yellow' : 'rgba(255,255,255,0.8)' }} onClick={handleLike}>
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255,255,255,0.8)' }}>
              {likes}
            </Typography>
            <Box sx={{ mx: 1, height: '80%', width: '1px', backgroundColor: 'rgba(255,255,255,0.5)' }} />
            <IconButton sx={{ color: disliked ? 'red' : 'rgba(255,255,255,0.8)' }} onClick={handleDislike}>
              <ThumbDownIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: 'transparent',
              borderRadius: '50px',
              padding: '1px 12px',
              border: '1px solid rgba(255,255,255,0.5)', 
              flex: 'none', 
              justifyContent: 'space-between',
            }}
            onClick={handleCommentClick}
          >
            <IconButton sx={{ color: 'rgba(255,255,255,0.8)' }}>
              <MailIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ ml: 1, color: 'rgba(255,255,255,0.8)' }}>
              {comments}
            </Typography>
          </Box>
        </Box>
      </Card>

      {isOverlayOpen && (
        <PublicTradeCardOverlay 
          card={{ 
            color, 
            title, 
            symbol, 
            change, 
            price1, 
            price2, 
            quantity, 
            description, 
            time, 
            tags, 
            emoji, 
            likes, 
            comments,
            commentsList, 
            userId, 
            liked, 
            disliked 
          }} 
          onClose={handleOverlayClose} 
        />
      )}
    </>
  );
};

export default PublicTradeCard;