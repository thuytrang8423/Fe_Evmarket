"use client";
import React from "react";
import WalletManagement from "../../components/WalletPage/WalletManagement";
import AuthWrapper from "../../components/common/AuthWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function WalletPage() {
  return (
    <AuthWrapper loadingMessage="Loading wallet...">
      <Header />
      <WalletManagement />
      <Footer />
    </AuthWrapper>
  );
}