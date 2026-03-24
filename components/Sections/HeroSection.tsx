import Link from "next/link";
import { defineQuery } from "next-sanity";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ProfileImage } from "../profileImage";

const HERO_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  headline,
  headlineStaticText,
  headlineAnimatedWords,
  headlineAnimationDuration,
  shortBio,
  email,
  phone,
  location,
  availability,
  socialLinks,
  yearsOfExperience,
  profileImage
}`);

export default async function HeroSection() {
  const { data: profile } = await sanityFetch({ query: HERO_QUERY });
  if (!profile) return null;

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-20"
    >
      <BackgroundRippleEffect rows={80} cols={100} cellSize={25} />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
              {profile.firstName}{" "}
              <span className="text-primary">{profile.lastName}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              {profile.headlineStaticText &&
              profile.headlineAnimatedWords &&
              profile.headlineAnimatedWords.length > 0 ? (
                <LayoutTextFlip
                  text={profile.headlineStaticText}
                  words={profile.headlineAnimatedWords}
                  duration={profile.headlineAnimationDuration || 3000}
                />
              ) : (
                <p className="text-xl font-medium text-muted-foreground md:text-2xl lg:text-3xl">
                  {profile.headline}
                </p>
              )}
            </div>

            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {profile.shortBio}
            </p>

            {profile.socialLinks && (
              <div className="flex flex-wrap gap-3 pt-4 md:gap-4">
                {profile.socialLinks.github && (
                  <Link
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-accent md:px-6 md:py-3 md:text-base"
                  >
                    GitHub
                  </Link>
                )}

                {profile.socialLinks.linkedin && (
                  <Link
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-accent md:px-6 md:py-3 md:text-base"
                  >
                    LinkedIn
                  </Link>
                )}

                {profile.socialLinks.twitter && (
                  <Link
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-accent md:px-6 md:py-3 md:text-base"
                  >
                    Twitter
                  </Link>
                )}

                {profile.socialLinks.website && (
                  <Link
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-accent md:px-6 md:py-3 md:text-base"
                  >
                    Website
                  </Link>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4 text-xs text-muted-foreground md:gap-6 md:text-sm">
              {profile.email && (
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span className="truncate">{profile.email}</span>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.availability && (
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>{profile.availability}</span>
                </div>
              )}
            </div>
          </div>

          {profile.profileImage?.asset && (
            <ProfileImage
              imageUrl={urlFor(profile.profileImage)
                .width(600)
                .height(600)
                .url()}
              firstName={profile.firstName || ""}
              lastName={profile.lastName || ""}
            />
          )}
        </div>
      </div>
    </section>
  );
}
