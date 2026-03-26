import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chair, Guest } from "@/pages/Index";
import { toast } from "sonner";
import { Theme, themeConfigs } from "@/lib/themeConfig";

interface SeatAssignmentProps {
  chairs: Chair[];
  guests: Guest[];
  onComplete: () => void;
  theme: Theme;
}

export const SeatAssignment = ({ chairs: initialChairs, guests: initialGuests, theme }: SeatAssignmentProps) => {
  const tc = themeConfigs[theme];
  const [chairs, setChairs] = useState(initialChairs);
  const [guests, setGuests] = useState(initialGuests);


  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [assignedCount, setAssignedCount] = useState(0);
  const [grinchTriggered, setGrinchTriggered] = useState(false);
  const [seatSwitches, setSeatSwitches] = useState<Array<{guest: string, oldSeat: string, newSeat: string}>>([]);
  const [showSwitchAlert, setShowSwitchAlert] = useState(false);
  const [santaPosition, setSantaPosition] = useState({ x: 0, y: 0 });
  const [visitingChairIndex, setVisitingChairIndex] = useState(0);
  const drumrollAudioRef = useRef<HTMLAudioElement | null>(null);
  const hohohoAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showSantaShuffle, setShowSantaShuffle] = useState(false);
  const [hasTriggeredShuffle, setHasTriggeredShuffle] = useState(false);
  const [shuffleChanges, setShuffleChanges] = useState<Array<{person1: string, person2: string}>>([]);
  const [showShuffleResults, setShowShuffleResults] = useState(false);
  
  // Challenge State
  const [currentChallenge, setCurrentChallenge] = useState<string>("");
  const [showChallenge, setShowChallenge] = useState(false);
  const [assignedGuestName, setAssignedGuestName] = useState<string>("");
  
  // New Game Flow State
  const [gamePhase, setGamePhase] = useState<'selecting'>('selecting');
  const [snapsTaken, setSnapsTaken] = useState(0);
  const [snapsGiven, setSnapsGiven] = useState(0);

  // Challenges (from theme config)
  const challenges = tc.challenges;

  const unseatedGuests = guests.filter(g => !g.seated);
  const allSeated = unseatedGuests.length === 0;

  const assignSeat = () => {
    if (allSeated || isAnimating) return;

    // Just assign seat directly without guessing
    setGamePhase('selecting');
    startSeatAnimation();
  };

  const startSeatAnimation = () => {
    setIsAnimating(true);
    
    // Choose random sound for the animation
    const animationSounds = tc.animationSounds;
    const randomSound = animationSounds[Math.floor(Math.random() * animationSounds.length)];
    
    // Start random Christmas sound
    if (drumrollAudioRef.current) {
      drumrollAudioRef.current.src = `/${randomSound}`;
      drumrollAudioRef.current.play().catch(console.error);
    }
    
    // Get available chairs and shuffle them
    const availableChairs = chairs.filter(c => !c.assigned);
    const shuffledChairs = [...availableChairs].sort(() => Math.random() - 0.5);
    
    // Start Santa animation visiting chairs
    let chairIndex = 0;
    setVisitingChairIndex(0);
    
    const animationInterval = setInterval(() => {
      if (chairIndex < shuffledChairs.length) {
        const currentChair = shuffledChairs[chairIndex];
        setSantaPosition({ x: currentChair.x + 50, y: currentChair.y - 50 });
        setVisitingChairIndex(chairIndex);
        chairIndex++;
      } else {
        // Reset to first chair and continue cycling
        chairIndex = 0;
      }
    }, 800); // Visit each chair every 800ms
    
    // After animation (12 seconds), assign the seat
    setTimeout(() => {
      clearInterval(animationInterval);
      
      // Stop drumroll
      if (drumrollAudioRef.current) {
        drumrollAudioRef.current.pause();
        drumrollAudioRef.current.currentTime = 0;
      }
      
      // Choose a random guest from unseated guests
      const currentGuest = unseatedGuests[Math.floor(Math.random() * unseatedGuests.length)];
      const randomChair = availableChairs[Math.floor(Math.random() * availableChairs.length)];
      
      // Move Santa to final chosen chair
      setSantaPosition({ x: randomChair.x + 50, y: randomChair.y - 50 });
      
      // Play celebration sound
      const celebrationSounds = tc.celebrationSounds;
      if (celebrationSounds.length > 0) {
        const randomCelebration = celebrationSounds[Math.floor(Math.random() * celebrationSounds.length)];
        if (hohohoAudioRef.current) {
          hohohoAudioRef.current.src = `/${randomCelebration}`;
          hohohoAudioRef.current.play().catch(console.error);
        }
      }
      
      // Check if chair guess was correct and handle snaps
      // (No longer used since we removed chair guessing)
      
      // Update chairs
      setChairs(chairs.map(c => 
        c.id === randomChair.id 
          ? { ...c, assigned: currentGuest.name }
          : c
      ));

      // Update guest
      setGuests(guests.map(g => 
        g.name === currentGuest.name 
          ? { ...g, seated: true }
          : g
      ));

      setTimeout(() => {
        setIsAnimating(false);
        setAssignedCount(prev => {
          const newCount = prev + 1;
          
          // Check if we've reached halfway point and haven't triggered shuffle yet
          const halfwayPoint = Math.ceil(guests.length / 2);
          if (newCount === halfwayPoint && !hasTriggeredShuffle) {
            setTimeout(() => {
              triggerSantaShuffle();
            }, 2000);
          }
          
          return newCount;
        });

        toast.success(`${currentGuest.name} fik en plads! 🎉`);

        // Show challenge for the assigned guest
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        setCurrentChallenge(randomChallenge);
        setAssignedGuestName(currentGuest.name);
        setShowChallenge(true);
        
      }, 1000); // Short delay to show final position
    }, 12000);
  };

  const triggerSantaShuffle = () => {
    setHasTriggeredShuffle(true);
    setShowSantaShuffle(true);

    toast.error(tc.shuffleToast, {
      duration: 5000,
    });
  };

  const handleShuffleSeats = () => {
    setShowSantaShuffle(false);
    
    // Get all seated guests and their chairs
    const seatedGuests = guests.filter(g => g.seated);
    const assignedChairs = chairs.filter(c => c.assigned);
    
    if (seatedGuests.length >= 2) {
      // Create mapping of current assignments (guest -> chair)
      const currentAssignments = new Map<string, string>();
      assignedChairs.forEach(chair => {
        if (chair.assigned) {
          currentAssignments.set(chair.assigned, chair.id);
        }
      });
      
      // Create array of guest names and shuffle them until EVERYONE moves to a different seat
      let shuffledNames: string[];
      let attempts = 0;
      const guestNames = seatedGuests.map(g => g.name);
      
      // Keep shuffling until no one sits in their original position
      do {
        shuffledNames = [...guestNames].sort(() => Math.random() - 0.5);
        attempts++;
        
        // If we've tried many times, force a guaranteed rotation
        if (attempts > 100) {
          shuffledNames = [...guestNames];
          // Rotate everyone by one position to guarantee all move
          const firstGuest = shuffledNames.shift();
          if (firstGuest) shuffledNames.push(firstGuest);
          break;
        }
      } while (
        // Continue shuffling until EVERYONE has moved (no one in same position)
        guestNames.some((guest, index) => guest === shuffledNames[index])
      );
      
      // Track all changes - who ended up in whose seat
      const changes: Array<{person1: string, person2: string}> = [];
      
      // Map each person to where they ended up
      const oldPositions = new Map<string, string>(); // person -> old chair name
      assignedChairs.forEach((chair, index) => {
        if (chair.assigned) {
          oldPositions.set(chair.assigned, chair.assigned); // Store the person who was in this chair
        }
      });
      
      // Now track who took whose seat
      assignedChairs.forEach((chair, index) => {
        const newPerson = shuffledNames[index]; // Who is sitting here now
        const oldPerson = chair.assigned; // Who was sitting here before
        
        if (oldPerson && newPerson && oldPerson !== newPerson) {
          changes.push({
            person1: newPerson, // This person
            person2: oldPerson  // took this person's seat
          });
        }
      });
      
      console.log('Shuffle changes:', changes);
      console.log('Assigned chairs:', assignedChairs);
      console.log('Shuffled names:', shuffledNames);
      console.log('Guest names:', guestNames);
      
      // Reassign chairs with shuffled names
      let nameIndex = 0;
      const newChairs = chairs.map(chair => {
        if (chair.assigned && nameIndex < shuffledNames.length) {
          const newGuest = shuffledNames[nameIndex];
          nameIndex++;
          return { ...chair, assigned: newGuest };
        }
        return chair;
      });
      
      setChairs(newChairs);
      setShuffleChanges(changes);
      setShowShuffleResults(true);

      toast.success(`🔄 ${changes.length} plads-skift! Tjek hvem der byttede!`, {
        duration: 4000,
      });
    }
  };

  const triggerGrinchEvent = () => {
    setGrinchTriggered(true);
    toast.error(`${tc.characterEmoji} Hov, nu kommer ${tc.characterName}! Alle pladser bliver blandet!`, {
      duration: 5000,
    });

    setTimeout(() => {
      // Get all seated guests
      const seatedGuests = guests.filter(g => g.seated);
      
      // Get all assigned chairs
      const assignedChairs = chairs.filter(c => c.assigned);
      
      // Create a map of old assignments
      const oldAssignments = new Map<string, string>();
      assignedChairs.forEach(chair => {
        if (chair.assigned) {
          oldAssignments.set(chair.assigned, chair.id);
        }
      });
      
      // Shuffle the assignments
      const shuffledNames = [...seatedGuests.map(g => g.name)].sort(() => Math.random() - 0.5);
      
      // Reassign chairs and track switches
      const switches: Array<{guest: string, oldSeat: string, newSeat: string}> = [];
      const newChairs = chairs.map(chair => {
        if (chair.assigned) {
          const index = assignedChairs.findIndex(c => c.id === chair.id);
          const newGuest = shuffledNames[index];
          const oldSeatId = oldAssignments.get(newGuest) || "";
          
          if (oldSeatId !== chair.id) {
            switches.push({
              guest: newGuest,
              oldSeat: oldSeatId,
              newSeat: chair.id
            });
          }
          
          return { ...chair, assigned: newGuest };
        }
        return chair;
      });
      
      setChairs(newChairs);
      setSeatSwitches(switches);
      setShowSwitchAlert(true);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Theme Decorative Elements */}
      <div className="absolute top-0 left-0 text-6xl animate-bounce" style={{animationDelay: '0s'}}>{tc.cornerDecorations[0]}</div>
      <div className="absolute top-0 right-0 text-5xl animate-bounce" style={{animationDelay: '1s'}}>{tc.cornerDecorations[3]}</div>
      <div className="absolute top-20 left-10 text-4xl animate-pulse" style={{animationDelay: '0.5s'}}>{tc.cornerDecorations[1]}</div>
      <div className="absolute top-20 right-10 text-4xl animate-pulse" style={{animationDelay: '1.5s'}}>{tc.cornerDecorations[2]}</div>
      <div className="absolute top-40 left-20 text-3xl sparkle" style={{animationDelay: '2s'}}>{tc.unassignedChairIcon}</div>
      <div className="absolute top-40 right-20 text-3xl sparkle" style={{animationDelay: '0.8s'}}>{tc.unassignedChairIcon}</div>
      
      {/* Animation Audio */}
      <audio 
        ref={drumrollAudioRef}
        preload="auto"
      />
      
      {/* HOHOHO Audio */}
      <audio 
        ref={hohohoAudioRef}
        preload="auto"
      />
      
      {/* Challenge Modal */}
      {showChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className={`bg-gradient-to-br ${tc.cardGradient} p-8 rounded-3xl border-8 border-yellow-400 shadow-2xl text-center max-w-3xl mx-4`}>
            <div className="mb-6">
              <h2 className="text-5xl font-bold text-white mb-4 animate-bounce">
                {tc.challengeTitle}
              </h2>
              <p className="text-2xl text-yellow-300 font-bold mb-6">
                {assignedGuestName}, du skal:
              </p>
              <div className="bg-white/20 p-6 rounded-2xl border-4 border-yellow-400 mb-6">
                <p className="text-4xl font-bold text-white">
                  {currentChallenge}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 text-5xl mb-6 animate-bounce">
              {tc.celebrationEmojis.slice(0, 4).map((emoji, i) => (
                <span key={i} style={{animationDelay: `${i * 0.2}s`}}>{emoji}</span>
              ))}
            </div>
            
            <button
              onClick={() => setShowChallenge(false)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200 border-4 border-white"
            >
              {tc.challengeComplete}
            </button>
          </div>
        </div>
      )}
      
      {/* Santa Shuffle Alert */}
      {showSantaShuffle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className={`bg-gradient-to-br ${tc.shuffleCardGradient} p-8 rounded-3xl border-8 border-yellow-400 shadow-2xl text-center max-w-4xl mx-4 animate-pulse`}>
            <div className="mb-6">
              {tc.characterGif ? (
                <img 
                  src={tc.characterGif} 
                  alt={`${tc.characterName} shuffling seats`} 
                  className="w-80 h-80 mx-auto rounded-full border-8 border-white shadow-2xl object-contain"
                />
              ) : tc.characterImage ? (
                <img 
                  src={tc.characterImage} 
                  alt={`${tc.characterName} shuffling seats`} 
                  className="w-64 h-64 mx-auto object-contain drop-shadow-2xl animate-bounce"
                />
              ) : (
                <div className="text-[10rem] leading-none mx-auto">{tc.characterEmoji}</div>
              )}
            </div>
            
            <h2 className="text-6xl font-bold text-white mb-4 animate-bounce">
              {tc.shuffleTitle}
            </h2>
            
            <p className="text-3xl font-bold text-yellow-300 mb-4">
              {tc.shuffleText}
            </p>
            
            <p className="text-2xl text-white font-semibold">
              {tc.shuffleSubText}
            </p>
            
            <div className="mt-6 flex justify-center space-x-4 text-5xl animate-bounce">
              {tc.shuffleEmojis.map((emoji, i) => (
                <span key={i} style={{animationDelay: `${i * 0.2}s`}}>{emoji}</span>
              ))}
            </div>
            
            <div className="mt-8">
              <button
                onClick={handleShuffleSeats}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-full text-2xl shadow-lg transform hover:scale-110 transition-all duration-200 border-4 border-white animate-pulse"
              >
                {tc.shuffleButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shuffle Results */}
      {showShuffleResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className={`bg-gradient-to-br ${tc.shuffleCardGradient.replace('/90', '/90')} bg-opacity-90 p-8 rounded-3xl border-4 border-yellow-400 shadow-2xl max-w-4xl mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-white mb-4">
                {tc.shuffleResultsTitle}
              </h2>
              <p className="text-xl text-yellow-300 mb-6">
                Her er, hvem der skiftede pladser:
              </p>
            </div>

            {shuffleChanges.length > 0 ? (
              <div className="space-y-3 mb-6">
                {shuffleChanges.map((change, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 p-4 rounded-xl border-2 border-yellow-400/50"
                  >
                    <div className="text-lg text-white text-center">
                      <span className="font-bold text-yellow-300 text-xl">{change.person1}</span>
                      <span className="mx-2">tog</span>
                      <span className="font-bold text-yellow-300 text-xl">{change.person2}</span>
                      <span className="mx-2">'s plads</span>
                      <span className="text-2xl ml-2">🔄</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-xl text-white mb-6">
                🎭 Hvad en tilfældighed! Alle endte op i de samme pladser!
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setShowShuffleResults(false)}
                className={`bg-gradient-to-r ${tc.buttonGradient} text-white font-bold px-8 py-4 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-4 ${tc.buttonBorder}`}
              >
                {tc.continuePartyButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSwitchAlert && (
        <Card className="p-6 bg-card/80 backdrop-blur mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Seating Progress: {guests.filter(g => g.seated).length} / {guests.length}
            </h2>
            {!allSeated && !isAnimating && (
              <Button 
                onClick={assignSeat}
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                🎅 Vælg Næste Stol
              </Button>
            )}
          </div>

          {allSeated && (
            <div className="text-center py-8">
              <h3 className="text-4xl font-bold mb-4 festive-gradient bg-clip-text text-transparent">
                🎉 Alle gæster er placeret! 🎄
              </h3>
              <p className="text-xl">Glædelig jul og nyd festen!</p>
            </div>
          )}
        </Card>
      )}

      <Card className={`p-3 bg-gradient-to-br ${tc.headerGradient} border-2 ${tc.cardBorder} shadow-xl mb-3 relative overflow-hidden`}>
        {/* Theme border decoration */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tc.garlandGradient}`}></div>
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${tc.garlandGradient}`}></div>
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-2xl font-bold ${tc.headerTextColor} flex items-center gap-2`}>
              {tc.characterEmoji} {tc.assignedText}: {guests.filter(g => g.seated).length} / {guests.length} {tc.tableDecoration}
            </h2>
          </div>
          {!allSeated && !isAnimating && (
            <Button 
              onClick={assignSeat}
              className={`bg-gradient-to-r ${tc.buttonGradient} text-white font-bold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 gap-2 border-2 ${tc.buttonBorder}`}
            >
              {tc.characterEmoji}✨ {assignedCount === 0 ? tc.startButton : tc.continueGameButton} {tc.tableDecoration}
            </Button>
          )}
        </div>

        {allSeated && (
          <div className="text-center py-12 bg-gradient-to-r from-red-600/20 to-green-600/20 rounded-2xl border-4 border-yellow-500/50 shadow-2xl relative overflow-hidden">
            {/* Celebration confetti */}
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute text-3xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  {['🎉', '🎊', '⭐', '🎁', '🔔', '❄️'][i % 6]}
                </div>
              ))}
            </div>
            
            <h3 className={`text-6xl font-bold mb-6 ${tc.headerTextColor} relative z-10`}>
              {tc.allSeatedTitle}
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-300 relative z-10">
              {tc.allSeatedSubtitle}
            </p>
            <div className="text-4xl mt-4 animate-pulse relative z-10">{tc.allSeatedIcons}</div>
          </div>
        )}
      </Card>

      {/* Table View */}
      <Card className="p-6 bg-card/80 backdrop-blur">        
        <div 
          className="relative bg-gradient-to-br from-amber-900/30 to-amber-800/30 rounded-2xl border-4 border-amber-700/50 overflow-hidden"
          style={{ height: '80vh', width: '100%' }}
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
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl animate-pulse">{tc.tableDecoration}</div>
          </div>

          {/* Chairs */}
          {chairs.map((chair, index) => (
            <div
              key={chair.id}
              className="absolute group"
              style={{ 
                left: `${chair.x}px`, 
                top: `${chair.y}px`,
                width: '100px',
              }}
            >
              <div className="text-center relative">
                {/* Chair decoration */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>{tc.chairDecoration}</div>
                <div className="text-7xl mb-1 filter drop-shadow-lg">🪑</div>
                {chair.assigned && (
                  <div className="bg-gradient-to-r from-red-600 to-green-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-yellow-400 relative">
                    <div className="absolute -top-1 -right-1 text-lg">{tc.assignedChairStar}</div>
                    {chair.assigned}
                  </div>
                )}
                {!chair.assigned && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xl animate-pulse">{tc.unassignedChairIcon}</div>
                )}
              </div>
            </div>
          ))}
          
          {/* Animated Santa */}
          {isAnimating && (
            <div
              className="absolute z-50 transition-all duration-700 ease-in-out"
              style={{
                left: `${santaPosition.x}px`,
                top: `${santaPosition.y}px`,
                transform: 'scale(1.2)'
              }}
            >
              {/* Santa with magical effects */}
              <div className="relative">
                {/* Magical sparkles around Santa */}
                <div className="absolute -top-2 -left-2 text-2xl animate-ping">✨</div>
                <div className="absolute -top-2 -right-2 text-2xl animate-ping" style={{animationDelay: '0.2s'}}>⭐</div>
                <div className="absolute -bottom-2 -left-2 text-2xl animate-ping" style={{animationDelay: '0.4s'}}>❄️</div>
                <div className="absolute -bottom-2 -right-2 text-2xl animate-ping" style={{animationDelay: '0.6s'}}>🎁</div>
                
                {tc.characterImage ? (
                  <img 
                    src={tc.characterImage} 
                    alt={`${tc.characterName} choosing seat`} 
                    className="w-24 h-24 animate-bounce drop-shadow-2xl filter brightness-110 contrast-110"
                  />
                ) : (
                  <div className="text-8xl animate-bounce drop-shadow-2xl">{tc.characterEmoji}</div>
                )}
                
                {/* Magic trail */}
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-radial from-yellow-400/30 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse -z-10"></div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Guest List */}
      <Card className={`p-3 bg-gradient-to-br ${tc.headerGradient} border-2 ${tc.cardBorder} shadow-xl mt-3 relative overflow-hidden`}>
        {/* Theme garland decoration */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tc.garlandGradient}`}></div>
        
        <h3 className={`text-xl font-bold mb-3 ${tc.headerTextColor} flex items-center justify-center gap-2`}>
          {tc.guestListTitle}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {guests.map((guest, i) => (
            <div 
              key={i}
              className={`p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 relative ${
                guest.seated 
                  ? `bg-gradient-to-br ${tc.seatedGuestGradient} text-white border-yellow-400 shadow-lg` 
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 border-gray-400 dark:from-gray-700 dark:to-gray-600 dark:text-gray-200'
              }`}
            >
              {guest.seated && <div className="absolute -top-2 -right-2 text-xl animate-bounce">🎁</div>}
              {!guest.seated && <div className="absolute -top-2 -right-2 text-lg animate-pulse">⏳</div>}
              
              <div className="font-bold text-base">{guest.name}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
