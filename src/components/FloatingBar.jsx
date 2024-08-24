import React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

const FloatingBar = () => {
  return (
    <Box
      sx={{ "& > :not(style)": { m: 1 } }}
      position="fixed"
      bottom={16}
      left="50%"
      sx={{ transform: "translateX(-50%)" }}
    >
      <Fab color="error" aria-label="frustrated">
        Frustrated
      </Fab>
      <Fab color="secondary" aria-label="anxious">
        Anxious
      </Fab>
      <Fab color="success" aria-label="calm">
        Calm
      </Fab>
      <Fab color="primary" aria-label="confident">
        Confident
      </Fab>
      <Fab color="warning" aria-label="greedy">
        Greedy
      </Fab>
    </Box>
  );
};

export default FloatingBar;
