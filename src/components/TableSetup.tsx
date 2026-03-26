import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chair } from "@/pages/Index";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Theme, themeConfigs } from "@/lib/themeConfig";

interface TableSetupProps {
  onComplete: (chairs: Chair[]) => void;
  theme?: Theme;
}

export const TableSetup = ({ onComplete, theme = 'christmas' }: TableSetupProps) => {
  const tc = themeConfigs[theme];
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [draggedChair, setDraggedChair] = useState<string | null>(null);

  const addChair = () => {
    const newChair: Chair = {
      id: `chair-${Date.now()}`,
      x: 250 + Math.random() * 100,
      y: 150 + Math.random() * 100,
    };
    setChairs([...chairs, newChair]);
    toast.success("Stol tilføjet. Træk den rundt om bordet!");
  };

  const removeChair = (id: string) => {
    setChairs(chairs.filter(c => c.id !== id));
    toast.success("Stol fjernet");
  };

  const handleMouseDown = (id: string) => {
    setDraggedChair(id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedChair) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setChairs(chairs.map(chair => 
        chair.id === draggedChair 
          ? { ...chair, x: Math.max(0, Math.min(x - 30, rect.width - 60)), y: Math.max(0, Math.min(y - 30, rect.height - 60)) }
          : chair
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedChair(null);
  };

  const handleComplete = () => {
    if (chairs.length < 2) {
      toast.error("Tilføj mindst 2 stole for at fortsætte!");
      return;
    }
    onComplete(chairs);
    toast.success(`Bordopsætning fuldført med ${chairs.length} stole!`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6 bg-card/80 backdrop-blur">
        <h2 className="text-3xl font-bold mb-6 text-center">Jørgens bord</h2>
        
        <div className="flex gap-4 mb-6 justify-center">
          <Button onClick={addChair} className="gap-2">
            <Plus size={20} /> Tilføj stol
          </Button>
          <Button 
            onClick={handleComplete} 
            disabled={chairs.length < 2}
            variant="default"
            className="bg-secondary hover:bg-secondary/90"
          >
            Fortsæt med {chairs.length} stol{chairs.length !== 1 ? 'e' : ''}
          </Button>
        </div>

        <div 
          className="relative bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-2xl border-4 border-amber-700/50 overflow-hidden"
          style={{ height: '80vh', width: '100%' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Floating Theme Elements */}
          <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{animationDelay: '0s'}}>{tc.cornerDecorations[0]}</div>
          <div className="absolute top-10 right-10 text-4xl animate-bounce" style={{animationDelay: '1s'}}>{tc.cornerDecorations[1]}</div>
          <div className="absolute bottom-10 left-10 text-4xl animate-bounce" style={{animationDelay: '2s'}}>{tc.cornerDecorations[2]}</div>
          <div className="absolute bottom-10 right-10 text-4xl animate-bounce" style={{animationDelay: '0.5s'}}>{tc.cornerDecorations[3]}</div>
          
          {/* Table */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-amber-700 to-amber-900 border-8 border-amber-600 shadow-2xl rounded-lg" style={{ width: '90%', height: '80%' }}>
            <div className="absolute inset-4 border-4 border-amber-500/30 rounded-lg"></div>
            {/* Table center decoration */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl">{tc.tableDecoration}</div>
          </div>

          {/* Chairs */}
          {chairs.map((chair) => (
            <div
              key={chair.id}
              className="absolute cursor-move group"
              style={{ 
                left: `${chair.x}px`, 
                top: `${chair.y}px`,
                width: '60px',
                height: '60px'
              }}
              onMouseDown={() => handleMouseDown(chair.id)}
            >
              <div className="relative">
                <div className="text-6xl hover:scale-110 transition-transform">
                  🪑
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChair(chair.id);
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-4">
          Klik "Tilføj stol" og træk det hen til den ønskede position rundt om dit bord
        </p>
      </Card>
    </div>
  );
};
