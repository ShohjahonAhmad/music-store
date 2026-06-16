import Menu from "~/components/Menu";
import type { Route } from "./+types/home";
import { useState } from "react";
import Toolbar from "~/components/Toolbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [tableView, setTableView] = useState(true);
  const [seed, setSeed] = useState<bigint>(123n);
  const [likes, setLikes] = useState<number>(3.7);
  return (
    <div className="bg-[#0f0f13] min-h-full flex flex-col">
      <Menu tableView={tableView} setTableView={setTableView} />
      <Toolbar
        seed={seed}
        setSeed={setSeed}
        likes={likes}
        setLikes={setLikes}
      />
    </div>
  );
}
