import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/NavBar";
import NewsLetter from "@/components/NewsLetter";
import Image from "next/image";
export default function Home() {



  return (
    <div className="">
      <Navbar/>
      <Hero />
      <NewsLetter/>
      <Marquee />
      <Footer />
    </div>
  );
}
