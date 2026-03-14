"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export type TeamMember = {
  image: string;
  name: string;
  role: string;
  bio?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
};

const defaultBio =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

export function TeamMembersSection({ members }: { members: TeamMember[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const member = members[activeIndex];
  const bio = member.bio ?? defaultBio;

  const goPrev = () => setActiveIndex((i) => (i === 0 ? members.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === members.length - 1 ? 0 : i + 1));

  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-white py-16 lg:py-24">
      {/* Large faded grayscale background image + name overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.08]">
          <Image
            src={member.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover grayscale"
            priority={activeIndex === 0}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60"
          aria-hidden
        />
        <span
          className="absolute left-8 top-1/3 select-none text-6xl font-bold uppercase tracking-[0.2em] text-charcoal/10 sm:text-7xl lg:left-16 lg:text-8xl"
          aria-hidden
        >
          {member.name}
        </span>
      </div>

      <div className="relative z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
            Team members
          </h2>
        </div>

        {/* Central profile card — top padding so half-circle overflow has room */}
        <div className="mx-auto mt-8 max-w-2xl px-4 pt-24 sm:px-6 sm:pt-28 lg:mt-12 lg:px-8">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-visible rounded-2xl border border-teal/20 bg-white/60 px-5 pb-5 pt-24 shadow-lg shadow-charcoal/5 ring-1 ring-teal/10 backdrop-blur-md sm:px-6 sm:pt-28 sm:pb-6"
          >
            {/* Profile picture — half circle overflows above the card; pt matches half height so text clears */}
            <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full sm:h-56 sm:w-56">
              <Image
                src={member.image}
                alt={member.name}
                width={224}
                height={224}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-charcoal sm:text-lg">{member.name}</h3>
              <p className="mt-0.5 text-sm text-charcoal/60">{member.role}</p>

                {/* Social icons */}
                <div className="mt-3 flex justify-center gap-3">
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal/50 transition-colors hover:text-teal"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal/50 transition-colors hover:text-teal"
                    aria-label="Twitter"
                  >
                    <TwitterIcon />
                  </a>
                )}
                {member.facebook && (
                  <a
                    href={member.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal/50 transition-colors hover:text-teal"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal/50 transition-colors hover:text-teal"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon />
                  </a>
                )}
                {!member.instagram && !member.twitter && !member.facebook && !member.linkedin && (
                  <div className="flex gap-3">
                    <span className="text-charcoal/30" aria-hidden><InstagramIcon /></span>
                    <span className="text-charcoal/30" aria-hidden><TwitterIcon /></span>
                    <span className="text-charcoal/30" aria-hidden><FacebookIcon /></span>
                    <span className="text-charcoal/30" aria-hidden><LinkedInIcon /></span>
                  </div>
                )}
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-charcoal/80">{bio}</p>

              {/* Prev / Next buttons */}
              <div className="mt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal text-white transition-colors hover:bg-teal/90"
                  aria-label="Previous team member"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal text-white transition-colors hover:bg-teal/90"
                  aria-label="Next team member"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Circular thumbnails carousel with dotted line */}
        <div className="mt-12 flex items-center justify-center px-4">
          <div className="relative flex items-center justify-center gap-2 sm:gap-4">
            {/* Dotted line behind circles */}
            <div
              className="absolute left-1/2 top-1/2 h-0.5 w-full min-w-[200px] -translate-x-1/2 -translate-y-1/2 border-b border-dotted border-charcoal/20 sm:min-w-[280px]"
              aria-hidden
            />
            {members.map((m, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative z-10 h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 shadow-md transition-all sm:h-14 sm:w-14 ${
                  i === activeIndex
                    ? "border-teal ring-2 ring-teal ring-offset-2"
                    : "border-white"
                }`}
                aria-label={`View ${m.name}`}
                aria-current={i === activeIndex ? "true" : undefined}
              >
                <Image
                  src={m.image}
                  alt=""
                  width={56}
                  height={56}
                  className={`h-full w-full object-cover transition-all duration-300 ${
                    i === activeIndex ? "grayscale-0" : "grayscale opacity-70"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
