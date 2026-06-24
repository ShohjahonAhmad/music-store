import { useTranslation } from "react-i18next";
import Gallery from "~/utils/Gallery";
import Logo from "~/utils/Logo";
import Table from "~/utils/Table";

export default function Menu({
  tableView,
  setTableView,
}: {
  tableView: boolean;
  setTableView: (newView: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <header className="w-full bg-[#17171f] border-b border-[#2a2a35] flex flex-col lg:flex-row items-center justify-between px-8 py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-[#1db954] flex items-center justify-center">
          <Logo />
        </div>
        <span className="font-bold text-xl text-[#f0f0f2] tracking-tight">
          SoundForge
        </span>
        <span className="text-xs text-[#7a7a8c] bg-[#2a2a35] px-2 py-0.5 rounded-xs font-body">
          {t("header.desc")}
        </span>
      </div>
      <div className="flex items-center gap-2 bg-[#1c1c24] p-1">
        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium cursor-pointer ${tableView ? "bg-[#1db954] text-black" : "text-[#7a7a8c]"} `}
          onClick={() => setTableView(true)}
        >
          <Table />
          {t("header.table")}
        </button>
        <button
          className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm font-medium cursor-pointer ${!tableView ? "bg-[#1db954] text-black" : "text-[#7a7a8c]"}`}
          onClick={() => setTableView(false)}
        >
          <Gallery />
          {t("header.gallery")}
        </button>
      </div>
    </header>
  );
}
