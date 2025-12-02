import { useState } from "react";
import { TableSetup } from "@/components/TableSetup";
import { GuestInput } from "@/components/GuestInput";
import { SeatAssignment } from "@/components/SeatAssignment";
import { Button } from "@/components/ui/button";
import { Snowflakes } from "@/components/Snowflakes";

export interface Chair {
  id: string;
  x: number;
  y: number;
  assigned?: string;
}

export interface Guest {
  name: string;
  seated: boolean;
  challenge?: string;
}

const Index = () => {
  const [step, setStep] = useState<"setup" | "guests" | "game">("setup");
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  const handleSetupComplete = (setupChairs: Chair[]) => {
    setChairs(setupChairs);
    setStep("guests");
  };

  const handleGuestsComplete = (guestList: Guest[]) => {
    setGuests(guestList);
    setStep("game");
  };

  const handleBackToSetup = () => {
    setStep("setup");
    setChairs([]);
  };

  const handleBackToGuests = () => {
    setStep("guests");
    setGuests([]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Snowflakes />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 festive-gradient bg-clip-text text-transparent">
            🎅 HT Julefrokost pladsfordeling 🎄
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Lad julemanden bestemmer hvor vi skal sidde i dag!
          </p>
        </header>

        {step === "setup" && (
          <TableSetup onComplete={handleSetupComplete} />
        )}

        {step === "guests" && (
          <div>
            <GuestInput 
              chairCount={chairs.length}
              onComplete={handleGuestsComplete}
            />
            <div className="text-center mt-4">
              <Button onClick={handleBackToSetup} variant="outline">
                ← Tilbage til bordopsætning
              </Button>
            </div>
          </div>
        )}

        {step === "game" && (
          <div>
            <SeatAssignment 
              chairs={chairs}
              guests={guests}
              onComplete={() => {}}
            />
            <div className="text-center mt-4">
              <Button onClick={handleBackToGuests} variant="outline">
                ← Tilbage til gæsteliste
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
