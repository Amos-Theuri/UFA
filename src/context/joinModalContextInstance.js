// src/context/joinModalContextInstance.js
import { createContext } from "react";

export const JoinModalContext = createContext({
  isOpen: false,
  openJoinModal: () => {},
  closeJoinModal: () => {},
});
