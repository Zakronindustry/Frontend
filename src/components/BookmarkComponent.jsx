import React, { useState, useEffect } from 'react';
import { Grid, Typography, IconButton, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Divider } from '@mui/material';
import PublicTradeCard from './PublicTradeCard'; // Import the existing PublicTradeCard component
import DeleteIcon from '@mui/icons-material/Delete';
import { updateUserProfile } from '../firebaseRealtimeCrud'; // Import your Firebase CRUD

const BookmarkComponent = ({ user }) => {
  const [bookmarkedTrades, setBookmarkedTrades] = useState(user?.bookmarks || []);
  const [tradeToRemove, setTradeToRemove] = useState(null); // Track the trade to remove
  const [openDialog, setOpenDialog] = useState(false); // State to manage confirmation dialog

  // Function to handle the removal of a bookmark after confirmation
  const handleRemoveBookmark = async (tradeId) => {
    const updatedBookmarks = bookmarkedTrades.filter(trade => trade.id !== tradeId);
    setBookmarkedTrades(updatedBookmarks);

    // Update user's profile in Firebase
    await updateUserProfile(user.userId, { bookmarks: updatedBookmarks });

    setOpenDialog(false); // Close the confirmation dialog
  };

  // Open confirmation dialog
  const openRemoveDialog = (tradeId) => {
    setTradeToRemove(tradeId);
    setOpenDialog(true);
  };

  // Close confirmation dialog
  const closeRemoveDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 0 }}>
      <Typography sx={{ mb: 2 }} variant="h6" gutterBottom>Bookmarks</Typography>
      <Divider sx={{ mb: 3 }} />

      {/* No Bookmarks Message */}
      {bookmarkedTrades.length === 0 ? (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 5 }}>
          You have no bookmarks yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookmarkedTrades.map((trade) => (
            <Grid item xs={12} sm={6} md={4} key={trade.id}>
              <Box sx={{ position: 'relative' }}>
                {/* Render PublicTradeCard */}
                <PublicTradeCard 
                  id={trade.id}
                  color={trade.color}
                  title={trade.title}
                  symbol={trade.symbol}
                  change={trade.change}
                  price1={trade.price1}
                  price2={trade.price2}
                  quantity={trade.quantity}
                  description={trade.description}
                  time={trade.time}
                  tags={trade.tags}
                  emoji={trade.emoji}
                  likes={trade.likes}
                  comments={trade.comments}
                  commentsList={trade.commentsList}
                  userId={trade.userId}
                />
                {/* Delete bookmark button */}
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                  }}
                  onClick={() => openRemoveDialog(trade.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={closeRemoveDialog}
      >
        <DialogTitle>Remove Bookmark</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this trade from your bookmarks?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRemoveDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => handleRemoveBookmark(tradeToRemove)} 
            color="error" 
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookmarkComponent;
