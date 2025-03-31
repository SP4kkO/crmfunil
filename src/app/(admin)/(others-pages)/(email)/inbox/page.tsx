import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmailContent from "@/components/email/EmailContent";
import EmailSidebar from "@/components/email/EmailSidebar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Inbox | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Inbox page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function Inbox() {
  return (
    <>
      <PageBreadcrumb pageTitle="Inbox" />
      <div className="overflow-hidden sm:h-[calc(100vh-174px)] xl:h-[calc(100vh-186px)]">
        <div className="flex flex-col h-full gap-6 sm:gap-5 xl:flex-row">
          <EmailSidebar />
          <div className="flex h-screen flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:h-full xl:w-4/5">
            <EmailContent />
          </div>
        </div>
      </div>
    </>
  );
}
