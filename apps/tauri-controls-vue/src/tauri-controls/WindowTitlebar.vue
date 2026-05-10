<script setup lang="ts">
import type { OsType } from "@tauri-apps/plugin-os";
import { twMerge } from "tailwind-merge";
import { ref } from "vue";
import type { WindowControlsProps, WindowTitlebarProps } from "./types";
import { getOsType } from "./utils/os";
import WindowControls from "./WindowControls.vue";

const props = withDefaults(defineProps<WindowTitlebarProps>(), {
  controlsOrder: "system",
});

const osType = ref<OsType | undefined>(undefined);

const init = async () => {
  const type = await getOsType();
  console.log("WindowTitlebar osType", type);
  if (type === "unknown") return;
  osType.value = type;
};

const left =
  props.controlsOrder === "left" ||
  (props.controlsOrder === "platform" && props.windowControlsProps?.platform === "macos") ||
  (props.controlsOrder === "system" && osType.value === "macos");

const customProps = (ml: string) => {
  if (props.windowControlsProps?.justify !== undefined) return props.windowControlsProps;

  const {
    justify: windowControlsJustify,
    className: windowControlsClassName,
    ...restProps
  } = props.windowControlsProps || {};
  return {
    justify: false,
    className: twMerge(windowControlsClassName, ml),
    ...restProps,
  } as WindowControlsProps;
};
init();
</script>

<template>
  <div
    :class="
      twMerge('bg-background flex select-none flex-row overflow-hidden', $attrs.class as string)
    "
    data-tauri-drag-region
  >
    <template v-if="left">
      <WindowControls :="customProps('ml-0')" />
      <slot />
    </template>
    <template v-else>
      <slot />
      <WindowControls :="customProps('ml-auto')" />
    </template>
  </div>
</template>
