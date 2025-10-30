/**
 * API exports index
 */
export { AuthApi } from "./authApi";
export { UsersApi } from "./usersApi";
export { ProfilesApi } from "./profilesApi";
export { UserSettingsApi } from "./userSettingsApi";
export { HealthApi } from "./healthApi";
export { GoalsApi } from "./goalsApi";
export { CheckQueryApi } from "./checkQueryApi";
export { InsightApi } from "./insightApi";
export { CheckThresholdApi } from "./checkThresholdApi";
export { HealthHistoryApi } from "./healthHistoryApi";
export { UploadFileApi } from "./uploadFileApi";
export { ComprehensiveAlertsApi } from "./comprehensiveAlertsApi";
export { TrendsApi } from "./trendsApi";
export { GetAlertsInsightApi } from "./getAlertsInsightApi";

// Utilities and helpers
export { createCrudApi } from "./helpers";
export { request, authRequest } from "./apiClient";

// Bulk export for convenience
export const Api = {
  Auth: AuthApi,
  Users: UsersApi,
  Profiles: ProfilesApi,
  UserSettings: UserSettingsApi,
  Health: HealthApi,
  Goals: GoalsApi,
  CheckQuery: CheckQueryApi,
  Insight: InsightApi,
  CheckThreshold: CheckThresholdApi,
  HealthHistory: HealthHistoryApi,
  UploadFile: UploadFileApi,
  ComprehensiveAlerts: ComprehensiveAlertsApi,
  Trends: TrendsApi,
  GetAlertsInsight: GetAlertsInsightApi,
};