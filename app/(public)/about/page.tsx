import { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStorySection } from "@/components/about/OurStorySection";
import { WhoWeAreSection } from "@/components/about/WhoWeAreSection";
import { VisionMissionSection } from "@/components/about/VisionMissionSection";
import { StrategySection } from "@/components/about/StrategySection";
import { CoreValuesSection } from "@/components/about/CoreValuesSection";
import { CEOMessageSection } from "@/components/about/CEOMessageSection";
import { TeamMembersSection } from "@/components/about/TeamMembersSection";
import { AboutCTASection } from "@/components/about/AboutCTASection";

const teamMembers = [
  { image: "/images/Team/4.png", name: "Dilru Yoshith", role: "Director / CEO" },
  { image: "/images/Team/5.png", name: "Rumesha Fernando", role: "Senior Outbound Tour Executive" },
  { image: "/images/Team/6.png", name: "Githmi Jayawickrama", role: "Junior Outbound Travel Executive" },
  { image: "/images/Team/7.png", name: "Nishani Kaveesha", role: "Intern" },
  { image: "/images/Team/8.png", name: "Yasas Randeniya", role: "Outbound Travel Executive" },
  { image: "/images/Team/9.png", name: "Achintha Dasun", role: "Senior Sales and Marketing Executive" },
  { image: "/images/Team/10.png", name: "Arjuna Kumarasinghe", role: "Assistant Manager" },
];

export const runtime = "edge";
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About Us | Vacation Vibez",
  description:
    "Trusted travel agency in Sri Lanka & UAE. Personalized packages, expert guidance, hassle-free services, and 24/7 support. Plan your dream trip with Vacation Vibes.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <OurStorySection />
      <WhoWeAreSection />
      <VisionMissionSection />
      <StrategySection />
      <CoreValuesSection />
      <CEOMessageSection />
      <TeamMembersSection members={teamMembers} />
      <AboutCTASection />
    </div>
  );
}
