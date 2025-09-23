
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

const SEOHead = ({ 
  title = "ResearchWhoa - Connecting Students with Research Experts",
  description = "Connect with leading researchers for personalized academic consultations and collaborative research opportunities. Find expert guidance for your research projects.",
  keywords = "research, academic consultation, scholarly collaboration, research experts, academic guidance, research mentorship",
  ogImage = "/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png"
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = description;
      document.head.appendChild(newMetaDescription);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = keywords;
      document.head.appendChild(newMetaKeywords);
    }
    
    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      const ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        const newOGTag = document.createElement('meta');
        newOGTag.setAttribute('property', property);
        newOGTag.content = content;
        document.head.appendChild(newOGTag);
      }
    };
    
    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:image', ogImage);
    updateOGTag('og:type', 'website');
  }, [title, description, keywords, ogImage]);

  return null;
};

export default SEOHead;
