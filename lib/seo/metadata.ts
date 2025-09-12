import { type Metadata } from "next";

export const generateStaticMetadata = ({ title, description }: Metadata) => {
  return {
    title: `TeraBox | ${title}`,
    description:
      description ||
      "A cloud application built with Next.js and Clerk for authentication.",
  } as Metadata;
};
