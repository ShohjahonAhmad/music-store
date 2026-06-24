import { useLoaderData } from "react-router";
import GallerySongCard from "./GallerySongCard";
import type { Song } from "~/types/Song";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import getSongs from "~/api/getSongs";

export default function GalleryView({
  seed,
  locale,
  likes,
}: {
  seed: bigint;
  locale: string;
  likes: number;
}) {
  const songs = useLoaderData<Song[]>();
  const [fetchedSongs, setFetchedSongs] = useState<Song[]>(songs);
  const { t } = useTranslation();
  const [playingSong, setPlayingSong] = useState<number | null>(null);
  const [galleryPage, setGalleryPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGalleryPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPlayingSong(null);
    setGalleryPage(1);
    setFetchedSongs(songs);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [songs, seed, locale, likes]);

  useEffect(() => {
    if (galleryPage === 1) return;
    getSongs(galleryPage, seed, likes, locale).then((newSongs) => {
      setFetchedSongs((prev) => [...prev, ...newSongs]);
    });
  }, [galleryPage]);

  return (
    <main>
      <div className="px-8 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h2 className="font-headings font-bold text-2xl text-foreground">
            <span data-file="/screens/MusicStoreGallery.jsx" data-idx="0">
              {t("gallery.title")}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span data-file="/screens/MusicStoreGallery.jsx" data-idx="1">
              {t("gallery.subtitle")}
            </span>
          </p>
        </div>
      </div>
      <div className="px-8 pt-2 pb-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-border w-full"></div>
      </div>
      <div className="px-8 pb-4 flex justify-center gap-4 flex-wrap">
        {fetchedSongs.map((song) => (
          <GallerySongCard
            key={`${locale}-${seed}-${song.index}`}
            song={song}
            seed={seed}
            locale={locale}
            playingSong={playingSong}
            setPlayingSong={setPlayingSong}
          />
        ))}
      </div>
      <div ref={loadMoreRef} className="h-10" />
    </main>
  );
}
