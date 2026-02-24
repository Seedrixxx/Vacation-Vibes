import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
