// This project's one phone number is Qatar-based (+974); the country code
// is always the first 3 digits of the stored digits-only number.
export function formatQatarPhone(number) {
  return `+${number.slice(0, 3)} ${number.slice(3)}`;
}
