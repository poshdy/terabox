"use client";

import { AppFile } from "@/hooks/use-upload";
import { Item } from "@/lib/server/services/file.service";
import { usePathname, useRouter } from "next/navigation";
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
  item: Item | null;
  currentFolder: string | null;
  onSetItem: (item: Item | null) => void;
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
  const [item, setItem] = useState<Item | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [modal, setIsModalOpen] = useState<{
    type: ModalTypes;
    isOpen: boolean;
  } | null>(null);

  const handleTableRowClick = (item: Item) => {
    const type = item.type;

    if (type == "folder") {
      setCurrentFolder(item.data.id);
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

  const onSetItem = (item: Item | null) => {
    setItem(item);
  };

  const values = {
    modal,
    fileId,
    files,
    editItem,
    item,
    currentFolder,
    setEditItem,
    openModal,
    closeModal,
    setFiles,
    onSetItem,
    handleTableRowClick,
  };

  return (
    <FilesContext.Provider value={values}>{children}</FilesContext.Provider>
  );
};
