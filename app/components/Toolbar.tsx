import Globe from "~/utils/Globe";
import Random from "~/utils/Random";
import { Slider } from "./ui/slider";
import Export from "~/utils/Export";

const seedRange = 2n ** 64n - 1n;

export default function Toolbar({
  seed,
  setSeed,
  likes,
  setLikes,
}: {
  seed: bigint;
  setSeed: React.Dispatch<React.SetStateAction<bigint>>;
  likes: number;
  setLikes: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="w-full bg-[#17171f] border-b border-[#2a2a35] px-8 py-3 flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#7a7a8c] uppercase tracking-widest">
          Language
        </span>
        <div className="flex items-center gap-2">
          <Globe />
          <select className="flex items-center gap-1 bg-[#1c1c24] border border-[#2a2a35] rounded-md px-3 py-1.5 text-sm text-[#f0f0f2] min-w-40">
            <option value="en">English (USA)</option>
            <option value="es">Español (España)</option>
          </select>
        </div>
      </div>
      <div className="w-px h-6 bg-[#2a2a35]"></div>
      <div className="flex items-center text-[#7a7a8c] text-xs">
        <span className="uppercase tracking-widest mr-2">Seed</span>
        <input
          min={0}
          type="number"
          value={seed.toString()}
          onChange={(e) => setSeed(BigInt(e.target.value))}
          className="bg-[#1c1c24] border border-[#2a2a35] rounded-l-md px-3 py-1.5 text-xs font-mono min-w-36 text-[#7a7a8c] focus:outline-none focus:ring-0 focus:border-[#2a2a35]"
        />
        <button
          className="px-3 py-1.5 border border-[#2a2a35] rounded-r-md flex items-center gap-1.5 bg-[#2a2a35] cursor-pointer"
          onClick={() => setSeed(randomSeed())}
        >
          <Random />
          Random
        </button>
      </div>
      <div className="w-px h-6 bg-[#2a2a35]"></div>
      <div className="flex items-center gap-2 text-[#7a7a8c]">
        <span className="text-xs text- uppercase tracking-widest">
          Likes / Song
        </span>
        <div className="flex items-center gap-3 bg-[#1c1c24] border border-[#2a2a35] rounded-md px-3 py-1.5">
          <span className="text-xs">0</span>
          <Slider
            defaultValue={[likes]}
            onValueChange={(value) => setLikes(value[0])}
            min={0}
            max={10}
            step={0.1}
            className="w-32 h-1.5 bg-[#2a2a35] rounded-full"
          />
          <span className="text-xs">10</span>
          <span className="text-sm font-medium text-[#f0f0f2] ml-1 border-l border-[#2a2a35] pl-3">
            {likes}
          </span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1c1c24] hover:bg-[#7a7a8c] hover:text-[#1c1c24] border border-[#2a2a35] rounded-md text-sm text-[#7a7a8c] cursor-pointer">
          <Export />
          Export ZIP
        </button>
      </div>
    </div>
  );
}

function randomSeed(): bigint {
  const high = BigInt(Math.floor(Math.random() * 2 ** 32));
  const low = BigInt(Math.floor(Math.random() * 2 ** 32));

  return (high << 32n) | low;
}
