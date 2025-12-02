import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SeatSwitch {
  guest: string;
  oldSeat: string;
  newSeat: string;
}

interface GrinchSwitchAlertProps {
  switches: SeatSwitch[];
  onClose: () => void;
}

export const GrinchSwitchAlert = ({ switches, onClose }: GrinchSwitchAlertProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="max-w-3xl w-full mx-4 p-8 bg-gradient-to-br from-red-900/90 to-green-900/90 border-4 border-red-600 shadow-2xl animate-scale-in">
        <div className="text-center mb-6">
          <div className="text-8xl mb-4">🎅👹</div>
          <h2 className="text-4xl font-bold text-white mb-2">
            The Grinch Reshuffled Everything!
          </h2>
          <p className="text-xl text-white/90">Here's who switched seats:</p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
          {switches.map((swap, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur rounded-lg p-4 border-2 border-white/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between gap-4 text-white">
                <div className="flex-1 text-center">
                  <div className="font-bold text-lg">{swap.guest}</div>
                  <div className="text-sm opacity-80">Seat {swap.oldSeat}</div>
                </div>
                <div className="text-3xl">↔️</div>
                <div className="flex-1 text-center">
                  <div className="font-bold text-lg">{swap.guest}</div>
                  <div className="text-sm opacity-80">Seat {swap.newSeat}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={onClose}
            className="bg-white text-red-900 hover:bg-white/90 font-bold text-lg px-8 py-6"
          >
            Continue the Game! 🎄
          </Button>
        </div>
      </Card>
    </div>
  );
};
