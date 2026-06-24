import { Loader, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AlbumCover from "./AlbumCover";
import Like from "~/utils/Like";
import type { Song } from "~/types/Song";

export default function GallerySongCard({
  playingSong,
  setPlayingSong,
  song,
  seed,
  locale,
}: {
  playingSong: number | null;
  setPlayingSong: React.Dispatch<React.SetStateAction<number | null>>;
  song: Song;
  seed: bigint;
  locale: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function togglePlay() {
    if (!audioRef.current) return;
    setPlayingSong(song.index);

    if (!audioUrl) {
      setIsLoading(true);

      const response = await fetch(
        `https://music-store-backend-rho.vercel.app/songs/audio?seed=${seed}&index=${song.index}&locale=${locale}`
      );

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
      setIsLoading(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }

  useEffect(() => {
    if (playingSong !== song.index) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioUrl && playingSong === song.index && audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [playingSong, audioUrl]);
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
      <div className="relative w-full">
        <AlbumCover
          size={300}
          artist={song.artist}
          seed={`${seed}-${song.index}`}
          title={song.title}
        />
        <div className="absolute top-3 left-3 w-6 h-6 rounded-md bg-black bg-opacity-40 flex items-center justify-center">
          <span className="text-xs font-medium text-white">{song.index}</span>
        </div>
        <audio
          ref={audioRef}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          src={audioUrl || undefined}
        />
        <button
          disabled={isLoading}
          onClick={togglePlay}
          className="absolute bottom-0 right-0 -translate-x-1 -translate-y-1 w-12 h-12 rounded-full bg-black bg-opacity-40 border border-white border-opacity-30 flex items-center justify-center backdrop-blur text-white disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : isPlaying ? (
            <Pause className="ml-0.5" />
          ) : (
            <Play className="ml-0.5" />
          )}
        </button>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="w-[200px]">
            <p className="text-xs text-muted-foreground truncate">
              {song.album}
            </p>
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-sm bg-surface text-muted-foreground border border-border">
              {song.genre}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0 mt-0.5">
            <Like />
            <span>{song.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
