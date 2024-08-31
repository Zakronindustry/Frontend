import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  addDays,
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import "react-date-range/dist/styles.css"; // Main style file for date range picker
import "react-date-range/dist/theme/default.css"; // Theme CSS
import "./CustomDateRangePicker.css"; // Import custom CSS

const DatePickerOverlay = ({
  open,
  onClose,
  onApply,
  buttonSpacing = "10px",
  dialogHeight = "auto", // Adjustable height, default to auto
}) => {
  const [selectedRange, setSelectedRange] = useState({
    startDate: addDays(new Date(), -7),
    endDate: new Date(),
    key: "selection",
  });

  const [selectedOption, setSelectedOption] = useState("lastWeek");

  const predefinedRanges = {
    today: {
      startDate: startOfToday(),
      endDate: endOfToday(),
    },
    thisWeek: {
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    },
    lastWeek: {
      startDate: startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
      endDate: endOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
    },
    thisMonth: {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    },
    lastMonth: {
      startDate: startOfMonth(addDays(new Date(), -30)),
      endDate: endOfMonth(addDays(new Date(), -30)),
    },
  };

  const handleRadioChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
    setSelectedRange({ ...predefinedRanges[option], key: "selection" });
  };

  const handleApply = () => {
    onApply(selectedRange);
    onClose();
  };

  const handleReset = () => {
    setSelectedRange({
      startDate: addDays(new Date(), -7),
      endDate: new Date(),
      key: "selection",
    });
    setSelectedOption("lastWeek");
  };

  const handleChange = (ranges) => {
    setSelectedRange(ranges.selection);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "20px",
          backgroundColor: "#FCF6F1",
          padding: "20px",
          maxHeight: "95vh", // Ensure it doesn't exceed the viewport height
          overflowY: "auto", // Allow scrolling if content overflows
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          padding: 1,
          paddingBottom: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          Select Date Range
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#000",
            position: "absolute",
            top: 1,
            right: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <RadioGroup
            value={selectedOption}
            onChange={handleRadioChange}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              flexWrap: "wrap",
              flexDirection: "row",
              gap: 1,
              mb: 1,
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <FormControlLabel
                value="today"
                control={<Radio sx={{ color: "#000" }} />}
                label="Today"
              />
              <FormControlLabel
                value="thisWeek"
                control={<Radio sx={{ color: "#000" }} />}
                label="This week"
              />
              <FormControlLabel
                value="lastWeek"
                control={<Radio sx={{ color: "#000" }} />}
                label="Last week"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <FormControlLabel
                value="yesterday"
                control={<Radio sx={{ color: "#000" }} />}
                label="Yesterday"
              />
              <FormControlLabel
                value="thisMonth"
                control={<Radio sx={{ color: "#000" }} />}
                label="This month"
              />
              <FormControlLabel
                value="lastMonth"
                control={<Radio sx={{ color: "#000" }} />}
                label="Last month"
              />
            </Box>
          </RadioGroup>
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mb: 1.5,
            }}
          >
            <DateRangePicker
              ranges={[selectedRange]}
              onChange={handleChange}
              rangeColors={["#0052CC"]}
              showDateDisplay={false} // Hide the date range display
              color="#000000"
              staticRanges={[]} // Remove static ranges
              inputRanges={[]} // Remove input ranges
              months={1}
              direction="horizontal"
              showMonthAndYearPickers={true}
              weekdayDisplayFormat="EE"
              editableDateInputs={false}
              showPreview={false}
              className="calendar-only" // Apply custom CSS class
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          padding: "13px",
          paddingTop: 0,
          gap: buttonSpacing, // Ensure gap is applied directly
        }}
      >
        <Button
          onClick={handleReset}
          sx={{
            backgroundColor: "#D3CBC3",
            borderRadius: "20px",
            padding: "5px 10px",
            color: "#000",
            fontWeight: "bold",
            textTransform: "none",
            width: "40%",
          }}
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          sx={{
            backgroundColor: "#000000",
            borderRadius: "20px",
            padding: "5px 10px",
            color: "#FFFFFF",
            fontWeight: "bold",
            textTransform: "none",
            width: "40%",
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DatePickerOverlay;