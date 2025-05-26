
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface MembershipsSectionProps {
  memberships: string[];
  isEditing: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

const MembershipsSection = ({ memberships, isEditing, onAdd, onRemove, onUpdate }: MembershipsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Professional Memberships</CardTitle>
          {isEditing && (
            <Button size="sm" variant="outline" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Membership
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {memberships.map((membership, index) => (
          <div key={index} className="flex items-center gap-4">
            <Input
              value={membership}
              onChange={(e) => onUpdate(index, e.target.value)}
              disabled={!isEditing}
              className="flex-1"
            />
            {isEditing && (
              <Button size="sm" variant="ghost" onClick={() => onRemove(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MembershipsSection;
