import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Avatar,
  Typography,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Notifications,
  Search,
  NoteAlt,
  ShowChart,
  Public,
  Email,
  Menu,
  FilterList,
  Close,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { getUserProfile } from '../firebaseRealtimeCrud';
import FilterOverlay from "./FilterOverlay";

const IconButtonContainer = ({ to, children, isActive }) => (
  <NavLink to={to} style={{ textDecoration: "none" }}>
    <Box
      sx={{
        width: "51px",
        height: "51px",
        background: isActive ? "#FFFFFF" : "transparent",
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

const SearchOverlay = ({ open, onClose }) => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      zIndex: 1300,
      display: open ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: "80%",
        maxWidth: 600,
        bgcolor: "white",
        borderRadius: 25,
        p: 2,
        display: "flex",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <Search />
      </IconButton>
      <IconButton onClick={onClose}>
        <Close />
      </IconButton>
    </Box>
  </Box>
);

const TopBar = ({ user, onApplyFilters, strategies }) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  const handleApplyFilters = (newFilters) => {
    console.log("Filters applied:", newFilters);
    if (onApplyFilters) {
      onApplyFilters(newFilters);
    }
    setFilterOpen(false);
    handleFilterClose();
  };

  const handleResetFilters = () => {
    onApplyFilters({ emotions: [], symbols: [], sessions: [], strategies: [] });
    handleFilterClose();
  };

  const menuItems = [
    { icon: <NoteAlt />, text: "Notes", path: "/" },
    { icon: <ShowChart />, text: "Analytics", path: "/analytics" },
    { icon: <Public />, text: "Community", path: "/community" },
    { icon: <Email />, text: "Messages", path: "/messages" },
  ];

  const buttonStyle = {
    color: "white",
    bgcolor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    width: 40,
    height: 40,
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.2)',
    },
  };

  // Determine the title based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return `Hi 👋 ${user?.userId || "User"}`; // Greet with user ID on the Dashboard
      case "/community":
        return "Community";
      case "/analytics":
        return "Analytics";
      case "/messages":
        return "Messages";
      default:
        return "";
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "95%",
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
            alignItems: "center",
            height: "100%",
            px: "10px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: "51px",
                height: "51px",
                background: "linear-gradient(180deg, #FCEBDE 0%, #F7D3BA 100%)",
                border: "2px solid #FFFFFF",
              }}
              src={user?.avatar || "avatar"}
              alt={user?.userId || "User"}
            />
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", ml: "15px" }}>
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontFamily: "Montserrat",
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                >
                  {getTitle()} {/* Render the appropriate title */}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", ml: 2, gap: 1 }}>
              <IconButton sx={buttonStyle}>
                <Notifications />
              </IconButton>
              <IconButton onClick={handleSearchClick} sx={buttonStyle}>
                <Search />
              </IconButton>
              <IconButton onClick={handleFilterClick} sx={buttonStyle}>
                <FilterList />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {(isMobile || isTablet) && (
              <IconButton onClick={handleMenuToggle} sx={buttonStyle}>
                <Menu />
              </IconButton>
            )}
            {!isMobile && !isTablet && (
              <Box sx={{ display: "flex" }}>
                {menuItems.map((item) => (
                  <IconButtonContainer
                    key={item.path}
                    to={item.path}
                    isActive={location.pathname === item.path}
                  >
                    {item.icon}
                  </IconButtonContainer>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </AppBar>

      <SearchOverlay open={searchOpen} onClose={handleSearchClose} />
      <FilterOverlay 
        open={filterOpen} 
        onClose={handleFilterClose} 
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        strategies={strategies} 
      />

      <Drawer anchor="right" open={menuOpen} onClose={handleMenuToggle}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={handleMenuToggle}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default TopBar;
