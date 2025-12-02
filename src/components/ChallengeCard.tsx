import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChallengeCardProps {
  guestName: string;
  challenge: string;
  onComplete: () => void;
}

export const ChallengeCard = ({ guestName, challenge, onComplete }: ChallengeCardProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="max-w-md w-full p-8 text-center animate-scale-in">
        <div className="text-6xl mb-4">🎁</div>
        <h3 className="text-2xl font-bold mb-4">
          Udfordring til {guestName}!
        </h3>
        <p className="text-xl mb-6 p-4 bg-muted rounded-lg">
          {challenge}
        </p>
        <Button 
          onClick={onComplete}
          className="w-full bg-secondary hover:bg-secondary/90"
        >
          Udfordring færdig! ✅
        </Button>
      </Card>
    </div>
  );
};
