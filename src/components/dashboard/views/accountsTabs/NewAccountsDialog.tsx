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
import React, { useEffect, useState, useCallback } from "react";
import { useAsyncAction } from "hooks/async";
import { AccountSpec } from "./Account";
import { AccountType, Courses, DaysOfWeek, Times } from "types/user";
import { isValidPhone } from "utils/validators";

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

const NewAccountDialog: React.FC<NewAccountDialogProps> = ({
  open,
  onClose,
  createAccount,
  inputAccount,
}) => {
  const [dayMenuAnchorEl, setDayMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [courseMenuAnchorEl, setCourseMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [courses, setCourses] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [numPlayers, setNumPlayers] = useState<number>(4);
  const [timeOfDay, setTimeOfDay] = useState<string>(Times.ALL);
  const [numHoles, setNumHoles] = useState<number>(18);
  const [desiredTime, setDesiredTime] = useState<string>(DefaultDesiredTime);
  const [earliestTime, setEarliestTime] = useState<string>(DefaultStartTime);
  const [latestTime, setLatestTime] = useState<string>(DefaultEndTime);
  const [targetDays, setTargetDays] = useState<string[]>([]);
  const [allowMultipleReservations, setAllowMultipleReservations] =
    useState<boolean>(false);
  const [allowNextDayBooking, setAllowNextDayBooking] =
    useState<boolean>(false);

  const [snackError, setSnackError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const clearSnackError = () => setSnackError(null);
  const [desiredTimeError, setDesiredTimeError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isResident, setIsResident] = useState<boolean>(false);
  const {
    runAction: doCreateAccount,
    error,
    clearError,
  } = useAsyncAction(createAccount);

  const isEditing = inputAccount && inputAccount.email;

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
    clearError();
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
    onClose();
    reset();
  };

  const reset = useCallback(() => {
    setEmail("");
    setPhone("");
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
    setIsResident(false);
  }, []);

  useEffect(() => {
    if (inputAccount) {
      setEmail(inputAccount.email || "");
      setPhone(inputAccount.phone || "");
      setPassword(inputAccount.password || "");
      setNumPlayers(Number(inputAccount.numPlayers) || 4);
      setTimeOfDay(inputAccount.timeOfDay || Times.ALL);
      setNumHoles(inputAccount.numHoles || 18);
      setDesiredTime(inputAccount.desiredTime || DefaultDesiredTime);
      setEarliestTime(inputAccount.earliestTime || DefaultStartTime);
      setLatestTime(inputAccount.latestTime || DefaultEndTime);
      setTargetDays(inputAccount.targetDays || []);
      setAllowMultipleReservations(
        inputAccount.allowMultipleReservations || false
      );
      setAllowNextDayBooking(inputAccount.allowNextDayBooking || false);
      setCourses(inputAccount.scheduleIds || []);
      setIsResident(inputAccount.isResident || false);
    }
  }, [inputAccount]);

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

  const doSubmit = useCallback(async () => {
    if (disabled) return;

    try {
      if (
        desiredTime < earliestTime ||
        desiredTime > latestTime ||
        earliestTime > latestTime ||
        (numHoles !== 9 && numHoles !== 18) ||
        numPlayers < 1 ||
        numPlayers > 4 ||
        !isValidPhone(phone)
      ) {
        setSnackError("Invalid entries");
        return;
      }

      const success = await doCreateAccount({
        accountId: email,
        email,
        phone,
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
        isResident,
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
    phone,
    numPlayers,
    timeOfDay,
    numHoles,
    desiredTime,
    earliestTime,
    latestTime,
    targetDays,
    allowMultipleReservations,
    allowNextDayBooking,
    courses,
    reset,
    onClose,
  ]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            doSubmit();
          },
        }}
      >
        <DialogTitle>{isEditing ? "Edit" : "Add"} Account</DialogTitle>
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
                  label="Phone"
                  type="phone"
                  value={phone}
                  onChange={(event) => {
                    let newPhone = event.target.value;

                    if (!isValidPhone(newPhone)) {
                      setPhoneError("Phone number must be 10 digits long");
                    } else {
                      setPhoneError(null);
                    }
                    if (
                      newPhone.length === 10 &&
                      newPhone.substring(0, 2) !== "+1"
                    ) {
                      newPhone = "+1" + newPhone;
                    }
                    setPhone(newPhone);
                  }}
                  error={!!phoneError}
                  helperText={phoneError}
                  fullWidth
                  required
                  autoFocus
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
                  onChange={(event) => setNumHoles(Number(event.target.value))}
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
                  open={Boolean(dayMenuAnchorEl)}
                  onClose={handleDayMenuClose}
                >
                  {Object.values(DaysOfWeek).map((day) => (
                    <MenuItem key={day}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={targetDays.includes(day)}
                            onChange={() => handleDaySelect(day)}
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
                  open={Boolean(courseMenuAnchorEl)}
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Is Resident"
                  checked={isResident}
                  onChange={() => setIsResident(!isResident)}
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
