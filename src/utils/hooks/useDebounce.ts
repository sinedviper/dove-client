import { useRef } from 'react'

//that debounce hook
export function useDebounce<T extends (...args) => void>(func: T, delayMs: number) {
  const intervalRef = useRef<NodeJS.Timeout>()

  return function (...args: Parameters<T>) {
    if (intervalRef.current) clearTimeout(intervalRef.current)
    intervalRef.current = setTimeout(() => func.apply(null, [...args]), delayMs)
  }
}
