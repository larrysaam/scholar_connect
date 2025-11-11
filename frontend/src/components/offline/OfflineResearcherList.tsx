import { useEffect, useState } from 'react';
import { useOfflineData, useOfflineState } from '@/hooks/useOfflineData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Star, Users, WifiOff, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Researcher {
  id: string;
  full_name: string;
  bio: string;
  expertise: string[];
  location: string;
  rating: number;
  total_reviews: number;
  hourly_rate: number;
  avatar_url?: string;
  verified: boolean;
}

export const OfflineResearcherList = () => {
  const { isOnline, fetchWithFallback, trackPageVisit } = useOfflineData();
  const [researchers, setResearchers] = useOfflineState<Researcher[]>('researchers-list', [], 60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trackPageVisit('/researchers');
    loadResearchers();
  }, []);

  const loadResearchers = async () => {
    setLoading(true);
    setError(null);

    const result = await fetchWithFallback(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?role=eq.researcher&verified=eq.true&select=*`,
      {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      },
      'researchers-list',
      60 // Cache for 1 hour
    );

    if (result.data) {
      setResearchers(result.data);
      setFromCache(result.fromCache);
    } else if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleResearcherClick = (researcher: Researcher) => {
    // Cache individual researcher data
    const { cacheData } = useOfflineData();
    cacheData(`researcher-${researcher.id}`, researcher, 120); // Cache for 2 hours
    navigate(`/researcher/${researcher.id}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading && researchers.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Offline/Cache Status */}
      {(fromCache || !isOnline) && (
        <Alert className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <WifiOff className="h-4 w-4 text-blue-600" />
            ) : (
              <Clock className="h-4 w-4 text-blue-600" />
            )}
            <AlertDescription className="text-blue-800">
              {!isOnline 
                ? "You're viewing cached researchers from when you were online."
                : "Showing cached data while checking for updates."}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Error State */}
      {error && researchers.length === 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}. {!isOnline && "Connect to the internet to load fresh researcher data."}
          </AlertDescription>
        </Alert>
      )}

      {/* Researchers Grid */}
      {researchers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researchers.map((researcher) => (
            <Card 
              key={researcher.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleResearcherClick(researcher)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={researcher.avatar_url} alt={researcher.full_name} />
                    <AvatarFallback>{getInitials(researcher.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{researcher.full_name}</CardTitle>
                      {researcher.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{researcher.rating.toFixed(1)}</span>
                        <span>({researcher.total_reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{researcher.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 mb-3">
                  {researcher.bio}
                </CardDescription>
                <div className="flex flex-wrap gap-1 mb-3">
                  {researcher.expertise.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {researcher.expertise.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{researcher.expertise.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-600">
                    ${researcher.hourly_rate}/hr
                  </span>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No researchers found</h3>
          <p className="text-gray-600">
            {!isOnline 
              ? "Connect to the internet to discover researchers."
              : "Try adjusting your search criteria or check back later."}
          </p>
        </div>
      )}

      {/* Refresh Button */}
      {isOnline && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={loadResearchers}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Researchers"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OfflineResearcherList;
