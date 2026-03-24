import { defineQuery } from "next-sanity";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const TESTIMONIALS_QUERY =
  defineQuery(`*[_type == "testimonial" && featured == true] | order(order asc){
  name,
  position,
  company,
  testimonial,
  rating,
  date,
  avatar,
  companyLogo,
  linkedinUrl
}`);

export async function TestimonialsSection() {
  const { data: testimonials } = await sanityFetch({
    query: TESTIMONIALS_QUERY,
  });

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const animatedTestimonials = testimonials.map((testimonial: any) => ({
    name: testimonial.name,
    quote: testimonial.testimonial,
    designation: [testimonial.position, testimonial.company]
      .filter(Boolean)
      .join(" · "),
    src: testimonial.avatar
      ? urlFor(testimonial.avatar).width(500).height(500).url()
      : "https://heroshotphotography.com/wp-content/uploads/2023/04/Hero-Shot-Photography-1982-682x1024.jpeg",
  }));

  return (
    <section id="testimonials">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Client Testimonials
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          What people say about working with me
        </p>
      </div>
      <AnimatedTestimonials testimonials={animatedTestimonials} autoplay />
    </section>
  );
}
