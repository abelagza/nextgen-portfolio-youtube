import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const EXPERIENCE_QUERY =
  defineQuery(`*[_type == "experience"] | order(startDate desc){
  company,
  position,
  employmentType,
  location,
  startDate,
  endDate,
  current,
  description,
  responsibilities,
  achievements,
  technologies[]->{name, category},
  companyLogo,
  companyWebsite
}`);

export async function ExperienceSection() {
  const { data: experiences } = await sanityFetch({ query: EXPERIENCE_QUERY });

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const formatDate = (date?: string | null) => {
    if (!date) return "N/A";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="experience" className="px-6 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Work Experience
          </h2>
          <p className="text-xl text-muted-foreground">
            My professional journey
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <div
              key={`${exp.company}-${exp.position}-${exp.startDate}`}
              className="relative border-l-2 border-muted pb-8 pl-8 last:border-l-0"
            >
              <div className="absolute top-0 left-[-9px] h-4 w-4 rounded-full border-4 border-background bg-primary" />

              <div className="@container/card rounded-lg border bg-card p-4 transition-shadow hover:shadow-lg @md/card:p-6">
                <div className="mb-4 flex flex-col gap-4 @md/card:flex-row @md/card:items-start">
                  {exp.companyLogo?.asset && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border @md/card:h-16 @md/card:w-16">
                      <Image
                        src={urlFor(exp.companyLogo).width(64).height(64).url()}
                        alt={`${exp.company} company logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-xl font-semibold @md/card:text-2xl">
                      {exp.position}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-medium text-primary @md/card:text-lg">
                        {exp.company}
                      </p>

                      {exp.employmentType && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground @md/card:text-sm">
                            {exp.employmentType}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground @md/card:text-sm">
                      <span>
                        {formatDate(exp.startDate)} -{" "}
                        {exp.current
                          ? "Present"
                          : exp.endDate
                            ? formatDate(exp.endDate)
                            : "N/A"}
                      </span>

                      {exp.location && (
                        <>
                          <span>•</span>
                          <span className="truncate">{exp.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <div className="mb-4 text-sm text-muted-foreground @md/card:text-base">
                    <PortableText value={exp.description} />
                  </div>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold @md/card:text-base">
                      Key Responsibilities:
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground @md/card:text-sm">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={`${exp.company}-resp-${idx}`}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold @md/card:text-base">
                      Achievements:
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground @md/card:text-sm">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={`${exp.company}-achievement-${idx}`}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 @md/card:gap-2">
                    {exp.technologies.map((tech, techIdx) => {
                      const techData =
                        tech && typeof tech === "object" && "name" in tech
                          ? tech
                          : null;

                      return techData?.name ? (
                        <span
                          key={`${exp.company}-tech-${techIdx}`}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary @md/card:px-3 @md/card:py-1"
                        >
                          {techData.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
