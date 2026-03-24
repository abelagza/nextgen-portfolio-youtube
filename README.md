This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### HeroSection
**File:** `components/Sections/HeroSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches hero/profile data from Sanity
- `next-sanity` → defines the HERO_QUERY GROQ query
- `@/sanity/lib/image` → generates the profile image URL
- `../profileImage` → renders the profile image UI
- `@/components/ui/background-ripple-effect` → renders the animated hero background
- `@/components/ui/layout-text-flip` → renders animated headline text
- `next/link` → renders external social links

**Sanity dependency:**
- Profile singleton document with ID: `singleton-profile`

**Fields used:**
- `firstName`
- `lastName`
- `headline`
- `headlineStaticText`
- `headlineAnimatedWords`
- `headlineAnimationDuration`
- `shortBio`
- `email`
- `phone`
- `location`
- `availability`
- `socialLinks`
- `yearsOfExperience`
- `profileImage`

### AboutSection
**File:** `components/Sections/AboutSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches profile data
- `next-sanity` → defines ABOUT_QUERY
- `@portabletext/react` → renders rich text (fullBio)
- `next/link` → handles internal/external links inside rich text

**Sanity dependency:**
- Profile singleton document (`singleton-profile`)

**Fields used:**
- `firstName`
- `lastName`
- `fullBio`
- `yearsOfExperience`
- `stats`
- `email`
- `phone`
- `location`

**Rendering logic:**
- `fullBio` → rendered via PortableText with custom components
- `stats` → rendered as responsive grid (label + value)
- link marks → handled with Next.js Link (external detection)


### SkillsSection
**File:** `components/Sections/SkillsSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches skills data
- `next-sanity` → defines SKILLS_QUERY
- `./SkillsChart` → renders skills visualization

**Sanity dependency:**
- Skill documents (`_type == "skill"`)

**Fields used:**
- `name`
- `category`
- `proficiency`
- `percentage`
- `yearsOfExperience`
- `color`

**Key logic:**
- Normalizes Sanity data to match strict UI types
- Filters out invalid/null entries
- Applies defaults for numeric fields

**Important coupling:**
- Uses `React.ComponentProps<typeof SkillsChart>` to derive type
- Any change in `SkillsChart` impacts this section

### ExperienceSection
**File:** `components/Sections/ExperienceSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches experience data
- `next-sanity` → defines EXPERIENCE_QUERY
- `@/sanity/lib/image` → generates company logo URLs
- `next/image` → renders optimized logo images
- `@portabletext/react` → renders rich text descriptions

**Sanity dependency:**
- Experience documents (`_type == "experience"`)

**Indirect Sanity dependency:**
- Skill documents, via:
  - `technologies[]->{name, category}`

**Fields used:**
- `company`
- `position`
- `employmentType`
- `location`
- `startDate`
- `endDate`
- `current`
- `description`
- `responsibilities`
- `achievements`
- `technologies`
- `companyLogo`
- `companyWebsite`

**Rendering logic:**
- `companyLogo` → rendered with `next/image` + `urlFor`
- `description` → rendered with PortableText
- `responsibilities` → rendered as bullet list
- `achievements` → rendered as bullet list
- `technologies` → rendered as skill badges
- `startDate` / `endDate` → formatted with local `formatDate()`

### EducationSection
**File:** `components/Sections/EducationSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches education data
- `next-sanity` → defines EDUCATION_QUERY
- `@/sanity/lib/image` → generates logo URLs
- `next/image` → renders optimized education logos
- `next/link` → renders institution website links
- `@tabler/icons-react` → provides date, award, and external link icons
- `../ui/dotted-glow-background` → renders decorative background effect

**Sanity dependency:**
- Education documents (`_type == "education"`)

**Fields used:**
- `institution`
- `degree`
- `fieldOfStudy`
- `startDate`
- `endDate`
- `current`
- `gpa`
- `description`
- `achievements`
- `logo`
- `website`
- `order`

**Local type dependency:**
- `EducationItem` → custom local type used to cast `sanityFetch` results

**Rendering logic:**
- `logo` → rendered with `next/image` + `urlFor`
- `startDate` / `endDate` → formatted with local `formatDate()`
- `gpa` → rendered as badge with icon
- `description` → rendered as plain text
- `achievements` → rendered as honors list
- `website` → rendered as external link
- `DottedGlowBackground` → decorative animated section background

### ProjectsSection
**File:** `components/Sections/ProjectsSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches project data
- `next-sanity` → defines PROJECTS_QUERY
- `@/sanity/lib/image` → generates project cover image URLs
- `next/image` → renders optimized cover images
- `next/link` → renders live demo and GitHub links

**Sanity dependency:**
- Project documents (`_type == "project"`)

**Indirect Sanity dependency:**
- Skill documents, via:
  - `technologies[]->{name, category, color}`

**Fields used:**
- `title`
- `slug`
- `tagline`
- `category`
- `liveUrl`
- `githubUrl`
- `coverImage`
- `technologies`

**Query constraints:**
- only featured projects
- ordered by `order asc`
- limited to first 6 results

**Rendering logic:**
- `coverImage` → rendered with `next/image` + `urlFor`
- `slug.current` → used as React key
- `technologies` → renders up to 4 tech badges, then `+N`
- `liveUrl` → renders “Live Demo” button
- `githubUrl` → renders “GitHub” button

