export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export type SaProvince = (typeof SA_PROVINCES)[number];

export function isSaProvince(value: string): value is SaProvince {
  return (SA_PROVINCES as readonly string[]).includes(value);
}
