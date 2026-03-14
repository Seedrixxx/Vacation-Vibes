import { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStorySection } from "@/components/about/OurStorySection";
import { WhoWeAreSection } from "@/components/about/WhoWeAreSection";
import { VisionMissionSection } from "@/components/about/VisionMissionSection";
import { CoreValuesSection } from "@/components/about/CoreValuesSection";
import { CEOMessageSection } from "@/components/about/CEOMessageSection";
import { TeamMembersSection } from "@/components/about/TeamMembersSection";
import { AboutCTASection } from "@/components/about/AboutCTASection";

const teamMembers = [
  { image: "/images/Team/4.png", name: "Team Member", role: "Travel Expert" },
  { image: "/images/Team/5.png", name: "Team Member", role: "Travel Expert" },
  { image: "/images/Team/6.png", name: "Team Member", role: "Travel Expert" },
  { image: "/images/Team/7.png", name: "Team Member", role: "Travel Expert" },
  { image: "/images/Team/8.png", name: "Team Member", role: "Travel Expert" },
  { image: "/images/Team/9.png", name: "Team Member", role: "Travel Expert" },
  { image: "/images/Team/10.png", name: "Team Member", role: "Travel Expert" },
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
      <CoreValuesSection />
      <CEOMessageSection />
      <TeamMembersSection members={teamMembers} />
      <AboutCTASection />
    </div>
  );
}
