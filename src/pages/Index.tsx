import { useState } from "react";
import { TableSetup } from "@/components/TableSetup";
import { GuestInput } from "@/components/GuestInput";
import { SeatAssignment } from "@/components/SeatAssignment";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Button } from "@/components/ui/button";
import { Snowflakes } from "@/components/Snowflakes";
import { Theme, themeConfigs } from "@/lib/themeConfig";

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
  const [step, setStep] = useState<"theme" | "setup" | "guests" | "game">("theme");
  const [theme, setTheme] = useState<Theme>("christmas");
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  const handleThemeSelect = (selected: Theme) => {
    setTheme(selected);
    setStep("setup");
  };

  const handleSetupComplete = (setupChairs: Chair[]) => {
    setChairs(setupChairs);
    setStep("guests");
  };

  const handleGuestsComplete = (guestList: Guest[]) => {
    setGuests(guestList);
    setStep("game");
  };

  const handleBackToTheme = () => {
    setStep("theme");
    setChairs([]);
    setGuests([]);
  };

  const handleBackToSetup = () => {
    setStep("setup");
    setChairs([]);
  };

  const handleBackToGuests = () => {
    setStep("guests");
    setGuests([]);
  };

  if (step === "theme") {
    return <ThemeSelector onSelect={handleThemeSelect} />;
  }

  const tc = themeConfigs[theme];

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${tc.bodyBg}`}>
      <Snowflakes theme={theme} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 festive-gradient bg-clip-text text-transparent">
            {tc.titleEmojis[0]} {tc.title} {tc.titleEmojis[1]}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {tc.subtitle}
          </p>
          <button
            onClick={handleBackToTheme}
            className="mt-3 text-white/50 hover:text-white/80 text-sm underline transition-colors"
          >
            ← Skift tema
          </button>
        </header>

        {step === "setup" && (
          <TableSetup onComplete={handleSetupComplete} theme={theme} />
        )}

        {step === "guests" && (
          <div>
            <GuestInput 
              chairCount={chairs.length}
              onComplete={handleGuestsComplete}
              theme={theme}
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
              theme={theme}
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
