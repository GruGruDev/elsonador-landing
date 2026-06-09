"use server";

import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function performLogout() {
  await logout();
  redirect("/login");
}
