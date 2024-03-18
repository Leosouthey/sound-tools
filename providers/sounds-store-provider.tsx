'use client'

import {createContext, type ReactNode, useContext, useRef} from 'react'
import {type StoreApi, useStore} from 'zustand'
import {createSoundsStore, initSoundsStore, SoundsStore} from "@/stores/soundsStore";

export const SoundsStoreContext = createContext<StoreApi<SoundsStore> | null>(
    null,
)

export interface SoundsStoreProviderProps {
    children: ReactNode
}

export const SoundsStoreProvider = ({
                                        children,
                                    }: SoundsStoreProviderProps) => {
    const storeRef = useRef<StoreApi<SoundsStore>>()
    if (!storeRef.current) {
        storeRef.current = createSoundsStore(initSoundsStore())
    }

    return (
        <SoundsStoreContext.Provider value={storeRef.current}>
            {children}
        </SoundsStoreContext.Provider>
    )
}

export const useSoundsStore = <T, >(
    selector: (store: SoundsStore) => T,
): T => {
    const counterStoreContext = useContext(SoundsStoreContext)

    if (!counterStoreContext) {
        throw new Error(`useSoundsStore must be use within SoundsStoreProvider`)
    }

    return useStore(counterStoreContext, selector)
}