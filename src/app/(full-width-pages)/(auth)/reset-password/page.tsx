import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import GridShape from "@/components/common/GridShape";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Reset Password | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Password Reset page for TailAdmin Dashboard Template",
  // other metadata
};

export default function ResetPasswordPage() {
  return (
    <div className="relative flex w-full h-screen overflow-hidden z-1">
      <ResetPasswordForm />
      <div className="relative items-center justify-center flex-1 hidden p-8 z-1 bg-brand-950 dark:bg-white/5 lg:flex">
        {/* <!-- ===== Common Grid Shape Start ===== --> */}
        <GridShape />
        {/* <!-- ===== Common Grid Shape End ===== --> */}
        <div className="flex flex-col items-center max-w-xs">
          <Link href="/" className="block mb-4">
            <Image
              width={231}
              height={48}
              src="/images/logo/auth-logo.svg"
              alt="Logo"
            />
          </Link>
          <p className="text-center text-gray-400 dark:text-white/60">
            Free and Open-Source Tailwind CSS Admin Dashboard Template
          </p>
        </div>
      </div>
    </div>
  );
}
