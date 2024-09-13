import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  AvatarGroup,
  Dialog,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import TopBar from "./TopBar";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import DatePickerOverlay from "./DatePickerOverlay"; // Import DatePickerOverlay
import {
  getChatByUsers,
  sendMessageToChat,
  listenToMessages,
  createChatRequest,
  getUsersList,
  addUserToGroupChat,
} from "../firebaseRealtimeCrud"; // Import Firebase helper functions

const Messages = ({ selectedUser }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeChat, setActiveChat] = useState(null); // Chat data for the active chat
  const [chatMessages, setChatMessages] = useState([]); // Messages in the current chat
  const [newMessage, setNewMessage] = useState(""); // New message being typed
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // State for Date Picker
  const [userList, setUserList] = useState([]); // List of users to add to the group
  const [openUserModal, setOpenUserModal] = useState(false); // Modal state

  // On component mount, fetch or create the chat between the logged-in user and the selected user
  useEffect(() => {
    const fetchOrCreateChat = async () => {
      if (selectedUser) {
        // Fetch the chat by user IDs (assuming you have a loggedInUser ID and selectedUser ID)
        const chat = await getChatByUsers(
          loggedInUser.userId,
          selectedUser.userId,
        );
        if (chat) {
          setActiveChat(chat);
          // Listen to the messages in the chat
          listenToMessages(chat.chatId, setChatMessages);
        } else {
          // Create a new chat request if no chat exists
          const newChat = await createChatRequest(
            loggedInUser.userId,
            selectedUser.userId,
            `${loggedInUser.userId} wants to start a chat.`,
          );
          setActiveChat(newChat);
          listenToMessages(newChat.chatId, setChatMessages);
        }
      }
    };

    fetchOrCreateChat();
  }, [selectedUser]);

  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() && activeChat) {
      await sendMessageToChat(
        activeChat.chatId,
        loggedInUser.userId,
        newMessage,
      );
      setNewMessage(""); // Clear the input after sending the message
    }
  };

  // Function to open the Date Picker overlay
  const handleDatePickerOpen = () => {
    setIsDatePickerOpen(true);
  };

  // Function to close the Date Picker overlay
  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
  };

  // Function to apply a date range filter
  const handleApplyDateRange = (startDate, endDate) => {
    console.log(`Selected date range: ${startDate} - ${endDate}`);
    // Add your logic here to filter messages based on the selected date range
    setIsDatePickerOpen(false);
  };

  // Fetch the list of users the logged-in user has interacted with
  const handleOpenUserModal = async () => {
    const users = await getUsersList(); // Fetch users from Firebase
    setUserList(users);
    setOpenUserModal(true);
  };

  const handleAddUserToChat = async (userId) => {
    if (activeChat) {
      await addUserToGroupChat(activeChat.id, userId); // Add user to the group in Firebase
      setOpenUserModal(false);
      console.log(`User ${userId} added to chat ${activeChat.id}`);
      // Optional: Show a success message or notification
    } else {
      console.log("No active chat selected to add users to.");
    }
  };

  return (
    <Box sx={{ bgcolor: "#FCF6F1", minHeight: "100vh" }}>
      <TopBar onDatePickerOpen={handleDatePickerOpen} />
      <Box sx={{ width: "90%", mx: "auto", pt: "125px" }}>
        <Grid container spacing={3} sx={{ height: "calc(100vh - 125px)" }}>
          {/* Left Column */}
          <Grid item xs={12} md={4} sx={{ height: "100%" }}>
            <Box
              sx={{
                height: "100%",
                bgcolor: "white",
                borderRadius: 5,
                p: 3,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Navigation Buttons */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                {["All", "New", "Groups", "Requests"].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "contained" : "outlined"}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      borderRadius: "20px",
                      bgcolor: activeTab === tab ? "black" : "transparent",
                      color: activeTab === tab ? "white" : "black",
                      px: 3,
                      flexGrow: 1,
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>

              {/* Chat List */}
              <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                {/* Display the list of chats here */}
              </Box>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                height: "100%",
                bgcolor: "white",
                borderRadius: 5,
                p: 3,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                {/* Chat Header */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {activeChat?.users && (
                    <AvatarGroup max={3}>
                      {Object.keys(activeChat.users).map((userId) => (
                        <Avatar key={userId} src={getUserAvatar(userId)} /> // getUserAvatar would fetch the avatar from the user profile
                      ))}
                    </AvatarGroup>
                  )}
                  <Typography variant="h6">{activeChat?.name}</Typography>
                  <IconButton
                    sx={{ ml: 1, bgcolor: "#F5F5F5", borderRadius: "50%" }}
                    onClick={handleOpenUserModal}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Chat Area */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  mb: 2,
                  bgcolor: "#FCF6F1",
                  p: 2,
                  borderRadius: "20px",
                }}
              >
                {chatMessages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor:
                        message.sender === loggedInUser.userId
                          ? "#DCF8C6"
                          : "#FFFFFF",
                      p: 2,
                      borderRadius: "12px",
                      mb: 2,
                      maxWidth: "75%",
                      alignSelf:
                        message.sender === loggedInUser.userId
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "text.primary" }}>
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Message Input Area */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  variant="outlined"
                  placeholder="New Messages"
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  sx={{
                    bgcolor: "#FCF6F1",
                    borderRadius: "50px",
                    "& fieldset": { border: "none" },
                  }}
                />
                <IconButton
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    borderRadius: "50%",
                    p: 1.5,
                  }}
                >
                  <ImageIcon />
                </IconButton>
                <IconButton
                  onClick={handleSendMessage}
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    borderRadius: "50%",
                    p: 1.5,
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
              {/* User Selection Modal for Group Chat */}
              <Dialog
                open={openUserModal}
                onClose={() => setOpenUserModal(false)}
                sx={{
                  "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  },
                  "& .MuiDialog-paper": {
                    borderRadius: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    padding: "5px",
                    maxWidth: "500px",
                    width: "100%",
                    textAlign: "center",
                  },
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">Add Users to Chat</Typography>
                  <List>
                    {userList.map((user) => (
                      <ListItem
                        button
                        key={user.userId}
                        onClick={() => handleAddUserToChat(user.userId)}
                      >
                        <Avatar src={user.avatar} />
                        <ListItemText
                          primary={user.displayName || user.userId}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Dialog>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Date Picker Overlay */}
      <DatePickerOverlay
        open={isDatePickerOpen}
        onClose={handleDatePickerClose}
        onApply={handleApplyDateRange}
      />
    </Box>
  );
};

export default Messages;
