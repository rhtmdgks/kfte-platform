import type { Database } from "@/types/database"

export type AuthPortal = "member" | "partner" | "internal"

export type UserRole = Database["public"]["Enums"]["user_role"]

export type PortalConfig = {
  id: AuthPortal
  title: string
  description: string
  loginPath: string
  forgotPasswordPath: string
  resetPasswordPath: string
  redirectPath: string
  allowedRoles: readonly UserRole[]
  wrongPortalMessage: string
}

export const authPortals: Record<AuthPortal, PortalConfig> = {
  member: {
    id: "member",
    title: "일반 회원 로그인",
    description: "KFTE 일반 회원 계정으로 로그인하세요",
    loginPath: "/login",
    forgotPasswordPath: "/login/forgot-password",
    resetPasswordPath: "/login/reset-password",
    redirectPath: "/members",
    allowedRoles: ["user"],
    wrongPortalMessage: "일반 회원 계정이 아닙니다. 파트너·내부 포털은 KFTE OS를 이용해 주세요.",
  },
  partner: {
    id: "partner",
    title: "KFTE OS · 파트너 포털",
    description: "파트너 계정으로 로그인하세요",
    loginPath: "/kfte-os/partner/login",
    forgotPasswordPath: "/kfte-os/partner/forgot-password",
    resetPasswordPath: "/kfte-os/partner/reset-password",
    redirectPath: "/partner",
    allowedRoles: ["partner"],
    wrongPortalMessage: "파트너 계정이 아닙니다. 해당 포털 전용 계정으로 로그인해 주세요.",
  },
  internal: {
    id: "internal",
    title: "KFTE OS · 내부용",
    description: "재단 내부 관리자 계정으로 로그인하세요",
    loginPath: "/kfte-os/internal/login",
    forgotPasswordPath: "/kfte-os/internal/forgot-password",
    resetPasswordPath: "/kfte-os/internal/reset-password",
    redirectPath: "/admin",
    allowedRoles: ["admin"],
    wrongPortalMessage: "내부 관리자 계정이 아닙니다. 해당 포털 전용 계정으로 로그인해 주세요.",
  },
}

export function isRoleAllowedForPortal(role: UserRole, portal: AuthPortal) {
  return authPortals[portal].allowedRoles.includes(role)
}

export function getPortalFromPath(pathname: string): AuthPortal | null {
  if (pathname.startsWith("/login")) return "member"
  if (pathname.startsWith("/kfte-os/partner")) return "partner"
  if (pathname.startsWith("/kfte-os/internal")) return "internal"
  return null
}

export const INTERNAL_EMAIL_DOMAIN = "kfte.kr"

export function buildInternalEmail(localPart: string) {
  const trimmed = localPart.trim()
  const id = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed
  return `${id}@${INTERNAL_EMAIL_DOMAIN}`
}
