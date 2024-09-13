import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Avatar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputBase,
} from "@mui/material";
import {
  Search,
  NoteAlt,
  ShowChart,
  Public,
  Email,
  Menu,
  FilterList,
  Message,
  MoreHoriz,
  PersonAdd,
  PersonRemove,
  Block,
  Flag,
  Close,
} from "@mui/icons-material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import FilterOverlay from "./FilterOverlay";
import DatePickerOverlay from "./DatePickerOverlay";

// Follow/Unfollow dialog
const FollowUnfollowDialog = ({
  open,
  onClose,
  isFollowing,
  onFollowToggle,
  onFlag,
  onBlock,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    sx={{
      "& .MuiBackdrop-root": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      },
      "& .MuiDialog-paper": {
        borderRadius: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "10px",
        maxWidth: "250px",
        width: "100%",
        textAlign: "center",
      },
    }}
  >
    <List>
      <ListItem button onClick={onFollowToggle}>
        <ListItemIcon>
          {isFollowing ? <PersonRemove /> : <PersonAdd />}
        </ListItemIcon>
        <ListItemText primary={isFollowing ? "Unfollow User" : "Follow User"} />
      </ListItem>
      <ListItem button onClick={onFlag}>
        <ListItemIcon>
          <Flag />
        </ListItemIcon>
        <ListItemText primary="Flag User" />
      </ListItem>
      <ListItem button onClick={onBlock}>
        <ListItemIcon>
          <Block />
        </ListItemIcon>
        <ListItemText primary="Block User" />
      </ListItem>
    </List>
  </Dialog>
);

// SearchOverlay component
const SearchOverlay = ({ open, onClose }) => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
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

// Mobile Menu Overlay for Tablet and Mobile View
const CenteredMenuOverlay = ({ open, onClose, menuItems }) => (
  <Dialog
    open={open}
    onClose={onClose}
    sx={{
      "& .MuiBackdrop-root": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      },
      "& .MuiDialog-paper": {
        borderRadius: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "20px",
        maxWidth: "300px",
        width: "100%",
        textAlign: "center",
      },
    }}
  >
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.path}
          component={NavLink}
          to={item.path}
          onClick={onClose}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  </Dialog>
);

// IconButtonContainer component
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

const TopBar = ({
  user,
  userId,
  avatar,
  profileData,
  onApplyFilters, // Make sure this is passed from the parent component
  onApplyDateRange,
  onResetDateRange,
  strategies,
  isFollowing, // Pass this to manage follow/unfollow state
  onFollowToggle, // Function to toggle follow/unfollow
  onFlagUser, // Function to flag the user
  onBlockUser, // Function to block the user
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Handle for mobile/tablet menu
  const [dialogOpen, setDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Handle message button to start chat
  const handleMessageClick = () => {
    navigate(`/messages?user=${profileData?.userId}`);
  };

  const handleThreeDotClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFollowToggle = () => {
    onFollowToggle(profileData?.userId);
    handleDialogClose();
  };

  const handleFlagUser = () => {
    onFlagUser(profileData?.userId);
    handleDialogClose();
  };

  const handleBlockUser = () => {
    onBlockUser(profileData?.userId);
    handleDialogClose();
  };

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

  const handleApplyFilters = (newFilters) => {
    if (onApplyFilters) {
      onApplyFilters(newFilters);
    }
    setFilterOpen(false);
  };

  const handleResetFilters = () => {
    if (onApplyFilters) {
      onApplyFilters({
        emotions: [],
        symbols: [],
        sessions: [],
        strategies: [],
      });
    }
    handleFilterClose();
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAvatarClick = () => {
    navigate("/profile-settings");
  };

  const getTitle = () => {
    switch (location.pathname) {
      case "/notes":
        return `Hi 👋 ${user?.userId || userId}`;
      case "/community":
        return "Community";
      case "/analytics":
        return "Analytics";
      case "/messages":
        return "Messages";
      case "/profile-settings":
        return "Profile";
      default:
        return "";
    }
  };

  const menuItems = [
    { icon: <NoteAlt />, text: "My Notes", path: "/notes" },
    { icon: <ShowChart />, text: "Analytics", path: "/analytics" },
    { icon: <Public />, text: "Community", path: "/community" },
    { icon: <Email />, text: "Messages", path: "/messages" },
  ];

  const buttonStyle = {
    color: "white",
    bgcolor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    width: 40,
    height: 40,
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.2)",
    },
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
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            px: "10px",
          }}
        >
          {location.pathname.includes("/user/") ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: "51px",
                    height: "51px",
                    background:
                      "linear-gradient(180deg, #FCEBDE 0%, #F7D3BA 100%)",
                    border: "2px solid #FFFFFF",
                  }}
                  src={profileData?.avatar || avatar}
                  alt={profileData?.userName || userId}
                />
                {!isMobile && !isTablet && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", ml: "15px" }}
                  >
                    <Typography
                      sx={{
                        fontSize: isMobile ? "18px" : "22px",
                        fontFamily: "Montserrat",
                        color: "#FFFFFF",
                        fontWeight: 600,
                      }}
                    >
                      {profileData?.userName || "User"}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", ml: 2, gap: 1 }}
              >
                <IconButton sx={buttonStyle} onClick={handleMessageClick}>
                  <Message />
                </IconButton>
                <IconButton sx={buttonStyle} onClick={handleThreeDotClick}>
                  <MoreHoriz />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handleAvatarClick}>
                  <Avatar
                    sx={{
                      width: "51px",
                      height: "51px",
                      background:
                        "linear-gradient(180deg, #FCEBDE 0%, #F7D3BA 100%)",
                      border: "2px solid #FFFFFF",
                    }}
                    src={user?.avatar || avatar}
                    alt={user?.userId || userId}
                  />
                </IconButton>
                {!isMobile && !isTablet && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", ml: "15px" }}
                  >
                    <Typography
                      sx={{
                        fontSize: isMobile ? "18px" : "22px",
                        fontFamily: "Montserrat",
                        color: "#FFFFFF",
                        fontWeight: 600,
                      }}
                    >
                      {getTitle()}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", ml: 2, gap: 1 }}
              >
                <IconButton sx={buttonStyle} onClick={handleSearchClick}>
                  <Search />
                </IconButton>
                <IconButton onClick={handleFilterClick} sx={buttonStyle}>
                  <FilterList />
                </IconButton>
              </Box>
            </>
          )}
          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
          >
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

      {/* Search Overlay */}
      {searchOpen && (
        <SearchOverlay open={searchOpen} onClose={handleSearchClose} />
      )}

      {/* Filter Overlay */}
      {location.pathname === "/analytics" ||
      location.pathname === "/messages" ? (
        <DatePickerOverlay
          open={filterOpen}
          onClose={handleFilterClose}
          onApply={onApplyDateRange}
          onReset={onResetDateRange}
        />
      ) : (
        <FilterOverlay
          open={filterOpen}
          onClose={handleFilterClose}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          strategies={strategies}
        />
      )}

      {/* Follow/Unfollow Dialog */}
      <FollowUnfollowDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        onFlag={handleFlagUser}
        onBlock={handleBlockUser}
      />

      {/* Mobile Menu Overlay */}
      <CenteredMenuOverlay
        open={menuOpen}
        onClose={handleMenuToggle}
        menuItems={menuItems}
      />
    </>
  );
};

export default TopBar;
