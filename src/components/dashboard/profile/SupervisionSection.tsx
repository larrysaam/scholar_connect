
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupervisionData {
  hnd: string;
  undergraduate: string;
  masters: string;
  phd: string;
  postdoc: string;
}

interface SupervisionSectionProps {
  supervision: SupervisionData;
  isEditing: boolean;
  onUpdate: (field: keyof SupervisionData, value: string) => void;
}

const SupervisionSection = ({ supervision, isEditing, onUpdate }: SupervisionSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervision</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="hnd">HND</Label>
            <Input
              id="hnd"
              type="number"
              value={supervision.hnd}
              onChange={(e) => onUpdate('hnd', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="undergraduate">Undergraduate</Label>
            <Input
              id="undergraduate"
              type="number"
              value={supervision.undergraduate}
              onChange={(e) => onUpdate('undergraduate', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="masters">Master's</Label>
            <Input
              id="masters"
              type="number"
              value={supervision.masters}
              onChange={(e) => onUpdate('masters', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phd">PhD</Label>
            <Input
              id="phd"
              type="number"
              value={supervision.phd}
              onChange={(e) => onUpdate('phd', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="postdoc">Post Doctorate</Label>
            <Input
              id="postdoc"
              type="number"
              value={supervision.postdoc}
              onChange={(e) => onUpdate('postdoc', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisionSection;
