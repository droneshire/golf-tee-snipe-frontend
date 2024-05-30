import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useEffect } from "react";
import { useAsyncAction } from "hooks/async";
import { AccountSpec } from "./Account";
import { AccountType, DaysOfWeek, Times } from "types/user";

interface NewAccountDialogProps {
  open: boolean;
  onClose: () => void;
  createAccount: (account: AccountSpec) => Promise<void> | void;
  existingAccountIds: string[];
  inputAccount?: AccountType;
}

const NewAccountDialog: React.FC<NewAccountDialogProps> = (props) => {
  const [dayMenuAnchorEl, setDayMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [courseMenuAnchorEl, setCourseMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const dayMenuOpen = Boolean(dayMenuAnchorEl);
  const courseMenuOpen = Boolean(dayMenuAnchorEl);

  const [email, setEmail] = React.useState<string>("");
  const [courses, setCourses] = React.useState<string[]>([]);
  const [password, setPassword] = React.useState<string>("");
  const [numPlayers, setNumPlayers] = React.useState<number[]>([]);
  const [timeOfDay, setTimeOfDay] = React.useState<string>(Times.ALL);
  const [numHoles, setNumHoles] = React.useState<number>(18);
  const [desiredTime, setDesiredTime] = React.useState<string>("");
  const [earliestTime, setEarliestTime] = React.useState<string>("");
  const [latestTime, setLatestTime] = React.useState<string>("");
  const [targetDays, setTargetDays] = React.useState<string[]>([]);
  const [allowMultipleReservations, setAllowMultipleReservations] =
    React.useState<boolean>(false);
  const [allowNextDayBooking, setAllowNextDayBooking] =
    React.useState<boolean>(false);

  const [disabled, setDisabled] = React.useState<boolean>(true);
  const {
    runAction: doCreateAccount,
    running: creatingAccount,
    error,
    clearError,
  } = useAsyncAction(props.createAccount);

  const handleMediaTypeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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

    const success = await doCreateAccount({
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
          <DialogContentText>
            This adds a new account to the system for tee time booking.
          </DialogContentText>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            required
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
          />
          <TextField
            label="Number of Holes"
            type="number"
            value={numHoles}
            onChange={(event) => setNumHoles(Number(event.target.value))}
            fullWidth
            required
          />
          <TextField
            label="Desired Time"
            type="time"
            value={desiredTime}
            onChange={(event) => setDesiredTime(event.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Earliest Time"
            type="time"
            value={earliestTime}
            onChange={(event) => setEarliestTime(event.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Latest Time"
            type="time"
            value={latestTime}
            onChange={(event) => setLatestTime(event.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <Button
              onClick={handleMediaTypeMenuOpen}
              endIcon={<KeyboardArrowDownIcon />}
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
          <FormControl fullWidth>
            <Button
              onClick={handleCourseMenuOpen}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Courses
            </Button>
            <Menu
              anchorEl={courseMenuAnchorEl}
              open={courseMenuOpen}
              onClose={handleCourseMenuClose}
            >
              {["Course 1", "Course 2"].map((course) => (
                <MenuItem
                  key={course}
                  onClick={() => handleCourseSelect(course)}
                >
                  <FormControlLabel control={<Checkbox />} label={course} />
                </MenuItem>
              ))}
            </Menu>
          </FormControl>
          <FormControl fullWidth>
            <FormControlLabel
              control={<Checkbox />}
              label="Allow Multiple Reservations"
              checked={allowMultipleReservations}
              onChange={() =>
                setAllowMultipleReservations(!allowMultipleReservations)
              }
            />
          </FormControl>
          <FormControl fullWidth>
            <FormControlLabel
              control={<Checkbox />}
              label="Allow Next Day Booking"
              checked={allowNextDayBooking}
              onChange={() => setAllowNextDayBooking(!allowNextDayBooking)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={disabled} autoFocus>
            {props.inputAccount ? "Update" : "Create"} Account
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!error} autoHideDuration={5000} onClose={clearError}>
        <Alert onClose={clearError} severity="error" sx={{ width: "100%" }}>
          {`Failed to create alert: ${error}`}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewAccountDialog;
