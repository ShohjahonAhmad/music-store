import Globe from "~/utils/Globe";
import Random from "~/utils/Random";
import { Slider } from "./ui/slider";
import Export from "~/utils/Export";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import getExport from "~/api/getExport";
import { Loader } from "lucide-react";

const SEED_RANGE = 2n ** 64n - 1n;

export default function Toolbar({
  seed,
  setSeed,
  likes,
  setLikes,
  locale,
  setLocale,
  tableView,
  page,
}: {
  seed: bigint;
  setSeed: (newSeed: bigint) => void;
  likes: number;
  setLikes: (newLikes: number) => void;
  locale: string;
  setLocale: (newLocale: string) => void;
  tableView: boolean;
  page: number;
}) {
  const { t, i18n } = useTranslation();
  const [localLikes, setLocalLikes] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full bg-card border-b border-border px-8 py-3 flex justify-between items-center gap-6 lg:flex-row flex-col">
      <div className="flex gap-4 items-center lg:flex-row flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {t("toolbar.language")}
          </span>
          <div className="flex items-center gap-2">
            <Globe />
            <select
              value={i18n.language}
              onChange={(e) => {
                setLocale(e.target.value);
                i18n.changeLanguage(e.target.value);
              }}
              className="flex items-center gap-1 bg-surface border border-border rounded-md px-3 py-1.5 text-sm text-foreground min-w-40"
            >
              <option value="en">English (USA)</option>
              <option value="es">Español (España)</option>
            </select>
          </div>
        </div>
        <div className="w-px h-6 bg-muted"></div>
        <div className="flex items-center text-muted-foreground text-xs">
          <span className="uppercase tracking-widest mr-2">
            {t("toolbar.seed")}
          </span>
          <input
            min={0}
            type="number"
            value={seed.toString()}
            onChange={(e) => setSeed(BigInt(e.target.value))}
            className="bg-surface border border-border rounded-l-md px-3 py-1.5 text-xs font-mono min-w-36 text-muted-foreground focus:outline-none focus:ring-0 focus:border-border"
          />
          <button
            className="px-3 py-1.5 border border-border rounded-r-md flex items-center gap-1.5 bg-muted cursor-pointer"
            onClick={() => setSeed(randomSeed())}
          >
            <Random />
            {t("toolbar.random")}
          </button>
        </div>
        <div className="w-px h-6 bg-muted"></div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs text- uppercase tracking-widest">
            {t("toolbar.likes")}
          </span>
          <div className="flex items-center gap-3 bg-surface border border-border rounded-md px-3 py-1.5">
            <span className="text-xs">0</span>
            <Slider
              value={[localLikes]}
              onValueChange={(value) => setLocalLikes(value[0])}
              onValueCommit={(value) => setLikes(value[0])}
              min={0}
              max={10}
              step={0.1}
              className="w-32 h-1.5 bg-muted rounded-full"
            />
            <span className="text-xs">10</span>
            <span className="text-sm font-medium text-foreground ml-1 border-l border-border pl-3">
              {localLikes}
            </span>
          </div>
        </div>
      </div>
      {tableView && (
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              setIsLoading(true);
              try {
                const blob = await getExport(seed, locale, page);

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "songs.zip";
                a.click();

                URL.revokeObjectURL(url);
              } finally {
                setIsLoading(false);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-[#7a7a8c] hover:text-[#1c1c24] border border-border rounded-md text-sm text-muted-foreground cursor-pointer"
          >
            <Export />
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              t("toolbar.exportZip")
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function randomSeed(): bigint {
  const high = BigInt(Math.floor(Math.random() * 2 ** 32));
  const low = BigInt(Math.floor(Math.random() * 2 ** 32));

  return (high << 32n) | low;
}
