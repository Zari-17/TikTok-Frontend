import LoginModal from "@/components/modals/LoginModal";
import Options from "@/components/navbar/Options";
import { useFiltersContext } from "@/context/FiltersContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { IoSearch } from "react-icons/io5";

type ReturnType = Readonly<{
  children: React.ReactNode;
}>;

const AppLayout = ({ children }: ReturnType) => {
  const { search, setSearch } = useFiltersContext();
  const router = useRouter();
  const isSearchPage = useMemo(() => router.pathname.includes("/explore"), [router.pathname]);

  const onSearchChange = (text: string) => {
    if (!isSearchPage) {
      router.push("/explore");
    }
    setSearch(text);
  };

  return (
    <div className="flex">
      <div className="w-56 h-[100dvh]" />
      <nav className="w-56 h-[100dvh] fixed p-4 py-6 bg-black">
        <ul>
          <li>
            <Link href="/">
              <img src="/images/tiktok-logo.svg" className="w-[140px]" alt="TikTok Logo" />
            </Link>
          </li>
          <li className="my-4">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => {
                  const text = e.target.value;
                  onSearchChange(text);
                }}
                type="text"
                placeholder="Search"
                className="w-full p-2 pl-10 bg-[#1f1f1f] rounded-full focus:outline-none placeholder-app-gray"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IoSearch />
              </div>
            </div>
          </li>
          <Options />

          <LoginModal />
          <div>
            <p className="mt-5 text-xs text-app-gray font-bold ">@ 2024 TikTok by Zaryan</p>
          </div>
        </ul>
      </nav>

      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};

export default AppLayout;
