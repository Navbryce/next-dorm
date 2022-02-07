import { createContext } from "preact";
import { AlertService } from "./utils/Alert";
import { User } from "firebase/auth";

export const AlertContext = createContext<AlertService>(new AlertService());

// user is undefined if login state has not been established
export const UserContext = createContext<User | undefined | null>(null);
