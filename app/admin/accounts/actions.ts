"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") throw new Error("Unauthorized")
  return { supabase, user }
}

function revalidateAccountPaths() {
  revalidatePath("/admin/accounts/admins")
  revalidatePath("/admin/accounts/users")
}

export async function updateProfileRole(id: string, role: "admin" | "user") {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id)
  if (error) throw new Error(error.message)

  revalidateAccountPaths()
}

export async function updateProfileDisplayName(id: string, displayName: string) {
  const { supabase } = await requireAdmin()
  const name = displayName.trim()
  if (!name) throw new Error("이름을 입력해 주세요.")

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  // Keep auth metadata in sync when service role is available
  try {
    const admin = createAdminClient()
    await admin.auth.admin.updateUserById(id, {
      user_metadata: { display_name: name },
    })
  } catch {
    // ponytail: profile row is source of truth; metadata sync optional
  }

  revalidateAccountPaths()
}

export async function updateUserPassword(id: string, password: string) {
  await requireAdmin()

  if (password.length < 8) {
    throw new Error("비밀번호는 8자 이상이어야 합니다.")
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.updateUserById(id, { password })
  if (error) throw new Error(error.message)

  revalidateAccountPaths()
}

export async function deleteProfile(id: string) {
  const { user } = await requireAdmin()
  if (id === user.id) throw new Error("본인 계정은 삭제할 수 없습니다.")

  const admin = createAdminClient()
  // auth.users 삭제 → cascade로 profiles도 삭제됨
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) throw new Error(error.message)

  revalidateAccountPaths()
}
