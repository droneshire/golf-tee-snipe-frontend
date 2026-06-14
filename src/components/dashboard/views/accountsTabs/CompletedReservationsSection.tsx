import { FC, useMemo } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import {
  alpha,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { ClientConfig, CompletedReservation, Courses } from "types/user";
import { DocumentSnapshot } from "firebase/firestore";

const HISTORY_LIMIT = 10;

function scheduleIdToCourseName(scheduleId: number): string | undefined {
  const entry = Object.entries(Courses).find(
    ([, id]) => Number(id) === scheduleId
  );
  return entry?.[0];
}

function formatReservationTime(value: string): string {
  const normalized = value.trim().replace("T", " ");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function displayCourseName(reservation: CompletedReservation): string {
  if (reservation.courseName) {
    return reservation.courseName;
  }
  return scheduleIdToCourseName(reservation.scheduleId) ?? "Unknown course";
}

function sortReservations(
  reservations: Record<string, CompletedReservation>
): CompletedReservation[] {
  return Object.values(reservations).sort((a, b) =>
    b.confirmedAt.localeCompare(a.confirmedAt)
  );
}

const heroPaperSx = {
  mt: 1,
  mb: 2,
  p: { xs: 2, sm: 3 },
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
} as const;

const CompletedReservationsSection: FC<{
  userConfigSnapshot: DocumentSnapshot<ClientConfig>;
}> = ({ userConfigSnapshot }) => {
  const sortedReservations = useMemo(() => {
    const reservations = userConfigSnapshot.data()?.completedReservations ?? {};
    return sortReservations(reservations);
  }, [userConfigSnapshot]);

  if (sortedReservations.length === 0) {
    return (
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          ...heroPaperSx,
          background: (theme) => alpha(theme.palette.background.paper, 0.92),
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No completed reservations yet. Successful snipes will appear here.
        </Typography>
      </Paper>
    );
  }

  const latest = sortedReservations[0];
  const history = sortedReservations.slice(0, HISTORY_LIMIT);

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          ...heroPaperSx,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.14)} 0%, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 45%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 48,
              color: "success.main",
              filter: "drop-shadow(0 2px 6px rgba(34,197,94,0.35))",
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: "0.12em", color: "success.dark", fontWeight: 700 }}
            >
              Latest Booking
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 800, mt: 0.5 }}>
              {displayCourseName(latest)}
            </Typography>
            <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
              {formatReservationTime(latest.teeTime)}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 1.5,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                <Typography component="span" fontWeight={700} color="text.primary">
                  {latest.playerCount}
                </Typography>{" "}
                players
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <Typography component="span" fontWeight={700} color="text.primary">
                  {latest.holes}
                </Typography>{" "}
                holes
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                Account:{" "}
                <Typography component="span" fontWeight={600} color="text.primary">
                  {latest.accountEmail}
                </Typography>
              </Typography>
            </Box>
            {latest.details ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                {latest.details}
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Paper>

      {history.length > 1 ? (
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: (theme) =>
              `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1.5,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <HistoryIcon fontSize="small" color="primary" />
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              Recent bookings
            </Typography>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Tee time</TableCell>
                  <TableCell>Players</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Booked</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((reservation) => (
                  <TableRow key={reservation.ttid} hover>
                    <TableCell>{displayCourseName(reservation)}</TableCell>
                    <TableCell>{formatReservationTime(reservation.teeTime)}</TableCell>
                    <TableCell>{reservation.playerCount}</TableCell>
                    <TableCell sx={{ maxWidth: 180, wordBreak: "break-all" }}>
                      {reservation.accountEmail}
                    </TableCell>
                    <TableCell>{formatReservationTime(reservation.confirmedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Box sx={{ mb: 3 }} />
      )}
    </Box>
  );
};

export default CompletedReservationsSection;
