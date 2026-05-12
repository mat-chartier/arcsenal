export type BlasonType = 'anglais' | 'campagne';

export function getScoreClass(value: number | 'X' | 'M', blasonType: BlasonType = 'anglais'): string {
  if (blasonType === 'campagne') {
    if (value === 6 || value === 5) return 'yellow';
    if (value === 4 || value === 3 || value === 2 || value === 1) return 'black';
    if (value === 'M') return 'grey';
    return '';
  }
  if (value === 'X' || value === 10 || value === 9) return 'yellow';
  if (value === 8 || value === 7) return 'red';
  if (value === 6 || value === 5) return 'blue';
  if (value === 4 || value === 3) return 'black';
  if (value === 2 || value === 1) return 'white';
  if (value === 'M') return 'grey';
  return '';
}
