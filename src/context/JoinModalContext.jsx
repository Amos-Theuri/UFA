// src/context/JoinModalContext.jsx
import { useState, useEffect } from "react";
import { JoinModalContext } from "./joinModalContextInstance";

export function JoinModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      return (
        window.location.hash.toLowerCase() === "#join" ||
        searchParams.get("join") === "true"
      );
    }
    return false;
  });

  const openJoinModal = () => setIsOpen(true);
  const closeJoinModal = () => setIsOpen(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.toLowerCase() === "#join") {
        setIsOpen(true);
      }
    };

    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <JoinModalContext.Provider value={{ isOpen, openJoinModal, closeJoinModal }}>
      {children}
    </JoinModalContext.Provider>
  );
}

