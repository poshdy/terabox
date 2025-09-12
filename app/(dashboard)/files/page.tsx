import FilesList from "@/components/pages/files/file-list";
import { PageHeader } from "@/components/pages/files/header";
import { UploadProgress } from "@/components/pages/files/upload-progress";
import { generateStaticMetadata } from "@/lib/seo/metadata";
import React from "react";

export const metadata = generateStaticMetadata({ title: "Files" });

export default function Page() {
  return (
    <section className="w-full  min-h-screen relative">
      <PageHeader />

      <FilesList />

      <UploadProgress />
    </section>
  );
}
