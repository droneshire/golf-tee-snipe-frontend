import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useEffect } from "react";
import { useAsyncAction } from "hooks/async";
import { AccountSpec } from "./Account";
import { AccountType, Courses, DaysOfWeek, Times } from "types/user";

interface NewAccountDialogProps {
  open: boolean;
  onClose: () => void;
  createAccount: (account: AccountSpec) => Promise<void> | void;
  existingAccountIds: string[];
  inputAccount?: AccountType;
}

const DefaultStartTime = "06:00";
const DefaultEndTime = "18:00";
const DefaultDesiredTime = "08:00";

const NewAccountDialog: React.FC<NewAccountDialogProps> = (props) => {
  const [dayMenuAnchorEl, setDayMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [courseMenuAnchorEl, setCourseMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const dayMenuOpen = Boolean(dayMenuAnchorEl);
  const courseMenuOpen = Boolean(courseMenuAnchorEl);

  const [email, setEmail] = React.useState<string>("");
  const [courses, setCourses] = React.useState<string[]>([]);
  const [password, setPassword] = React.useState<string>("");
  const [numPlayers, setNumPlayers] = React.useState<number[]>([]);
  const [timeOfDay, setTimeOfDay] = React.useState<string>(Times.ALL);
  const [numHoles, setNumHoles] = React.useState<number>(18);
  const [desiredTime, setDesiredTime] =
    React.useState<string>(DefaultDesiredTime);
  const [earliestTime, setEarliestTime] =
    React.useState<string>(DefaultStartTime);
  const [latestTime, setLatestTime] = React.useState<string>(DefaultEndTime);
  const [targetDays, setTargetDays] = React.useState<string[]>([]);
  const [allowMultipleReservations, setAllowMultipleReservations] =
    React.useState<boolean>(false);
  const [allowNextDayBooking, setAllowNextDayBooking] =
    React.useState<boolean>(false);

  const [snackError, setSnackError] = React.useState<string | null>(null);
  const clearSnackError = () => setSnackError(null);

  const [disabled, setDisabled] = React.useState<boolean>(true);
  const {
    runAction: doCreateAccount,
    running: creatingAccount,
    error,
    clearError,
  } = useAsyncAction(props.createAccount);

  const clearAllErrors = () => {
    clearSnackError();
    if (clearError) {
      clearError();
    }
  };

  const handleDayMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDayMenuAnchorEl(event.currentTarget);
  };

  const handleCourseMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCourseMenuAnchorEl(event.currentTarget);
  };

  const handleDayMenuClose = () => {
    setDayMenuAnchorEl(null);
  };

  const handleCourseMenuClose = () => {
    setCourseMenuAnchorEl(null);
  };

  const handleDaySelect = (days: DaysOfWeek) => {
    const newWeekdays = new Set(targetDays);
    newWeekdays.add(days);
    setTargetDays(Array.from(newWeekdays));
    handleDayMenuClose();
  };

  const handleCourseSelect = (course: string) => {
    const newCourses = new Set(courses);
    newCourses.add(course);
    setCourses(Array.from(newCourses));
    handleCourseMenuClose();
  };

  const handleClose = () => {
    reset();
    props.onClose();
  };

  const reset = React.useCallback(() => {
    setEmail("");
    setPassword("");
    setNumPlayers([]);
    setTimeOfDay(Times.ALL);
    setNumHoles(18);
    setDesiredTime("");
    setEarliestTime("");
    setLatestTime("");
    setTargetDays([]);
    setAllowMultipleReservations(false);
    setAllowNextDayBooking(false);
  }, []);

  useEffect(() => {
    if (props.inputAccount) {
    }
  }, [props.inputAccount]);

  useEffect(() => {
    setDisabled(
      !(
        email &&
        password &&
        numPlayers.length > 0 &&
        timeOfDay &&
        desiredTime &&
        earliestTime &&
        latestTime &&
        targetDays.length > 0
      )
    );
  }, [
    email,
    password,
    numPlayers,
    timeOfDay,
    desiredTime,
    earliestTime,
    latestTime,
    targetDays,
  ]);

  const doSubmit = React.useCallback(async () => {
    if (disabled) {
      return;
    }

    try {
      const success: boolean = await doCreateAccount({
        accountId: email,
        email,
        password,
        scheduleIds: [],
        numPlayers,
        timeOfDay,
        numHoles,
        desiredTime,
        earliestTime,
        latestTime,
        targetDays,
        allowMultipleReservations,
        allowNextDayBooking,
      });

      if (success) {
        reset();
        props.onClose();
      }
    } catch (error: any) {
      setSnackError(error.message);
    }
  }, [
    disabled,
    doCreateAccount,
    email,
    password,
    numPlayers,
    timeOfDay,
    numHoles,
    desiredTime,
    earliestTime,
    latestTime,
    targetDays,
    allowMultipleReservations,
    allowNextDayBooking,
    reset,
    props.onClose,
  ]);

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            doSubmit();
          },
        }}
      >
        <DialogTitle>
          {props.inputAccount?.email ? "Edit" : "Add"} Account
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Text fields stacked vertically */}
            <Grid item xs={12}>
              <Box>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  fullWidth
                  required
                  autoFocus
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Number of Players"
                  type="number"
                  value={numPlayers.join(",")}
                  onChange={(event) =>
                    setNumPlayers(event.target.value.split(",").map(Number))
                  }
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Number of Holes"
                  type="number"
                  value={numHoles}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (value !== 9 && value !== 18) {
                      setSnackError("Number of holes must be 9 or 18");
                      return;
                    }
                    setNumHoles(value);
                  }}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Desired Time"
                  type="time"
                  value={desiredTime}
                  onChange={(event) => {
                    console.log("Desired: ", event.target.value);
                    if (
                      event.target.value < earliestTime ||
                      event.target.value > latestTime
                    ) {
                      setSnackError(
                        "Desired time must be between earliest and latest time"
                      );
                      return;
                    }
                    setDesiredTime(event.target.value);
                  }}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Earliest Time"
                  type="time"
                  value={earliestTime}
                  onChange={(event) => {
                    if (event.target.value > latestTime) {
                      setSnackError(
                        "Earliest time cannot be later than latest time"
                      );
                      return;
                    }
                    setEarliestTime(event.target.value);
                  }}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Latest Time"
                  type="time"
                  value={latestTime}
                  onChange={(event) => {
                    if (event.target.value < earliestTime) {
                      setSnackError(
                        "Latest time cannot be earlier than earliest time"
                      );
                      return;
                    }
                    setLatestTime(event.target.value);
                  }}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
              </Box>
            </Grid>
            {/* Select menus flexed horizontally */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Button
                  onClick={handleDayMenuOpen}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ mb: 2 }}
                >
                  Target Days
                </Button>
                <Menu
                  anchorEl={dayMenuAnchorEl}
                  open={dayMenuOpen}
                  onClose={handleDayMenuClose}
                >
                  {Object.values(DaysOfWeek).map((day) => (
                    <MenuItem key={day} onClick={() => handleDaySelect(day)}>
                      <FormControlLabel control={<Checkbox />} label={day} />
                    </MenuItem>
                  ))}
                </Menu>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Button
                  onClick={handleCourseMenuOpen}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ mb: 2 }}
                >
                  Courses
                </Button>
                <Menu
                  anchorEl={courseMenuAnchorEl}
                  open={courseMenuOpen}
                  onClose={handleCourseMenuClose}
                >
                  {Object.keys(Courses).map((course) => (
                    <MenuItem
                      key={course}
                      onClick={() => handleCourseSelect(course)}
                    >
                      <FormControlLabel control={<Checkbox />} label={course} />
                    </MenuItem>
                  ))}
                </Menu>
              </FormControl>
            </Grid>
            {/* Checkboxes stacked vertically */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Allow Multiple Reservations"
                  checked={allowMultipleReservations}
                  onChange={() =>
                    setAllowMultipleReservations(!allowMultipleReservations)
                  }
                  sx={{ mb: 2 }}
                />
              </FormControl>
              <FormControl fullWidth>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Allow Next Day Booking"
                  checked={allowNextDayBooking}
                  onChange={() => setAllowNextDayBooking(!allowNextDayBooking)}
                  sx={{ mb: 2 }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={disabled} autoFocus>
            {props.inputAccount ? "Update" : "Create"} Account
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!error && !!snackError}
        autoHideDuration={5000}
        onClose={clearAllErrors}
      >
        <Alert onClose={clearAllErrors} severity="error" sx={{ width: "100%" }}>
          {`Failed to create alert: ${error}`}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewAccountDialog;
