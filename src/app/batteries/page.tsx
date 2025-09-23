import React from "react";
import BatteriesList from "../../components/BatteriesList/BatteriesList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BatteriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BatteriesList />
      <Footer />
    </div>
  );
}
