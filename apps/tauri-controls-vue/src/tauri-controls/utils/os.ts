import type { OsType } from "@tauri-apps/plugin-os"
import { isTauri } from "@tauri-apps/api/core"
let osType: OsType | "unknown" = "unknown"

// A helper function to get the OS type, which returns a Promise
export async function getOsType(): Promise<OsType|"unknown"> {
  if (!isTauri()) return "unknown"
  if (osType) return osType
  const osModule = await import("@tauri-apps/plugin-os")
  osType = osModule.type()
  console.debug("getOsType",osType)
  return osType
}