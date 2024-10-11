import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { TapeSection } from "@/sections/Tape";
import { InfiniteScroll } from "@/sections/InfiniteScroll";
import { Footer } from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <TapeSection />
      <Hero />
      <InfiniteScroll />
      <Footer />
    </>
  );
}
