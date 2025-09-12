import {
  IconFile,
  IconFolder,
  IconImageInPicture,
  IconPdf,
  IconPhoto,
} from "@tabler/icons-react";

export const fileType = (type: string) => {
  const arr = type.split("/");

  return arr[1];
};

export const fileTypeIcon = (type?: string, size: number = 20) => {
  if (!type) {
    return <IconFolder size={20} />;
  }

  const lcType = type.toLowerCase();

  if (lcType.includes("image") || lcType.includes("img")) {
    return <IconPhoto size={size} />;
  }

  if (lcType.includes("pdf")) {
    return <IconPdf size={size} />;
  }
};
