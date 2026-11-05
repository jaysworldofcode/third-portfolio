import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar currentSection="blog" />
      <main className="min-h-[70svh] pt-24">{children}</main>
      <Footer />
    </>
  );
}
