import type { window } from "@tauri-apps/api"
import { isTauri } from "@tauri-apps/api/core"
import { ref } from "vue"

export const appWindow = ref<window.Window | null>(null)
export const isWindowMaximized = ref(false)

const windowResizeHandle = async function(){
  const isMaximized = await appWindow.value?.isMaximized()
  if (isMaximized !== undefined) {
    isWindowMaximized.value = isMaximized
  }
};

(async function initWindow() {
  if (!isTauri()) return
  
 const module = await import("@tauri-apps/api/window")
  appWindow.value = module.getCurrentWindow()

  appWindow.value.onResized(windowResizeHandle).catch((err) => {
    console.error("windowResizeHandle error", err)
  })
})().catch((err) => {
  console.error("initWindow error", err)
});


export const minimizeWindow = async () => {
  await appWindow.value?.minimize()
}

export const maximizeWindow = async () => {
  await appWindow.value?.toggleMaximize()
}

export const fullscreenWindow = async () => {
  if (appWindow) {
    const fullscreen = await appWindow.value?.isFullscreen()
    await appWindow.value?.setFullscreen(!fullscreen)
  }
}

export const closeWindow = async () => {
  await appWindow.value?.close()
}
