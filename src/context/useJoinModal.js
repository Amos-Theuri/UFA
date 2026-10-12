// src/context/useJoinModal.js
import { useContext } from "react";
import { JoinModalContext } from "./joinModalContextInstance";

export function useJoinModal() {
  const context = useContext(JoinModalContext);
  if (!context) {
    throw new Error("useJoinModal must be used within a JoinModalProvider");
  }
  return context;
}
