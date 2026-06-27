import { redirect } from "next/navigation"

export default function AdminForgotPasswordRedirect() {
  redirect("/kfte-os/internal/forgot-password")
}