### CertificationsSection
**File:** `components/Sections/CertificationsSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches certification data
- `next-sanity` → defines CERTIFICATIONS_QUERY
- `@/sanity/lib/image` → generates badge/logo URLs
- `next/image` → renders optimized certification logos
- `next/link` → renders credential verification links
- `@tabler/icons-react` → provides external link icon
- `@/components/ui/comet-card` → renders interactive 3D card container

**Sanity dependency:**
- Certification documents (`_type == "certification"`)

**Indirect Sanity dependency:**
- Skill documents, via:
  - `skills[]->{name, category}`

**Fields used:**
- `name`
- `issuer`
- `issueDate`
- `expiryDate`
- `credentialId`
- `credentialUrl`
- `logo`
- `description`
- `skills`
- `order`

**Rendering logic:**
- `issueDate` / `expiryDate` → formatted with local `formatDate()`
- `expiryDate` → checked with `isExpired()` for expired state
- `logo` → rendered with `next/image` + `urlFor`
- `skills` → renders up to 4 skill badges
- `credentialId` → rendered as monospace text
- `credentialUrl` → renders external verification button
- `CometCard` → wraps each certification card for visual interaction

### TestimonialsSection
**File:** `components/Sections/TestimonialSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches testimonial data
- `next-sanity` → defines TESTIMONIALS_QUERY
- `@/sanity/lib/image` → generates avatar image URLs
- `@/components/ui/animated-testimonials` → renders animated testimonial carousel

**Sanity dependency:**
- Testimonial documents (`_type == "testimonial"`)

**Fields used:**
- `name`
- `position`
- `company`
- `testimonial`
- `rating`
- `date`
- `avatar`
- `companyLogo`
- `linkedinUrl`

**Query constraints:**
- only featured testimonials
- ordered by `order asc`

**Rendering logic:**
- maps raw Sanity data into `AnimatedTestimonials` prop shape
- `designation` is built from `position` + `company`
- `avatar` uses Sanity image URL if present
- falls back to hardcoded external image URL if avatar is missing
- rendered through `AnimatedTestimonials` with `autoplay`

**Additional dependency note:**
- external fallback image may require allowed remote image host configuration in `next.config.ts`

### ServicesSection
**File:** `components/Sections/ServicesSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches service data
- `next-sanity` → defines SERVICES_QUERY
- `@/sanity/lib/image` → generates service icon URLs
- `next/image` → renders optimized service icons
- `@portabletext/react` → renders rich text full descriptions
- `@tabler/icons-react` → provides feature check icons
- `lucide-react` → provides featured services star icon

**Sanity dependency:**
- Service documents (`_type == "service"`)

**Indirect Sanity dependency:**
- Skill documents, via:
  - `technologies[]->{name, category}`

**Fields used:**
- `title`
- `slug`
- `icon`
- `shortDescription`
- `fullDescription`
- `features`
- `technologies`
- `deliverables`
- `pricing`
- `timeline`
- `featured`
- `order`

**Rendering logic:**
- services are split into `featured` and `regular`
- `icon` → rendered with `next/image` + `urlFor`
- `fullDescription` → rendered with PortableText for featured services
- `features` → rendered as lists, with regular services limited to first 3
- `pricing` → rendered through local `formatPrice()`
- `timeline` → shown as metadata
- `technologies` → rendered as tech badges

### AchievementsSection
**File:** `components/Sections/AchievementsSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches achievement data
- `next-sanity` → defines ACHIEVEMENTS_QUERY
- `@/sanity/lib/image` → generates achievement image URLs
- `next/image` → renders optimized achievement images
- `next/link` → renders external “Learn More” links
- `@tabler/icons-react` → provides featured heading icon and external link icon

**Sanity dependency:**
- Achievement documents (`_type == "achievement"`)

**Fields used:**
- `title`
- `type`
- `issuer`
- `date`
- `description`
- `image`
- `url`
- `featured`
- `order`

**Rendering logic:**
- achievements are split into `featured` and `regular`
- `date` → formatted with local `formatDate()`
- `type` → rendered using `getTypeColor()` and `getTypeLabel()`
- `image` → rendered with `next/image` + `urlFor`
- `url` → renders external “Learn More” link
- featured section heading uses `IconStar`

### BlogSection
**File:** `components/Sections/BlogSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches blog post data
- `next-sanity` → defines BLOG_QUERY
- `@/sanity/lib/image` → generates featured image URLs
- `next/image` → renders optimized featured images
- `next/link` → renders links to blog detail pages

**Sanity dependency:**
- Blog documents (`_type == "blog"`)

**Fields used:**
- `title`
- `slug`
- `excerpt`
- `category`
- `tags`
- `publishedAt`
- `readTime`
- `featuredImage`

**Route dependency:**
- `/blog/[slug]` or equivalent dynamic blog post route

**Rendering logic:**
- `publishedAt` → formatted with local `formatDate()`
- `featuredImage` → rendered with `next/image` + `urlFor`
- `tags` → first 3 tags rendered as badges
- `slug.current` → used for React key and blog detail link
- `readTime` → displayed as “X min read”

### ContactSection
**File:** `components/Sections/ContactSection.tsx`

**Connected to:**
- `@/sanity/lib/live` → fetches profile data
- `next-sanity` → defines PROFILE_QUERY
- `next/link` → renders email, phone, and social links
- `@/components/ui/world-map` → renders background map
- `./ContactForm` → handles contact form submission

**Sanity dependency:**
- Profile document (`_id == "singleton-profile"`)

**Fields used:**
- `email`
- `phone`
- `location`
- `socialLinks`

**Social links:**
- `github`
- `linkedin`
- `twitter`
- `website`
- `medium`
- `devto`
- `youtube`

**Rendering logic:**
- each field is conditionally rendered (missing data = hidden UI)
- `email` → rendered as `mailto:` link
- `phone` → rendered as `tel:` link
- `socialLinks` → dynamically renders platform buttons
- includes external components:
  - `WorldMapDemo`
  - `ContactForm`