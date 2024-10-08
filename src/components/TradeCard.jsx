import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

const TradeCard = ({
  color,
  emotion,
  reason,
  instrument,
  profitLoss,
  entryPoint,
  exitPoint,
  positionSize,
  description,
  time,
  tags = [],
  emoji,
  onClick,
  onEdit,
  onDelete,
}) => {
  // Ensure that description is safely accessed and fallback to an empty string if undefined
  const truncatedDescription =
    description && description.length > 60
      ? `${description.substring(0, 60)}...`
      : description || "";

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
        borderRadius: "20px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        // height: '500px',
        display: "flex",
        padding: "12px",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "start",
        cursor: "pointer",
        position: "relative", // Add relative positioning to the card container
      }}
      onClick={onClick} // Add onClick event
    
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          position: "absolute",
          top: 25,
          right: 25,
        }}
      >

        <IconButton
          size="small"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            borderRadius: "50%",
            zIndex: 10,
            color: "black",
          }}
          onClick={handleMenuOpen} // Opens menu on click, prevents event propagation
        >
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          pt: 1,
        }}
      >
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
      
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, mt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'semibold', fontSize: '1.2rem', maxWidth: '100%' }}>{reason}</Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          <Chip
            label={instrument}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.7)",
              fontWeight: "bold",
              fontSize: "0.75rem",
            
            }}
          />
          <Chip
            label={profitLoss}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.7)",
              fontWeight: "bold",
              fontSize: "0.75rem",
            
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Chip
            label={entryPoint}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.7)",
              fontSize: "0.75rem",
            
            }}
          />
          <Chip
            label={exitPoint}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.7)",
              fontSize: "0.75rem",
            
            }}
          />
          <Chip
            label={positionSize}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.7)",
              fontSize: "0.75rem",
            
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ mb: 2, fontSize: '0.9rem', fontStyle: 'italic', flexGrow: 1 }}>


          {truncatedDescription}
           </Typography>


     

        <Box sx={{ mt: "auto" }}>
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 1, color: "text.secondary" }}
          >
            {time}
          </Typography>
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
    </Card>

     
       
  

      

    
    
  );
};

export default TradeCard;
