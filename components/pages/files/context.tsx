"use client";

import { AppFile } from "@/hooks/use-upload";
import { File } from "@/lib/generated/prisma";
import { Item } from "@/lib/server/services/file.service";
import { useRouter } from "next/navigation";
import React, { createContext, useState } from "react";

interface IFilesContext {
  modal: { type: ModalTypes; isOpen: boolean } | null;
  openModal: (type: ModalTypes) => void;
  closeModal: (type: ModalTypes) => void;
  files: AppFile[];
  setFiles: React.Dispatch<React.SetStateAction<AppFile[]>>;
  setEditItem: React.Dispatch<React.SetStateAction<Item | null>>;
  editItem: Item | null;
  handleTableRowClick: (item: Item) => void;
  fileId: string | null;
}

export const FilesContext = createContext<IFilesContext | null>(null);

type ModalTypes = "createUpdate" | "move" | "share" | "viewer";

export const FilesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [files, setFiles] = useState<AppFile[]>([]);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [modal, setIsModalOpen] = useState<{
    type: ModalTypes;
    isOpen: boolean;
  } | null>(null);

  const handleTableRowClick = (item: Item) => {
    const type = item.type;

    if (type == "folder") {
      router.push(`/files?folderId=${item.data.id}`);
    } else {
      const file = item.data;
      setFileId(file.id);
      openModal("viewer");
    }
  };

  const openModal = (type: ModalTypes) => {
    setIsModalOpen({ type, isOpen: true });
  };
  const closeModal = (type: ModalTypes) => {
    setIsModalOpen({ type, isOpen: false });
  };

  const values = {
    modal,
    fileId,
    files,
    editItem,
    setEditItem,
    openModal,
    closeModal,
    setFiles,
    handleTableRowClick,
  };

  return (
    <FilesContext.Provider value={values}>{children}</FilesContext.Provider>
  );
};
