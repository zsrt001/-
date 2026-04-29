export type RedeemCodeRecord = {
  code: string;
  used: boolean;
};

export const redeemCodes: RedeemCodeRecord[] = [
  { code: "SHANHAI2026", used: false },
  { code: "SOULATLAS", used: false },
  { code: "LINGHUN", used: false },
  { code: "ATLAS2026", used: false },
  { code: "MOUNTAINSEA", used: false },
  { code: "USED2026", used: true }
];

export function normalizeRedeemCode(code: string) {
  return code.trim().toUpperCase();
}
