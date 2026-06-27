import { redirect } from "next/navigation"

export default function AdminResetPasswordRedirect() {
  redirect("/kfte-os/internal/reset-password")
}
