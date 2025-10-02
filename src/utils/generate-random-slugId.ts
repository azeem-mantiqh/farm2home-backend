export function randomString(length: number, chars: string): string {
  let mask = '';

  if (chars.includes('a')) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.includes('A')) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.includes('#')) mask += '0123456789';

  if (!mask) throw new Error('No valid character set provided');

  let result = '';
  for (let i = 0; i < length; i++) {
    result += mask[Math.floor(Math.random() * mask.length)];
  }

  return result;
}
