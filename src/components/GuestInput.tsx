import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Guest } from "@/pages/Index";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Theme, themeConfigs } from "@/lib/themeConfig";

interface GuestInputProps {
  chairCount: number;
  onComplete: (guests: Guest[]) => void;
  theme?: Theme;
}

export const GuestInput = ({ chairCount, onComplete, theme = 'christmas' }: GuestInputProps) => {
  const tc = themeConfigs[theme];
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);

  const addGuest = () => {
    if (!guestName.trim()) {
      toast.error("Indtast venligst et gæst navn!");
      return;
    }
    if (guests.length >= chairCount) {
      toast.error(`Maksimalt ${chairCount} gæster tilladt!`);
      return;
    }
    setGuests([...guests, { name: guestName.trim(), seated: false }]);
    setGuestName("");
    toast.success(`${guestName} tilføjet til festen! 🎉`);
  };

  const removeGuest = (index: number) => {
    const removed = guests[index];
    setGuests(guests.filter((_, i) => i !== index));
    toast.success(`${removed.name} fjernet fra festen`);
  };

  const handleComplete = () => {
    if (guests.length === 0) {
      toast.error("Tilføj venligst mindst én gæst!");
      return;
    }
    if (guests.length > chairCount) {
      toast.error(`Du har ${chairCount} stole, men ${guests.length} gæster!`);
      return;
    }
    onComplete(guests);
    toast.success(`Lad siddepladserne begynde! ${tc.characterEmoji}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 bg-card/80 backdrop-blur">
        <h2 className="text-3xl font-bold mb-6 text-center">Gæsteliste</h2>
        
        <p className="text-center text-muted-foreground mb-6">
          Du har {chairCount} stole. Tilføj op til {chairCount} gæster.
        </p>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter guest name..."
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGuest()}
            className="flex-1"
          />
          <Button onClick={addGuest} className="gap-2">
            <Plus size={20} /> Tilføj
          </Button>
        </div>

        <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
          {guests.map((guest, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <span className="font-medium">{guest.name}</span>
              <Button
                onClick={() => removeGuest(index)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          {guests.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Ingen gæster tilføjet endnu. Start med at tilføje navne ovenfor!
            </p>
          )}
        </div>

        <Button 
          onClick={handleComplete}
          disabled={guests.length === 0}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Start spillet med {guests.length} gæst{guests.length !== 1 ? 'er' : ''}
        </Button>
      </Card>
    </div>
  );
};
