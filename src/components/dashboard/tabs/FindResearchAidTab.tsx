
import { useState } from "react";
import FindResearchAidHeader from "@/components/dashboard/research-aid/FindResearchAidHeader";
import SearchFilters from "@/components/dashboard/research-aid/SearchFilters";
import StatsCards from "@/components/dashboard/research-aid/StatsCards";
import ResearchAidCard from "@/components/dashboard/research-aid/ResearchAidCard";
import { researchAidsData, categories, type ResearchAid } from "@/components/dashboard/research-aid/mockData";

const FindResearchAidTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [researchAids] = useState<ResearchAid[]>(researchAidsData);

  const filteredAids = researchAids.filter(aid => {
    const matchesSearch = searchQuery === "" || 
      aid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aid.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || aid.title.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <FindResearchAidHeader />

      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        categories={categories}
      />

      <StatsCards />

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Available Research Aids
          <span className="text-gray-500 font-normal ml-2">({filteredAids.length} found)</span>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAids.map((aid) => (
            <ResearchAidCard key={aid.id} aid={aid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindResearchAidTab;
