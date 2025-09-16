import Image from "next/image";
import HomePage from "./home/page";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Header/>
      <HomePage />
      <Footer/>
    </div>
  );
}
