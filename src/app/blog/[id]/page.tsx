// app/blog/[id]/page.tsx

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react"
import { notFound } from "next/navigation"

// Define blog post type
type BlogPost = {
  id: string;
  title: string;
  description: {
    main: string;
    sub: string;
  }[];
  author: {
    name: string;
    avatar: string;
  };
  publishedDate: string;
  lastUpdated: string;
};

// Function to get blog post by ID
const getBlogPost = (id: string): BlogPost | null => {
  const posts: Record<string, BlogPost> = {
    "1": {
      id: "1",
      title: "Conflict Resolution for Enhanced Control",
      description: [
        {
          main: "Mitigating Data Loss:",
          sub: "Traditional spreadsheets permit concurrent edits without robust conflict resolution, increasing the risk of unintended data overwrites. Implementing an author approval mechanism ensures that conflicting changes are reviewed before finalization, thereby preserving data integrity.",
        },
        {
          main: "Enhancing Collaborative Workflows:",
          sub: "In multi-user environments, structured conflict resolution workflows foster accountability and transparency. Rather than immediately overwriting edits, users can propose changes that are queued for review, ensuring that the most accurate and contextually appropriate data is retained.",
        },
        {
          main: "Version Control and Audit Trails:",
          sub: "Maintaining detailed version histories enables teams to trace changes over time. In case of conflicting updates, prior versions can be referenced to determine the most suitable resolution. Additionally, audit trails promote trust among collaborators by making editing histories fully visible.",
        },
        {
          main: "Customizable Approval Hierarchies:",
          sub: "Not all conflicts are created equal. By introducing customizable approval hierarchies based on user roles and data sensitivity, organizations can optimize conflict handling. Critical changes may require higher-level approvals, while minor edits can be resolved at the peer level.",
        },
        {
          main: "Automated Conflict Detection:",
          sub: "Advanced systems can detect conflicts in real time by monitoring simultaneous edits and highlighting potential issues before they escalate. Proactive conflict alerts reduce downtime and prevent costly errors caused by uncoordinated changes.",
        },
      ],
      author: {
        name: "Sarah Parker",
        avatar: "https://i.pravatar.cc/150?u=sarah", // avatar for Sarah
      },
      publishedDate: "Mar 15, 2024",
      lastUpdated: "Apr 18, 2024",
    },
    "2": {
      id: "2",
      title: "Version Control for Greater Accountability",
      description: [
        {
          main: "• Comprehensive Change Tracking:",
          sub: "Every modification is recorded in a structured commit system, allowing users to track edits with full transparency.",
        },
        {
          main: "• Facilitates Rollbacks & Audit Trails:",
          sub: "Essential for teams managing critical datasets, enabling precise error identification and resolution.",
        },
        {
          main: "Minimizing Spreadsheet Errors:",
          sub: "Studies indicate that 88% to 94% of business spreadsheets contain errors. Implementing structured version control significantly enhances data accuracy and reliability.",
        },
      ],
      author: {
        name: "David Miller",
        avatar: "https://i.pravatar.cc/150?u=david", // avatar for David
      },
      publishedDate: "Mar 20, 2024",
      lastUpdated: "Apr 18, 2024",
    },
    "3": {
      id: "3",
      title: "Optimized for Multi-User Collaboration",
      description: [
        {
          main: "• Ensuring Accuracy Before Merging:",
          sub: "In fields such as finance, legal documentation, and software planning—where accuracy is paramount—our system verifies every proposed change before it is integrated. This multi-step verification prevents errors from entering final datasets and maintains high operational standards.",
        },
        {
          main: "Addressing High-Stakes Spreadsheet Risks:",
          sub: "Spreadsheet inaccuracies have historically led to catastrophic financial outcomes. For example, JPMorgan Chase suffered a $6 billion trading loss in 2012, partly due to undetected spreadsheet errors. Our system introduces rigorous review pipelines, preventing minor oversights from escalating into major setbacks.",
        },
        {
          main: "Real-Time Collaborative Editing:",
          sub: "Unlike traditional methods, our platform supports real-time collaboration without compromising data integrity. Smart locking, change suggestions, and collaborative merging tools ensure users can work simultaneously with confidence.",
        },
      ],
      author: {
        name: "Emily Johnson",
        avatar: "https://i.pravatar.cc/150?u=emily", // avatar for Emily
      },
      publishedDate: "Apr 01, 2024",
      lastUpdated: "Apr 18, 2024",
    },
    "4": {
      id: "4",
      title: "Flexible Data Handling for Organizational Needs",
      description: [
        {
          main: "Adaptive Hierarchical Customization:",
          sub: "Traditional spreadsheets often enforce flat access models, limiting the ability to tailor collaboration workflows. Our platform introduces adaptive hierarchical structures, enabling organizations to set editing rights, review gates, and role-specific merge strategies aligned with operational needs.",
        },
        {
          main: "Custom Merge Strategies by Department:",
          sub: "Marketing, finance, legal, and engineering teams each have unique workflows. Our system supports customized merge behaviors per department, ensuring that changes are integrated with respect to the specific priorities and regulatory requirements of each domain.",
        },
        {
          main: "Scalable Permission Management:",
          sub: "As organizations grow, managing access at scale becomes complex. Our flexible permissioning framework evolves alongside your team's size and structure, maintaining security without sacrificing usability.",
        },
      ],
      author: {
        name: "Michael Scott",
        avatar: "https://i.pravatar.cc/150?u=michael", // avatar for Michael
      },
      publishedDate: "Apr 05, 2024",
      lastUpdated: "Apr 18, 2024",
    },
  };
  

  return posts[id] || null;
};

interface BlogDetailPageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const blogPost = getBlogPost(params.id);

  if (!blogPost) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      <div className="container px-4 py-16 mx-auto max-w-4xl">
        <Card className="bg-[#252525] border-[#333333] overflow-hidden">
          <CardHeader className="space-y-6 pb-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-[#5f62ff] to-[#678dfd] bg-clip-text text-transparent">
                {blogPost.title}
              </h1>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 border-2 border-[#5f62ff]/20">
                    {blogPost.author.avatar ? (
                      <img
                        src={blogPost.author.avatar}
                        alt={blogPost.author.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback>
                        {blogPost.author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm text-gray-300">
                      <UserIcon className="w-4 h-4 mr-1 text-[#5f62ff]" />
                      <span>{blogPost.author.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-[#5f62ff]" />
                  <span>Published {blogPost.publishedDate}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2 text-[#5f62ff]" />
                  <span>Updated {blogPost.lastUpdated}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-[#333333]" />
          </CardHeader>

          <CardContent>
            <div className="prose prose-invert prose-lg max-w-none">
              {blogPost.description.map((item, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-2">{item.main}</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{item.sub}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
