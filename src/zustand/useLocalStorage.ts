import { create } from 'zustand';

const stores: any = {};

export function useLocalStorage<T>(key: string, initialValue: T) {
  if (!stores[key]) {
    stores[key] = create<{ value: T; setValue: (newValue: T | ((prev: T) => T)) => void }>()((set) => ({
      value: JSON.parse(localStorage.getItem(key) ?? JSON.stringify(initialValue)),
      setValue: (newValue: T | ((prev: T) => T)) => {
        set((state: { value: T }) => {
          const valueToStore = typeof newValue === 'function' ? (newValue as (prev: T) => T)(state.value) : newValue;
          localStorage.setItem(key, JSON.stringify(valueToStore));
          return { value: valueToStore };
        });
      },
    }));
  }

  const state = stores[key]((state: { value: T }) => state.value);
  const setState = stores[key](
    (state: { value: T; setValue: (newValue: T | ((prev: T) => T)) => void }) => state.setValue
  );

  // Return as array to match useState pattern
  return [state, setState];
}
