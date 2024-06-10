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
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  const [numPlayers, setNumPlayers] = React.useState<number>(4);
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
  const [desiredTimeError, setDesiredTimeError] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const {
    runAction: doCreateAccount,
    error,
    clearError,
  } = useAsyncAction(props.createAccount);

  const isEditing = props.inputAccount && props.inputAccount?.email;

  const validateDesiredTime = () => {
    if (desiredTime < earliestTime || desiredTime > latestTime) {
      setDesiredTimeError(true);
      setSnackError("Desired time must be between earliest and latest time");
    } else {
      setDesiredTimeError(false);
      setSnackError(null);
    }
  };

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

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

  const handleDaySelect = (day: DaysOfWeek) => {
    setTargetDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleCourseSelect = (course: string) => {
    setCourses((prevCourses) =>
      prevCourses.includes(course)
        ? prevCourses.filter((c) => c !== course)
        : [...prevCourses, course]
    );
  };

  const handleClose = () => {
    props.onClose();
    reset();
  };

  const reset = React.useCallback(() => {
    setEmail("");
    setPassword("");
    setNumPlayers(4);
    setTimeOfDay(Times.ALL);
    setNumHoles(18);
    setDesiredTime(DefaultDesiredTime);
    setEarliestTime(DefaultStartTime);
    setLatestTime(DefaultEndTime);
    setTargetDays([]);
    setAllowMultipleReservations(false);
    setAllowNextDayBooking(false);
    setCourses([]);
  }, []);

  useEffect(() => {
    if (props.inputAccount) {
      setEmail(props.inputAccount.email || "");
      setPassword(props.inputAccount.password || "");
      setNumPlayers(Number(props.inputAccount.numPlayers) || 4);
      setTimeOfDay(props.inputAccount.timeOfDay || Times.ALL);
      setNumHoles(props.inputAccount.numHoles || 18);
      setDesiredTime(props.inputAccount.desiredTime || DefaultDesiredTime);
      setEarliestTime(props.inputAccount.earliestTime || DefaultStartTime);
      setLatestTime(props.inputAccount.latestTime || DefaultEndTime);
      setTargetDays(props.inputAccount.targetDays || []);
      setAllowMultipleReservations(
        props.inputAccount.allowMultipleReservations || false
      );
      setAllowNextDayBooking(props.inputAccount.allowNextDayBooking || false);
      setCourses(props.inputAccount.scheduleIds || []);
    }
  }, [props.inputAccount]);

  useEffect(() => {
    setDisabled(
      !(
        email &&
        password &&
        numPlayers &&
        timeOfDay &&
        desiredTime &&
        earliestTime &&
        latestTime
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
  ]);

  const doSubmit = React.useCallback(async () => {
    if (disabled) return;
    try {
      if (
        desiredTime < earliestTime ||
        desiredTime > latestTime ||
        earliestTime > latestTime ||
        (numHoles !== 9 && numHoles !== 18) ||
        numPlayers < 1 ||
        numPlayers > 4
      ) {
        setSnackError("Invalid entries");
        return;
      }

      const success = await doCreateAccount({
        accountId: email,
        email,
        password,
        scheduleIds: courses,
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
        handleClose();
      }
    } catch (err) {
      setSnackError("Failed to create account.");
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
        <Box sx={{ paddingX: 3 }}>
          <DialogContentText>
            Please fill out the info for the new account.
          </DialogContentText>
        </Box>
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
                  InputProps={{
                    endAdornment,
                    type: showPassword ? "text" : "password",
                  }}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Number of Players"
                  type="number"
                  value={numPlayers}
                  onChange={(event) =>
                    setNumPlayers(Number(event.target.value))
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
                    setNumHoles(Number(event.target.value));
                  }}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Desired Time"
                  type="time"
                  value={desiredTime}
                  onChange={(event) => setDesiredTime(event.target.value)}
                  onBlur={validateDesiredTime}
                  error={desiredTimeError}
                  helperText={
                    desiredTimeError
                      ? "Desired time must be between earliest and latest time"
                      : ""
                  }
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
                    <MenuItem key={day}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={targetDays.includes(day)}
                            onClick={() => handleDaySelect(day)}
                          />
                        }
                        label={day}
                      />
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
                    <MenuItem key={course}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={courses.includes(course)}
                            onChange={() => handleCourseSelect(course)}
                          />
                        }
                        label={course}
                      />
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
            {isEditing ? "Update" : "Create"} Account
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
