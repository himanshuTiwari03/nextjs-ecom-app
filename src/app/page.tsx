"use client"
import Image from "next/image";
import HeroSection from "./components/Home";
import Carousel from "./components/Carosel";
import RecentlyAdded from "./RecentlyAdded/page";
export default function Home() {
  return (

    <div>
    <Carousel />
    <RecentlyAdded />
    </div>

  );
}
