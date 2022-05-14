import { createContext } from "preact";
import { AlertService } from "./utils/Alert";
import { UserMaybe } from "src/utils/auth";

export const AlertContext = createContext(new AlertService());

export const UserContext = createContext<
  [UserMaybe,(value: UserMaybe) => void]
>([
  undefined,
  () => {
    // do nothing
  },
]);
