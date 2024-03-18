import { createStore } from "zustand/vanilla";

export type SearchState = {
  search: string;
};

export type SearchActions = {
  setSearch: (search: string) => void;
};

export const initSearchStore = (): SearchState => {
  return { search: "" };
};

export type SearchStore = SearchState & SearchActions;

export const defaultInitState: SearchState = {
  search: "",
};

export const createSearchStore = (
  initState: SearchState = defaultInitState
) => {
  return createStore<SearchStore>()((set) => ({
    ...initState,
    setSearch: (search) => set({ search }),
  }));
};
