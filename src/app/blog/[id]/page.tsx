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
      title: "Real-time Collaborative Editing",
      description: [
        {
          main: "Seamless Teamwork:",
          sub: "Multiple users can edit documents simultaneously with changes appearing instantly. See who's working where with cursor presence indicators and user attribution for all edits.",
        },
        {
          main: "Enhanced Communication:",
          sub: "Chat functionality integrated directly in documents allows team members to discuss changes in context without switching to external messaging platforms, streamlining the collaboration process.",
        },
        {
          main: "Smart Suggestions:",
          sub: "AI-powered writing suggestions help improve document quality as you type. The system offers grammar corrections, style improvements, and content recommendations to enhance your writing.",
        },
        {
          main: "Comment Resolution System:",
          sub: "Leave comments for specific sections that can be discussed, addressed, and resolved, maintaining a clean document while preserving the conversation history for future reference.",
        },
        {
          main: "Activity Dashboard:",
          sub: "Track document history with a comprehensive view of who made which changes and when. This timeline provides complete visibility into the document's evolution over time.",
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
      title: "Cloud-based Document Storage",
      description: [
        {
          main: "• Automatic Saving:",
          sub: "Never lose work with continuous auto-saving that captures every change, eliminating the worry of unexpected power outages or application crashes.",
        },
        {
          main: "• Access Anywhere:",
          sub: "Access your documents from any device with an internet connection, whether you're at your desk, on your phone, or using a tablet.",
        },
        {
          main: "• Secure Backup:",
          sub: "Documents are securely stored in the cloud, eliminating the risk of local device failures and ensuring your important files are always protected.",
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
      title: "Comprehensive Formatting Tools",
      description: [
        {
          main: "• Rich Text Editing:",
          sub: "Format text with various fonts, sizes, colors, and styles to create professional-looking documents that meet your exact specifications and brand guidelines.",
        },
        {
          main: "Style Consistency:",
          sub: "Apply consistent document styling with customizable templates and style guides. Create and save custom styles to ensure visual harmony across all your organization's documents.",
        },
        {
          main: "Advanced Layout Options:",
          sub: "Organize content with tables, columns, headers, footers, and page numbering. Create structured documents with table of contents generation and section breaks for professional-quality outputs.",
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
      title: "Advanced Sharing & Permissions",
      description: [
        {
          main: "Granular Access Control:",
          sub: "Share documents with specific permissions—view only, comment, or edit. Set individual or group access levels to maintain document security while enabling collaboration.",
        },
        {
          main: "Custom Sharing Links:",
          sub: "Generate shareable links with preset permission levels that can be sent to collaborators without needing to configure access for each user individually, streamlining the sharing workflow.",
        },
        {
          main: "Expiration Settings:",
          sub: "Set time limits on document access to ensure sensitive information remains protected. Temporary access can be granted and automatically revoked after a specified period.",
        },
      ],
      author: {
        name: "Michael Scott",
        avatar: "https://i.pravatar.cc/150?u=michael", // avatar for Michael
      },
      publishedDate: "Apr 05, 2024",
      lastUpdated: "Apr 18, 2024",
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
