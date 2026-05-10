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
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useEffect, useState, useCallback } from "react";
import { useAsyncAction } from "hooks/async";
import { AccountSpec } from "./Account";
import {
  AccountType,
  Courses,
  CreditCardPayment,
  DaysOfWeek,
  Times,
} from "types/user";
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
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isResident, setIsResident] = useState<boolean>(false);

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const {
    runAction: doCreateAccount,
    error,
    clearError,
  } = useAsyncAction(createAccount);

  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

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

  const cardNumberAdornment = (
    <InputAdornment position="end">
      <IconButton onClick={() => setShowCardNumber(!showCardNumber)}>
        {showCardNumber ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  const cvvAdornment = (
    <InputAdornment position="end">
      <IconButton onClick={() => setShowCvv(!showCvv)}>
        {showCvv ? <VisibilityOff /> : <Visibility />}
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
    setCardholderName("");
    setCardNumber("");
    setExpMonth("");
    setExpYear("");
    setCvv("");
    setBillingPostalCode("");
    setShowCardNumber(false);
    setShowCvv(false);
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
      const p = inputAccount.payment;
      if (p) {
        setCardholderName(p.cardholder_name || "");
        setCardNumber(p.number || "");
        setExpMonth(p.exp_month || "");
        setExpYear(p.exp_year || "");
        setCvv(p.cvv || "");
        setBillingPostalCode(p.billing_postal_code || "");
      } else {
        setCardholderName("");
        setCardNumber("");
        setExpMonth("");
        setExpYear("");
        setCvv("");
        setBillingPostalCode("");
      }
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

      const cardFields = [
        cardholderName,
        cardNumber,
        expMonth,
        expYear,
        cvv,
      ].map((s) => String(s).trim());
      const anyCard = cardFields.some(Boolean) || billingPostalCode.trim();
      const allCard = cardFields.every(Boolean);
      if (anyCard && !allCard) {
        setSnackError(
          "Fill all card fields (name, number, exp month, exp year, CVV) or leave payment empty"
        );
        return;
      }

      let payment: CreditCardPayment | undefined;
      if (allCard) {
        payment = {
          cardholder_name: cardFields[0],
          number: cardFields[1],
          exp_month: cardFields[2],
          exp_year: cardFields[3],
          cvv: cardFields[4],
        };
        const zip = billingPostalCode.trim();
        if (zip) {
          payment = { ...payment, billing_postal_code: zip };
        }
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
        ...(payment ? { payment } : {}),
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
    isResident,
    cardholderName,
    cardNumber,
    expMonth,
    expYear,
    cvv,
    billingPostalCode,
    reset,
    onClose,
  ]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        fullScreen={fullScreenDialog}
        maxWidth="sm"
        scroll="paper"
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            doSubmit();
          },
          sx: {
            maxHeight: "min(92vh, 920px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            py: 2.5,
            background: (theme) =>
              `linear-gradient(125deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            color: "primary.contrastText",
          }}
        >
          {isEditing ? "Edit account" : "Add account"}
        </DialogTitle>
        <DialogContent sx={{ flex: "1 1 auto", overflowY: "auto", pt: 3 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Course credentials and booking preferences for this sniper account.
          </DialogContentText>
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
                  variant="outlined"
                  fullWidth
                  onClick={handleDayMenuOpen}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ mb: 2, py: 1.25, justifyContent: "space-between" }}
                >
                  Target days
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
                  variant="outlined"
                  fullWidth
                  onClick={handleCourseMenuOpen}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ mb: 2, py: 1.25, justifyContent: "space-between" }}
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
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                })}
              >
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Payment card (optional)
              </Typography>
              <DialogContentText sx={{ mb: 2 }}>
                For future hosted checkout. Stored as sensitive data—only fill if
                you accept saving card details in your configuration.
              </DialogContentText>
              <TextField
                label="Cardholder name"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                fullWidth
                autoComplete="cc-name"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Card number"
                type={showCardNumber ? "text" : "password"}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                InputProps={{ endAdornment: cardNumberAdornment }}
                fullWidth
                autoComplete="cc-number"
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Exp. month"
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value)}
                    fullWidth
                    placeholder="MM"
                    inputProps={{ maxLength: 2 }}
                    autoComplete="cc-exp-month"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Exp. year"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    fullWidth
                    placeholder="YYYY"
                    inputProps={{ maxLength: 4 }}
                    autoComplete="cc-exp-year"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="CVV"
                    type={showCvv ? "text" : "password"}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    InputProps={{ endAdornment: cvvAdornment }}
                    fullWidth
                    autoComplete="cc-csc"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Billing postal code (optional)"
                    value={billingPostalCode}
                    onChange={(e) => setBillingPostalCode(e.target.value)}
                    fullWidth
                    autoComplete="postal-code"
                  />
                </Grid>
              </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
          }}
        >
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={disabled}
            sx={{ minWidth: 140 }}
          >
            {isEditing ? "Save changes" : "Create account"}
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
