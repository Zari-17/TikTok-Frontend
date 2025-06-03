"use client";
import { createContext, useContext, useState } from "react";

export interface FiltersContextType {
  search: string;
  setSearch: (search: string) => void;
}

const FiltersContext = createContext<FiltersContextType>({} as FiltersContextType);

export const useFiltersContext = () => {
  return useContext(FiltersContext) as FiltersContextType;
};

const FiltersContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState<string>("");

  return <FiltersContext.Provider value={{ search, setSearch }}>{children}</FiltersContext.Provider>;
};

export default FiltersContextProvider;
