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
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
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
  Add,
  Message,
  MoreHoriz,
} from "@mui/icons-material";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import FilterOverlay from "./FilterOverlay";
import DatePickerOverlay from "./DatePickerOverlay";
import NotificationOverlay from "./NotificationOverlay";

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

const TopBar = ({
  user,
  profileData,
  onApplyFilters,
  onApplyDateRange,
  onResetDateRange,
  strategies,
}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (notificationOpen && user?.userId) {
      fetchNotifications();
    }
  }, [notificationOpen]);

  const fetchNotifications = async () => {
    const fetchedNotifications = await getNotifications(user.userId);
    setNotifications(
      Object.entries(fetchedNotifications || {}).map(([id, data]) => ({
        id,
        ...data,
      })),
    );
  };

  const handleNotificationClick = () => {
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    if (user?.userId) {
      await markNotificationAsRead(user.userId, notificationId);
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    }
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

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  const handleApplyFilters = (newFilters) => {
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

  const handleAvatarClick = () => {
    navigate("/profile-settings"); // Navigate to the profile settings page
  };

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
      case "/profile-settings":
        return "Profile";
      default:
        return "";
    }
  };

  const menuItems = [
    { icon: <NoteAlt />, text: "My Notes", path: "/" },
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
                  src={profileData?.avatar || "avatar"}
                  alt={profileData?.userName || "User"}
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
                <IconButton sx={buttonStyle}>
                  <Add />
                </IconButton>
                <IconButton sx={buttonStyle}>
                  <Message />
                </IconButton>
                <IconButton sx={buttonStyle}>
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
                    src={user?.avatar || "avatar"}
                    alt={user?.userId || "User"}
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
                <IconButton sx={buttonStyle} onClick={handleNotificationClick}>
                  <Notifications />
                </IconButton>
                <IconButton onClick={handleSearchClick} sx={buttonStyle}>
                  <Search />
                </IconButton>
                {location.pathname === "/analytics" ||
                location.pathname === "/messages" ? (
                  <IconButton onClick={handleFilterClick} sx={buttonStyle}>
                    <FilterList />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleFilterClick} sx={buttonStyle}>
                    <FilterList />
                  </IconButton>
                )}
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

      <SearchOverlay open={searchOpen} onClose={handleSearchClose} />
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

      <CenteredMenuOverlay
        open={menuOpen}
        onClose={handleMenuToggle}
        menuItems={menuItems}
      />
      {notificationOpen && (
        <NotificationOverlay
          notifications={notifications}
          onClose={handleNotificationClose}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </>
  );
};

export default TopBar;
