
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Building, GraduationCap, Users, Globe, HandHeart, DollarSign } from "lucide-react";

const Partnerships = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("institutional");

  const tabs = [
    { id: "institutional", label: "Institutional Partnership", icon: Building },
    { id: "financial-aid", label: "Financial Aid", icon: GraduationCap },
    { id: "investors", label: "Investors & Funders", icon: DollarSign },
    { id: "international", label: "International Organizations", icon: Globe }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Partnerships</h1>
              <p className="text-xl text-blue-100 mb-8">
                Join us in transforming academic research and education across Africa
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            {activeTab === "institutional" && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Institutional Partnership</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>Partner Benefits</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <span>Bulk access to expert researchers for your students</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <span>Customized research mentorship programs</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <span>Integration with existing academic systems</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <span>Discounted rates for institutional members</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Partnership Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="institution">Institution Name</Label>
                          <Input id="institution" placeholder="Enter your institution name" />
                        </div>
                        <div>
                          <Label htmlFor="contact-name">Contact Person</Label>
                          <Input id="contact-name" placeholder="Your full name" />
                        </div>
                        <div>
                          <Label htmlFor="contact-email">Email</Label>
                          <Input id="contact-email" type="email" placeholder="contact@institution.edu" />
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea id="message" placeholder="Tell us about your partnership goals..." />
                        </div>
                        <Button className="w-full">Submit Partnership Inquiry</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "financial-aid" && (
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Financial Aid for Students</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Student Application */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5" />
                        <span>Apply for Financial Aid</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        We believe financial constraints shouldn't limit access to quality research guidance.
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li>• Merit-based consultation scholarships</li>
                        <li>• Need-based financial assistance</li>
                        <li>• Work-study program participation</li>
                        <li>• Partner institution discounts</li>
                      </ul>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="student-name">Full Name</Label>
                          <Input id="student-name" placeholder="Enter your full name" />
                        </div>
                        <div>
                          <Label htmlFor="student-email">Email</Label>
                          <Input id="student-email" type="email" placeholder="student@university.edu" />
                        </div>
                        <div>
                          <Label htmlFor="university">University</Label>
                          <Input id="university" placeholder="Your university name" />
                        </div>
                        <div>
                          <Label htmlFor="need-statement">Financial Need Statement</Label>
                          <Textarea id="need-statement" placeholder="Explain your financial situation and how aid would help..." />
                        </div>
                        <Button className="w-full">Apply for Financial Aid</Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Donation Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <HandHeart className="h-5 w-5" />
                        <span>Support Student Education</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Help us provide financial assistance to students who need research guidance but lack the resources.
                      </p>
                      <div className="space-y-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold">Your Impact</h4>
                          <p className="text-sm text-gray-600">$50 sponsors one consultation for a student in need</p>
                        </div>
                      </div>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="donor-name">Donor Name</Label>
                          <Input id="donor-name" placeholder="Enter your name or organization" />
                        </div>
                        <div>
                          <Label htmlFor="donor-email">Email</Label>
                          <Input id="donor-email" type="email" placeholder="donor@email.com" />
                        </div>
                        <div>
                          <Label htmlFor="donation-amount">Donation Amount (USD)</Label>
                          <Input id="donation-amount" type="number" placeholder="50" />
                        </div>
                        <div>
                          <Label htmlFor="donor-message">Message (Optional)</Label>
                          <Textarea id="donor-message" placeholder="Any message for the students..." />
                        </div>
                        <Button className="w-full">Contact for Donation</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "investors" && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Investors & Funders</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      Join us in revolutionizing academic research and education across Africa. ResearchWhoa represents a significant opportunity to impact education while generating sustainable returns.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="font-semibold mb-3">Market Opportunity</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Growing higher education sector in Africa</li>
                          <li>• Increasing demand for research mentorship</li>
                          <li>• Digital transformation in education</li>
                          <li>• Scalable technology platform</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Investment Areas</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Platform development and scaling</li>
                          <li>• Market expansion across Africa</li>
                          <li>• AI and technology enhancement</li>
                          <li>• Partnership development</li>
                        </ul>
                      </div>
                    </div>
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="investor-name">Name/Organization</Label>
                          <Input id="investor-name" placeholder="Enter name or organization" />
                        </div>
                        <div>
                          <Label htmlFor="investor-email">Email</Label>
                          <Input id="investor-email" type="email" placeholder="investor@fund.com" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="investment-interest">Investment Interest</Label>
                        <Textarea id="investment-interest" placeholder="Tell us about your investment goals and interest areas..." />
                      </div>
                      <Button className="w-full">Contact Investment Team</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "international" && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">International Organizations</h2>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Collaboration Opportunities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      Partner with ResearchWhoa to advance education and research capacity across Africa. We welcome collaboration with NGOs, development agencies, and international educational organizations.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="font-semibold mb-3">Partnership Areas</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Capacity building programs</li>
                          <li>• Research infrastructure development</li>
                          <li>• Educational technology initiatives</li>
                          <li>• Cross-border research collaboration</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Potential Partners</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• UN Educational agencies</li>
                          <li>• Development banks and funds</li>
                          <li>• International research councils</li>
                          <li>• Educational foundations</li>
                        </ul>
                      </div>
                    </div>
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="org-name">Organization Name</Label>
                          <Input id="org-name" placeholder="Enter organization name" />
                        </div>
                        <div>
                          <Label htmlFor="org-email">Contact Email</Label>
                          <Input id="org-email" type="email" placeholder="contact@organization.org" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="collaboration-interest">Collaboration Interest</Label>
                        <Textarea id="collaboration-interest" placeholder="Describe your organization's mission and how we might collaborate..." />
                      </div>
                      <Button className="w-full">Initiate Partnership Discussion</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Partnerships;
