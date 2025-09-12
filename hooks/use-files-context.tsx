"use client";
import { FilesContext } from "@/components/pages/files/context";
import { useContext } from "react";

export const useFilesContext = () => {
  const context = useContext(FilesContext);

  if (!context) {
    throw new Error(
      "YOU CAN'T USE useFilesContext OUTSIDE FilesContextProvider"
    );
  }

  return context;
};
