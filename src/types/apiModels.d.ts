export type ISODateString = string;
export type SubscriptionTier = 'free' | 'pro' | 'enterprise' | (string & {});

export interface TokenPayload {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id?: string | number;
  user_id?: string | number;
  email?: string;
  username?: string;
  full_name?: string;
  name?: string;
  role?: string;
  roles?: string[];
  is_admin?: boolean;
  isAdmin?: boolean;
  created_at?: ISODateString;
  updated_at?: ISODateString;
}

export interface Profile {
  full_name?: string;
  username?: string;
  email?: string;
  bio?: string;
  timezone?: string;
}

export interface NotificationPreferences {
  new_follower_email?: boolean;
  new_follower_push?: boolean;
  connection_request_email?: boolean;
  connection_request_push?: boolean;
  post_engagement_email?: boolean;
  post_engagement_push?: boolean;
  ai_insights_email?: boolean;
  ai_insights_push?: boolean;
  weekly_report_email?: boolean;
  weekly_report_push?: boolean;
  billing_email?: boolean;
  billing_push?: boolean;
  security_email?: boolean;
  security_push?: boolean;
}

export interface SecuritySettings {
  mfa_enabled?: boolean;
  session_alerts?: boolean;
  session_timeout_minutes?: number;
}

export interface ChatResponse {
  id?: string | number;
  chat_id?: string | number;
  user_message?: string;
  assistant_response?: string;
  response?: string;
  ai_message?: string;
  status?: string;
  created_at?: ISODateString;
  updated_at?: ISODateString;
  timestamp?: ISODateString;
}

export interface ChatHistory {
  chats: ChatResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface Subscription {
  tier?: SubscriptionTier;
  status?: string;
  renews_at?: ISODateString;
  credits_balance?: number;
}

export interface Entitlements {
  tier?: SubscriptionTier;
  features?: Record<string, boolean>;
  entitlements?: Record<string, boolean>;
  available_features?: string[];
  disabled_features?: string[];
  credits_balance?: number;
  messages_remaining?: number;
  monthly_limit?: number;
}

export interface UsageSummary {
  tier?: SubscriptionTier;
  credits_balance?: number;
  messages_remaining?: number;
  remaining?: number;
  monthly_limit?: number;
  limit?: number;
}

export interface CreditWallet {
  credits_balance?: number;
  balance?: number;
  credits?: number;
}

export interface CreditTransaction {
  id?: string | number;
  amount?: number;
  balance_after?: number;
  reason?: string;
  created_at?: ISODateString;
  [key: string]: unknown;
}

export interface FeatureCost {
  feature?: string;
  cost?: number;
  unit?: string;
  [key: string]: unknown;
}

export interface AIUsage {
  id?: string | number;
  status?: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  estimated_cost?: number;
  credits_charged?: number;
  created_at?: ISODateString;
  [key: string]: unknown;
}

export interface Experience {
  id?: string | number;
  [key: string]: unknown;
}

export interface Opinion {
  id?: string | number;
  [key: string]: unknown;
}

export interface UserPost {
  id?: string | number;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiErrorPayload {
  code?: string;
  message?: string;
  status?: number;
  request_id?: string;
  path?: string;
  timestamp?: ISODateString;
  details?: unknown;
}

export interface ApiErrorEnvelope {
  error?: ApiErrorPayload;
  detail?: string | Array<Record<string, unknown>>;
  details?: unknown;
}

export interface ApiResponse<T> {
  status: number;
  headers: Headers;
  data: T;
}