"use client"
import Content from "@/components/Homepage/Content";
import LastContent from "@/components/Homepage/LastContent";
import Reason from "@/components/Homepage/Reason";
import SearchContent from "@/components/Homepage/SearchContent";
import TopBattery from "@/components/Homepage/TopBattery";
import TopEV from "@/components/Homepage/TopEV";

export default function HomePage() {
  return (
    <div>
      <main>
        <Content />
        <SearchContent />
        <TopEV />
        <TopBattery />
        <Reason />
        <LastContent />
      </main>
    </div>
  );
}