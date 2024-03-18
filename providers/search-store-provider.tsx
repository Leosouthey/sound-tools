"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";
import {createSearchStore, initSearchStore, SearchStore} from "@/stores/searchStore";

export const SearchStoreContext = createContext<StoreApi<SearchStore> | null>(
  null
);

export interface SearchStoreProviderProps {
  children: ReactNode;
}

export const SearchStoreProvider = ({ children }: SearchStoreProviderProps) => {
  const storeRef = useRef<StoreApi<SearchStore>>();
  if (!storeRef.current) {
    storeRef.current = createSearchStore(initSearchStore());
  }

  return (
    <SearchStoreContext.Provider value={storeRef.current}>
      {children}
    </SearchStoreContext.Provider>
  );
};

export const useSearchStore = <T,>(selector: (store: SearchStore) => T): T => {
  const counterStoreContext = useContext(SearchStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useSearchStore must be use within SearchStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
