/**
 * Phone numbers, as the engine stores and matches them: `91` + the 10-digit
 * national number, digits only. Mirrors `canonicalIndianMobile` in the engine.
 *
 * The admin app sent whatever was typed. User search suggested "9876543210",
 * which the engine refuses (it wants 91…), and the KYC form required exactly
 * ten digits while the engine stores and requires twelve — so the prefilled
 * value failed the form's own check and NO edit to a seller's KYC could be
 * saved while it held a phone.
 */
export function canonicalIndianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, '').replace(/^0+/, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return /^[6-9]\d{9}$/.test(digits) ? `91${digits}` : null;
}

/** The ten digits shown beside a fixed "+91". */
export function nationalMobile(stored: string | null | undefined): string {
  const canonical = stored ? canonicalIndianMobile(stored) : null;
  return canonical ? canonical.slice(2) : (stored ?? '');
}
