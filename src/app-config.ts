export const applicationName = "APP"

export const appMode: "comingSoon" | "maintenance" | "live" = "comingSoon"

export enum PATHS {
  Home = "/",
  Login = "/login",
  SignUp = "/signup",
  Dashboard = "/dashboard",
  PasswordRecovery = "/password-recovery",
  VerifyEmail = "/verify-email",
}

export const TOKEN_LENGTH = 32
export const TOKEN_TTL = 1000 * 60 * 5 // 5 min
export const VERIFY_EMAIL_TTL = 1000 * 60 * 60 * 24 * 7 // 7 days

export const MAX_GROUP_LIMIT = 10
export const MAX_GROUP_PREMIUM_LIMIT = 50
