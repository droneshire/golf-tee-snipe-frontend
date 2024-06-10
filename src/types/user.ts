export enum ClientAction {
  NONE = "NONE",
  DELETE = "DELETE",
  ADD = "ADD",
}

export enum Courses {
  BLACK = "2431",
  RED = "2432",
  GREEN = "2434",
  YELLOW = "2435",
  BLUE = "2433",
}

export enum Times {
  MORNING = "morning",
  MIDDAY = "midday",
  AFTERNOON = "afternoon",
  ALL = "all",
}

export enum DaysOfWeek {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}

export const SCHED_ID_TO_BOOKING_CLASSES = {
  "2431": "2136",
  "2433": "2140",
  "2434": "2142",
  "2432": "2138",
  "2435": "2144",
  "2517": "2159",
  "2539": "2163",
  "2538": "2161",
};

export interface Preferences {
  notifications: {
    email: {
      email: string;
      updatesEnabled: boolean;
    };
    sms: {
      updatesEnabled: boolean;
    };
  };
}

export interface AccountType {
  email: string;
  password: string;
  scheduleIds: string[];
  numPlayers: number;
  timeOfDay: string;
  numHoles: number;
  desiredTime: string;
  earliestTime: string;
  latestTime: string;
  targetDays: string[];
  allowMultipleReservations: boolean;
  allowNextDayBooking: boolean;
}
export interface ClientConfig {
  preferences: Preferences;
  accounts: {
    [id: string]: AccountType;
  };
}

export const DEFAULT_USER_CONFIG: ClientConfig = {
  preferences: {
    notifications: {
      email: { email: "", updatesEnabled: true },
      sms: { updatesEnabled: true },
    },
  },
  accounts: {},
};
