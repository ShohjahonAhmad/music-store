import Menu from "~/components/Menu";
import type { Route } from "./+types/home";
import Toolbar from "~/components/Toolbar";
import TableView from "~/components/TableView";
import { useSearchParams } from "react-router";
import getSongs from "~/api/getSongs";
import GalleryView from "~/components/GalleryView";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page") || "1");
  const likes = Number(searchParams.get("likes") || "3.5");
  const seed = BigInt(searchParams.get("seed") || "123");
  const locale = searchParams.get("locale") || "en";

  return getSongs(page, seed, likes, locale);
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tableViewParam = searchParams.get("view") || "true";
  const tableView = tableViewParam === "true" ? true : false;
  const page = Number(searchParams.get("page") || "1");
  const likes = Number(searchParams.get("likes") || "3.5");
  const locale = searchParams.get("locale") || "en";
  const seed = BigInt(searchParams.get("seed") || "123");

  const setTableView = (newView: boolean) => {
    setSearchParams((prev) => {
      prev.set("view", newView ? "true" : "false");
      prev.set("page", "1");
      return prev;
    });
  };

  const setSeed = (newSeed: bigint) => {
    setSearchParams((prev) => {
      prev.set("seed", newSeed.toString());
      prev.set("page", "1");
      return prev;
    });
  };

  const setLikes = (newLikes: number) => {
    setSearchParams((prev) => {
      prev.set("likes", newLikes.toString());
      return prev;
    });
  };

  const setLocale = (newLocale: string) => {
    setSearchParams((prev) => {
      prev.set("locale", newLocale);
      prev.set("page", "1");
      return prev;
    });
  };

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  return (
    <div className="bg-[#0f0f13] min-h-screen flex flex-col">
      <Menu tableView={tableView} setTableView={setTableView} />
      <Toolbar
        seed={seed}
        setSeed={setSeed}
        likes={likes}
        setLikes={setLikes}
        locale={locale}
        setLocale={setLocale}
        tableView={tableView}
        page={page}
      />
      {tableView ? (
        <TableView page={page} setPage={setPage} seed={seed} locale={locale} />
      ) : (
        <GalleryView seed={seed} locale={locale} likes={likes} />
      )}
    </div>
  );
}
