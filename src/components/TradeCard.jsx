import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

const TradeCard = ({ color, title, symbol, change, price1, price2, quantity, description, time, tags, emoji }) => (
  <Card sx={{ 
    backgroundColor: color, 
    borderRadius: '20px', 
    boxShadow: 'none',
    height: '100%',
    display: 'flex',
    padding: '12px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
  }}>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', pt: 1 }}>
      <Box sx={{top: 15, left: 10 }}>
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

      <Typography variant="body2" sx={{ mb: 2, fontSize: '0.9rem', fontStyle: 'italic', flexGrow: 1 }}>{description}</Typography>

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
  </Card>
);

export default TradeCard;
