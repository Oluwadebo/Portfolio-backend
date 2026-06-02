import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    liveUrl: String,
    githubUrl: String,
    tags: [String],
    featured: Boolean,
    order: Number,
    clicks: { live: Number, github: Number },
  },
  { timestamps: true },
);

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

const mockProjects = [
  {
    title: "Laundry Logistics Platform",
    description:
      "Real-time order tracking system for a laundry business. Customers place orders, riders accept and deliver with handover verification codes at each stage.",
    image:
      "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    tags: ["Next.js", "Node.js", "MongoDB", "Socket.io"],
    featured: true,
    order: 1,
    clicks: { live: 0, github: 0 },
  },
  {
    title: "Blog CMS Platform",
    description:
      "Full-featured blogging platform with a custom CMS, markdown editor, SEO optimization, and category management for content creators.",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    featured: false,
    order: 2,
    clicks: { live: 0, github: 0 },
  },
  {
    title: "Portfolio CMS & Analytics",
    description:
      "This portfolio itself — built with a hidden admin dashboard, custom visitor analytics, URL preview scraping, and full project management.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    tags: ["Next.js", "Node.js", "MongoDB", "Express"],
    featured: true,
    order: 3,
    clicks: { live: 0, github: 0 },
  },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("[DB] Connected");

  await Project.deleteMany({});
  console.log("Cleared existing projects");

  await Project.insertMany(mockProjects);
  console.log(`✅ ${mockProjects.length} mock projects seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
