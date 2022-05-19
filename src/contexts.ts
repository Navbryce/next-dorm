import { createContext } from "preact";
import { AlertService } from "./utils/Alert";
import { UserMaybe } from "src/utils/auth";

export const AlertContext = createContext(new AlertService());

export const ReferringScreenContext = createContext<
  [string | undefined,(url: string | undefined) => void]
>([
  undefined,
  () => {
    // do nothing
  },
]);

export const UserContext = createContext<
  [UserMaybe,(value: UserMaybe) => void]
>([
  undefined,
  () => {
    // do nothing
  },
]);
