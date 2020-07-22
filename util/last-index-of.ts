
export function lastIndexOf<T>(list: T[], iteratee: (item: T, index: number, list: T[]) => boolean): number {
  const index = [...list].reverse().findIndex(iteratee)
  if (index === -1) {
    return -1
  }
  return list.length - index
}
