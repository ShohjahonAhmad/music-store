import { Play, Pause, Loader } from "lucide-react";
import { Slider } from "./ui/slider";
import { useRef, useState } from "react";
import type { Song } from "~/types/Song";
import AlbumCover from "./AlbumCover";

export default function SongDetails({
  song,
  seed,
  audioCache,
  locale,
}: {
  song: Song;
  seed: bigint;
  audioCache: Record<string, string>;
  locale: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function togglePlay() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }
  return (
    <div className="p-6 bg-surface border-t border-border px-8 py-5 flex gap-8">
      <AlbumCover
        seed={`${seed}-${song.index}`}
        title={song.title}
        artist={song.artist}
      />
      <div className="flex flex-col gap-4 flex-1 pr-32">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            {song.genre}
          </p>
          <h3 className="font-heading font-bold text-2xl text-foreground">
            {song.title}
          </h3>
          <p className="text-base text-muted-foreground mt-0.5">
            {song.artist}
            <span className="text-border mx-2">·</span>
            {song.album}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <audio
            ref={audioRef}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            src={audioCache[`${locale}-${seed}-${song.index}`]}
          />
          <button
            disabled={isLoading}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : isPlaying ? (
              <Pause className="ml-0.5" />
            ) : (
              <Play className="ml-0.5" />
            )}
          </button>

          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration === -1 ? 0 : duration}
              step={1}
              onValueChange={(value) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = value[0];
                }
                setCurrentTime(value[0]);
              }}
            />
            <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
              <span>{convertSecondToMinute(currentTime)}</span>
              <span>{convertSecondToMinute(duration)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {song.reviews.map((review, index) => (
            <div
              className="w-fit max-w-xl bg-card border border-border rounded-lg p-3"
              key={index}
            >
              <span className="mb-1.5 text-foreground font-medium">
                {review.author}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function convertSecondToMinute(second: number) {
  if (second === -1) return "0:00";
  const minutes = Math.floor(second / 60);
  const seconds = Math.floor(second % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
