<template>
  <Popover :open="isOpen" @update:open="onUpdateOpen">
    <PopoverTrigger
      class="w-full min-h-11 h-auto text-left border rounded-md py-2 px-3"
      :class="{
        'cursor-not-allowed': disabled,
      }"
    >
      <template v-if="localValue.length > 0">
        <div class="flex flex-wrap items-center gap-2">
          <div
            v-for="option in localValue"
            :key="option.value"
            class="bg-accent px-2 py-1 rounded text-[13px]"
          >
            {{ option.label }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground text-[14px]">
            {{ placeholder }}
          </span>
          <IconChevronDown
            class="size-[18px] text-muted-foreground opacity-50"
          />
        </div>
      </template>
    </PopoverTrigger>

    <PopoverContent
      align="start"
      class="PopoverContent shadow rounded p-2 max-h-[300px] overflow-y-auto"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="flex items-center gap-2"
      >
        <div
          class="hover:bg-accent w-full px-2 py-1 rounded cursor-pointer text-[14px]"
          :class="{
            'flex justify-between items-center': isItemSelected(
              localValue,
              option.label
            ),
          }"
          @click="toggleSelection(option.value)"
        >
          <div>{{ option.label }}</div>
          <IconCheck
            v-if="isItemSelected(localValue, option.label)"
            class="size-[20px]"
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { IconCheck, IconChevronDown } from "@tabler/icons-vue";

const props = defineProps<{
  modelValue: string[];
  options: { label: string; value: any }[];
  placeholder?: string;
  disabled?: boolean;
}>();
const isOpen = ref(false);

const emit = defineEmits(["update:modelValue"]);

const onUpdateOpen = (open: boolean) => {
  if (props.disabled) {
    open = false;
  } else {
    isOpen.value = open;
  }
};

const localValue = ref<{ label: string; value: any }[]>([
  ...props.modelValue.map((v) => {
    const opt = props.options.find((o) => o.value === v);
    return opt
      ? { value: opt.value, label: opt.label }
      : { value: v, label: v };
  }),
]);

const toggleSelection = (val: any) => {
  const selected = props.options.find((opt) => opt.value == val);
  if (!selected) return;

  const index = localValue.value.findIndex((v) => v.value === selected.value);

  if (index > -1) {
    localValue.value.splice(index, 1);
  } else {
    localValue.value.push({ value: selected.value, label: selected.label });
  }

  emit(
    "update:modelValue",
    localValue.value.map((v) => v.value)
  );
};

const isItemSelected = computed(() => {
  return (selected: { label: string; value: any }[], itemLabel: string) => {
    return selected.some((val) => val.label.trim() === itemLabel);
  };
});
</script>

<style>
.PopoverContent {
  width: var(--reka-popover-trigger-width);
}
</style>
