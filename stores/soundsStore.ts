import {createStore} from 'zustand/vanilla'
import {Sound} from "@/app/market/[[...path]]/page";
import {persist} from 'zustand/middleware'

export type SoundsState = {
    sounds: Sound[]
}

export type SoundsActions = {
    setSounds: (sounds: Sound[]) => void
    addSound: (sound: Sound) => void
    removeSound: (sound: Sound) => void
    updateSound: (sound: Sound) => void
    clearSounds: () => void
}

export const initSoundsStore = (): SoundsState => {
    return {sounds: []}
}

export type SoundsStore = SoundsState & SoundsActions

export const defaultInitState: SoundsState = {
    sounds: []
}

export const createSoundsStore = (
    initState: SoundsState = defaultInitState,
) => {
    return createStore<SoundsStore>()(persist(
        (set) => ({
            ...initState,
            setSounds: (sounds) => set({sounds}),
            addSound: (sound) => set((state) => ({sounds: [...state.sounds, sound]})),
            removeSound: (sound) => set((state) => ({sounds: state.sounds.filter((s) => s !== sound)})),
            updateSound: (sound) => set((state) => ({sounds: state.sounds.map((s) => s === sound ? sound : s)})),
            clearSounds: () => set({sounds: []})
        }),
        {
            name: 'sounds-store',
        }
    ))
}