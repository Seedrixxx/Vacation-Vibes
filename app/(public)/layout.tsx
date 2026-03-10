import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { MainWithNavbarSpace } from "@/components/layout/MainWithNavbarSpace";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <MainWithNavbarSpace id="main-content">
        <div className="flex-1">{children}</div>
      </MainWithNavbarSpace>
      <Footer />
      <ChatWidget />
    </>
  );
}
