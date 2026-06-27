"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateProfileRole(id: string, role: "admin" | "user") {
  const supabase = await createClient()

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/accounts/admins")
  revalidatePath("/admin/accounts/users")
}

export async function deleteProfile(id: string) {
  const supabase = await createClient()

  // auth.users 삭제 → cascade로 profiles도 삭제됨
  const { error } = await supabase.auth.admin.deleteUser(id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/accounts/admins")
  revalidatePath("/admin/accounts/users")
}
