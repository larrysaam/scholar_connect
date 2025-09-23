
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  type: "student" | "researcher";
};

const TestimonialCard = ({ quote, author, role, type }: TestimonialProps) => (
  <Card className="h-full">
    <CardContent className="p-6">
      <Quote className="h-8 w-8 text-blue-500 opacity-50 mb-4" />
      <p className="italic text-gray-700 mb-4">{quote}</p>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
          {author.split(" ").map(name => name[0]).join("")}
        </div>
        <div className="ml-3">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-xs px-2 py-1 rounded-full ${type === "student" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
          {type === "student" ? "Student" : "Researcher"}
        </span>
      </div>
    </CardContent>
  </Card>
);

const Testimonials = () => {
  const testimonials = [
    {
      quote: "ResearchWhoa transformed my research journey. The guidance I received helped me complete my dissertation with confidence.",
      author: "Michael Johnson",
      role: "PhD Student, Economics",
      type: "student" as const
    },
    {
      quote: "As a researcher, connecting with students through this platform has been rewarding. It's fulfilling to guide the next generation of academics.",
      author: "Dr. Emily Rodriguez",
      role: "Associate Professor, Biology",
      type: "researcher" as const
    },
    {
      quote: "The expert consultation I received clarified my methodology issues that had been blocking my progress for months.",
      author: "Sarah Williams",
      role: "Master's Student, Psychology",
      type: "student" as const
    },
    {
      quote: "This platform bridges the gap between experienced researchers and students who need specialized guidance. It's revolutionary for academic mentorship.",
      author: "Prof. James Wilson",
      role: "Professor, Computer Science",
      type: "researcher" as const
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">What People Say</h2>
          <p className="text-gray-600">Hear from our community of students and researchers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              type={testimonial.type}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
