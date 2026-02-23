import { useLeaderboard } from '../hooks/useLeaderboard';
import GameLogo from '../components/GameLogo';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardProps {
  onBackToSelect: () => void;
}

export default function Leaderboard({ onBackToSelect }: LeaderboardProps) {
  const { leaderboard, isLoading } = useLeaderboard('Rainbow Circuit');

  const formatTime = (time: bigint) => {
    const ms = Number(time);
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-boost-yellow" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <GameLogo />

      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        <h1 className="text-5xl font-bold text-racing-blue text-center mb-8">Leaderboard</h1>
        <h2 className="text-2xl font-semibold text-center mb-6 text-muted-foreground">Rainbow Circuit</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">Loading leaderboard...</div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-muted-foreground">No times recorded yet. Be the first!</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-center">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map(([username, time], index) => (
                <TableRow key={`${username}-${index}`} className={index < 3 ? 'bg-boost-yellow/10' : ''}>
                  <TableCell className="text-center">{getRankIcon(index)}</TableCell>
                  <TableCell className="font-semibold text-lg">{username}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-lg">{formatTime(time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-8">
          <Button
            onClick={onBackToSelect}
            className="w-full bg-boost-yellow hover:bg-boost-yellow/90 text-racing-blue font-bold text-xl py-6 rounded-full"
          >
            Back to Character Select
          </Button>
        </div>
      </div>

      <footer className="mt-8 text-white/80 text-sm text-center">
        © {new Date().getFullYear()} Built with ❤️ using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            window.location.hostname
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
