export const analyticsEventNames = [
  "code_verified",
  "quiz_started",
  "question_answered",
  "quiz_completed",
  "result_generating",
  "result_viewed",
  "share_card_saved",
  "code_invalid",
  "code_used"
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

const analyticsEventNameSet = new Set<string>(analyticsEventNames);

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return analyticsEventNameSet.has(value);
}
