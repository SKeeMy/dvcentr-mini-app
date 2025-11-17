import { IApiRemainsResponse } from "@/components/pages/home/remains/remains.interface";
import { create } from "zustand";

interface IRemainsState {
  isLoading: boolean
  data: IApiRemainsResponse | null

  setLoading: (val: boolean) => void
  setData: (data: IApiRemainsResponse) => void
}

export const useRemainsStore = create<IRemainsState>((set, get) => ({
  isLoading: false,
  data: null,

  setLoading: (state: boolean) => set({ isLoading: state }),
  setData: (state: IApiRemainsResponse) => set({ data: state }),
}))