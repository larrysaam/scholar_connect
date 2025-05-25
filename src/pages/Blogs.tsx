
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How to Write an Effective Research Proposal",
      excerpt: "Learn the essential components of a compelling research proposal that will impress your supervisors and funding committees.",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      category: "Research Tips",
      image: "/public/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Art of Academic Collaboration",
      excerpt: "Discover how to build meaningful partnerships with researchers across different institutions and disciplines.",
      author: "Prof. Michael Chen",
      date: "2024-01-12",
      category: "Collaboration",
      image: "/public/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Navigating Academic Publishing in 2024",
      excerpt: "Understanding the current landscape of academic publishing, from traditional journals to open access platforms.",
      author: "Dr. Emily Rodriguez",
      date: "2024-01-10",
      category: "Publishing",
      image: "/public/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Building Your Academic Network",
      excerpt: "Strategies for creating and maintaining professional relationships that will support your research career.",
      author: "Dr. James Wilson",
      date: "2024-01-08",
      category: "Networking",
      image: "/public/lovable-uploads/0c2151ac-5e74-4b77-86a9-9b359241cfca.png",
      readTime: "4 min read"
    },
    {
      id: 5,
      title: "Mastering Literature Reviews",
      excerpt: "A comprehensive guide to conducting thorough literature reviews that form the foundation of quality research.",
      author: "Dr. Lisa Thompson",
      date: "2024-01-05",
      category: "Research Methods",
      image: "/public/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      readTime: "8 min read"
    },
    {
      id: 6,
      title: "The Future of Research Collaboration",
      excerpt: "Exploring how digital platforms are transforming the way researchers connect and collaborate globally.",
      author: "Prof. David Martinez",
      date: "2024-01-03",
      category: "Technology",
      image: "/public/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png",
      readTime: "6 min read"
    }
  ];

  const categories = ["All", "Research Tips", "Collaboration", "Publishing", "Networking", "Research Methods", "Technology"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Research Insights & Tips</h1>
              <p className="text-xl text-blue-100">
                Discover expert advice, research strategies, and academic insights from leading researchers
              </p>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className="mb-2"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-sm text-gray-500">{post.readTime}</span>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter to receive the latest research insights and tips directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blogs;
