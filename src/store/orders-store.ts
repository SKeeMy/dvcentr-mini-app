import { IApiResponse } from "@/components/pages/home/orders/orders.interface";
import { create } from "zustand";

interface IOrdersState {
  isLoading: boolean
  data: IApiResponse | null

  setLoading: (val: boolean) => void
  setData: (data: IApiResponse) => void


  isOrdering: boolean
  setIsOrdering: (val: boolean) => void

}


export const useOrdersStore = create<IOrdersState>((set, get) => ({
  isLoading: false,
  data: null,
  
  isOrdering: false,


  setLoading: (state: boolean) => set({ isLoading: state }),
  setData: (state: IApiResponse) => set({ data: state }),

  setIsOrdering: (state: boolean) => set({isOrdering: state})

}))
