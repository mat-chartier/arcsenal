export function getScoreClass(value: number | 'X' | 'M'): string {
    if (value === 'X' || value === 10 || value === 9) return 'yellow';
    if (value === 8 || value === 7) return 'red';
    if (value === 6 || value === 5) return 'blue';
    if (value === 4 || value === 3) return 'black';
    if (value === 2 || value === 1) return 'white';
    if (value === 'M') return 'grey';
    return '';
}