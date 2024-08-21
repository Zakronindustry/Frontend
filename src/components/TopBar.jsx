import React, { useState } from "react";
import { Box, AppBar, Avatar, Typography, IconButton, InputBase } from "@mui/material";
import {
  Notifications,
  CalendarToday,
  Search,
  NoteAlt,
  ShowChart,
  Public,
  Email,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import avatarImage from "./Avatar-5.png";
 // Adjust the path to where the avatar image is located

const IconButtonContainer = ({ to, children, isActive }) => (
  <NavLink to={to} style={{ textDecoration: "none" }}>
    <Box
      sx={{
        width: "51px",
        height: "51px",
        background: isActive ? "#FFFFFF" : "#25252700", // Transparent background when not selected
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mx: 1,
      }}
    >
      <IconButton size="large" sx={{ color: isActive ? "black" : "white" }}>
        {children}
      </IconButton>
    </Box>
  </NavLink>
);

const TopBar = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        top: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "1350px",
        height: "72px",
        background: "#000000",
        borderRadius: "50px",
        opacity: 1,
        backdropFilter: "blur(19px)",
        WebkitBackdropFilter: "blur(19px)",
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
          px: "10px",
        }}
      >
        {/* Header Box */}
        <Box sx={{ display: "flex", alignItems: "center", width: "flex" }}>
          <Avatar
            sx={{
              width: "51px",
              height: "51px",
              background: "linear-gradient(180deg, #FCEBDE 0%, #F7D3BA 100%)",
              border: "2px solid #FFFFFF",
            }}
            src={avatarImage}
            alt="User"
          />
          <Box sx={{ display: "flex", alignItems: "center", ml: "15px" }}>
            <Typography
              sx={{
                fontSize: "22px",
                fontFamily: "Montserrat",
                color: "#E8E8E8",
                mr: "7px",
              }}
            >
              Hi 👋
            </Typography>
            <Typography
              sx={{
                fontSize: "22px",
                fontFamily: "Montserrat",
                fontWeight: 600,
                color: "#FFFFFF",
              }}
            >
              Retro_D@niel!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", ml: "5px"}}>
            <IconButton
              onClick={() => alert("Notifications Clicked")} // Example action
              sx={{
                width: "34px",
                height: "34px",
                borderRadius: "50px",
                ml: "10px",
                px: "8px",
              }}
            >
              <Notifications fontSize="small" sx={{ color: "white" }} />
            </IconButton>
            <IconButton
              onClick={() => alert("Calendar Clicked")} // Example action
              sx={{
                width: "34px",
                height: "34px",
                borderRadius: "50px",
                ml: "10px",
                px: "8px",
              }}
            >
              <CalendarToday fontSize="small" sx={{ color: "white" }} />
            </IconButton>
            <Box
              sx={{
                width: searchOpen ? "300px" : "34px", // Expand when clicked
                height: "34px",
                border: "1px solid #D8D8D8",
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                ml: "13px",
                px: "10px",
                transition: "width 0.3s ease-in-out", // Smooth transition
                cursor: "pointer",
              }}
              onClick={handleSearchClick}
            >
              {searchOpen ? (
                <InputBase
                  placeholder="Search..."
                  sx={{ ml: 1, flex: 1, color: "white", fontSize: "14px" }}
                  autoFocus
                />
              ) : (
                <Search fontSize="small" sx={{ color: "white" }} />
              )}
            </Box>
          </Box>
        </Box>

        {/* Menu Box */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <IconButtonContainer to="/" isActive={location.pathname === "/"}>
            <NoteAlt />
          </IconButtonContainer>
          <IconButtonContainer
            to="/analytics"
            isActive={location.pathname === "/analytics"}
          >
            <ShowChart />
          </IconButtonContainer>
          <IconButtonContainer
            to="/community"
            isActive={location.pathname === "/community"}
          >
            <Public />
          </IconButtonContainer>
          <IconButtonContainer
            to="/messages"
            isActive={location.pathname === "/messages"}
          >
            <Email />
          </IconButtonContainer>
        </Box>
      </Box>
    </AppBar>
  );
};

export default TopBar;
