import Menu from "~/components/Menu";
import type { Route } from "./+types/home";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [tableView, setTableView] = useState(true);
  return (
    <div className="bg-[#0f0f13] min-h-full flex flex-col">
      <Menu tableView={tableView} setTableView={setTableView} />
    </div>
  );
}
