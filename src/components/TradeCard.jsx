import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const TradeCard = ({ color, title, symbol, change, price1, price2, quantity, description, time, tags = [], emoji, onClick, onEdit, onDelete }) => {
  // Ensure that description is safely accessed and fallback to an empty string if undefined
  const truncatedDescription = description && description.length > 60 ? `${description.substring(0, 60)}...` : description || '';

  // State for handling the menu for the options button
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Prevent triggering the card's onClick event
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event) => {
    event.stopPropagation(); // Prevent triggering the card's onClick event
    handleMenuClose();
    onEdit();
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent triggering the card's onClick event
    handleMenuClose();
    onDelete();
  };

  return (
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
        cursor: 'pointer',
        position: 'relative', // Add relative positioning to the card container
      }}
      onClick={onClick} // Add onClick event
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', position: 'absolute', top: 25, right: 25 }}>
        <IconButton 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.7)', 
            borderRadius: '50%',
            zIndex: 10,
            marginRight: '8px', // Adjust margin between buttons
          }}
          onClick={(e) => e.stopPropagation()} // Prevents triggering the card's onClick event
        >
          <ShareIcon fontSize="small" />
        </IconButton>

        <IconButton 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.7)', 
            borderRadius: '50%',
            zIndex: 10,
          }}
          onClick={handleMenuOpen} // Opens menu on click, prevents event propagation
        >
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
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', pt: 1 }}>
        <Box sx={{ top: 15, left: 10 }}>
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
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, mt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'semibold', fontSize: '1.2rem', maxWidth: '100%' }}>{title}</Typography>
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
            {/* Ensure tags is an array and safely map over it */}
            {tags.length > 0 && tags.map((tag, index) => (
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
    </Card>
  );
};

export default TradeCard;