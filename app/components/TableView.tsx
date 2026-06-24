import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import Back from "~/utils/Back";
import Like from "~/utils/Like";
import Next from "~/utils/Next";
import { useState, Fragment, useEffect } from "react";
import SongDetails from "./SongDetails";
import type { Song } from "~/types/Song";
import AlbumCover from "./AlbumCover";

export default function TableView({
  page,
  setPage,
  seed,
  locale,
}: {
  page: number;
  setPage: (newPage: number) => void;
  seed: bigint;
  locale: string;
}) {
  const songs = useLoaderData<Song[]>();
  const { t } = useTranslation();
  const [expandedSong, setExpandedSong] = useState<number>(-1);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});

  useEffect(() => {
    setExpandedSong(-1);
    setAudioCache({});
  }, [locale, page, seed]);

  useEffect(() => {
    if (expandedSong === -1) {
      return;
    }
    const key = `${locale}-${seed}-${expandedSong}`;

    if (audioCache[key]) return;
    async function loadAudio(songIndex: number) {
      const response = await fetch(
        `https://music-store-backend-rho.vercel.app/songs/audio?seed=${seed}&index=${songIndex}&locale=${locale}`
      );

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      setAudioCache((prev) => ({
        ...prev,
        [key]: url,
      }));
    }

    loadAudio(expandedSong);
  }, [expandedSong, seed, locale]);

  const toggleSong = (index: number) => {
    if (expandedSong === index) {
      setExpandedSong(-1);
    } else {
      setExpandedSong(index);
    }
  };
  return (
    <main>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-xs text-muted-foreground">
          <thead className="border-b border-border bg-background px-8 uppercase">
            <tr>
              <th className="pl-8 py-2 px-2 w-[5%]">#</th>
              <th className=" tracking-widest py-2 px-2 text-left w-[50%]">
                {t("table.titleArtist")}
              </th>
              <th className=" tracking-widest py-2 px-2 text-left w-[15%]">
                {t("table.album")}
              </th>
              <th className=" tracking-widest py-2 px-2 text-left w-[15%]">
                {t("table.genre")}
              </th>
              <th className=" tracking-widest py-2 px-2 pr-8 text-left w-[10%]">
                {t("table.likes")}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-surface px-8">
            {songs.map((song: Song) => (
              <Fragment key={song.index}>
                <tr className="border-b border-border">
                  <td className="pl-8 py-3 w-8 px-2">{song.index}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-4">
                      <AlbumCover
                        artist={song.artist}
                        seed={`${seed}-${song.index}`}
                        title={song.title}
                        size={40}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {song.title}
                        </p>
                        <p className="truncate">{song.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 truncate">{song.album}</td>
                  <td className="px-2 py-3 truncate">{song.genre}</td>
                  <td className="px-2 py-3 pr-8">
                    <div className="flex gap-1 items-center">
                      <Like />
                      {song.likes}
                    </div>
                  </td>
                  <td className="px-2 py-3 items-center">
                    <button
                      onClick={() => toggleSong(song.index)}
                      className="h-6 w-6 rounded flex items-center justify-center"
                    >
                      {expandedSong === song.index ? (
                        <ChevronUpIcon className="size-4 transition-all text-muted-foreground" />
                      ) : (
                        <ChevronDownIcon className="size-4 transition-all text-muted-foreground" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedSong === song.index && (
                  <tr>
                    <td colSpan={6}>
                      <SongDetails
                        locale={locale}
                        song={song}
                        seed={seed}
                        audioCache={audioCache}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end px-8 py-4 bg-card border-t border-border">
        <div className="flex items-center gap-1 text-muted-foreground">
          <button
            onClick={() => setPage(page - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-surface border border-border disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={page === 1}
          >
            <Back />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium border bg-primary text-black border-primary cursor-pointer">
            {page}
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium border bg-surface border-border cursor-pointer"
          >
            {page + 1}
          </button>
          <span className="w-8 h-8 flex items-center justify-center text-xs">
            …
          </span>
          <button
            onClick={() => setPage(page + 10)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium border bg-surface border-border cursor-pointer"
          >
            {page + 10}
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-surface border border-border cursor-pointer"
          >
            <Next />
          </button>
        </div>
      </div>
    </main>
  );
}
