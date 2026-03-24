import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { SkillsChart } from "./SkillsChart";

const SKILLS_QUERY = defineQuery(`*[_type == "skill"] | order(category asc, order asc){
  name,
  category,
  proficiency,
  percentage,
  yearsOfExperience,
  color
}`);

type SkillsChartSkill = React.ComponentProps<typeof SkillsChart>["skills"][number];

export async function SkillsSection() {
  const { data: skills } = await sanityFetch({ query: SKILLS_QUERY });

  if (!skills || skills.length === 0) {
    return null;
  }

  const normalizedSkills: SkillsChartSkill[] = skills.flatMap((skill) => {
    if (
      !skill ||
      typeof skill.name !== "string" ||
      typeof skill.category !== "string" ||
      typeof skill.proficiency !== "string"
    ) {
      return [];
    }
  
    return [
      {
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        percentage: skill.percentage ?? 0,
        yearsOfExperience: skill.yearsOfExperience ?? 0,
        color: skill.color ?? undefined,
      },
    ];
  });

  if (normalizedSkills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="px-6 py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Skills & Expertise
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A comprehensive overview of my technical proficiencies and tools I
            work with daily
          </p>
        </div>

        <SkillsChart skills={normalizedSkills} />
      </div>
    </section>
  );
}