import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, GraduationCap, Brain, Award, Loader2 } from "lucide-react";
import { useResearchStats } from "@/hooks/useResearchStats";
import { useResearchAidStats } from "@/hooks/useResearchAidStats";

const ResearcherAidStats = () => {
  const { stats: researchStats, loading: researchLoading } = useResearchStats();
  const { totalConsultations, completionRate, loading: aidStatsLoading } = useResearchAidStats();
  
  const loading = researchLoading || aidStatsLoading;
  return (
    <div className="space-y-6">
      {/* Researcher Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6 text-center">
            <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : researchStats.researchers.total}
            </div>
            <div className="text-sm text-gray-600 font-medium">Expert Researchers</div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6 text-center">
            <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : researchStats.researchers.fields}
            </div>            <div className="text-sm text-gray-600 font-medium">Research Fields</div>
          </CardContent>
        </Card>
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardContent className="p-6 text-center">
            <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : totalConsultations}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Completed Consultations
              {!loading && completionRate > 0 && (
                <span className="block text-xs text-amber-600 mt-1">
                  {Math.round(completionRate)}% completion rate
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        
       </div>

      {/* Research Aid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6 text-center">
            <div className="bg-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : researchStats.aids.total}
            </div>
            <div className="text-sm text-gray-600 font-medium">Research Aids</div>
          </CardContent>
        </Card>
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
          <CardContent className="p-6 text-center">
            <div className="bg-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : researchStats.aids.specialties}
            </div>
            <div className="text-sm text-gray-600 font-medium">Aid Specialties</div>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardContent className="p-6 text-center">
            <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${Math.round(completionRate)}%`}
            </div>
            <div className="text-sm text-gray-600 font-medium">Success Rate</div>
          </CardContent>
        </Card>
        
        
      </div>
    </div>
  );
};

export default ResearcherAidStats;
