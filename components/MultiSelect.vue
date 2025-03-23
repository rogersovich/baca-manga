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
            :key="option"
            class="bg-accent px-2 py-1 rounded text-[13px]"
          >
            {{ option }}
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
  options: { label: string; value: string }[];
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

const localValue = ref([...props.modelValue]);

const toggleSelection = (val: string) => {
  const selected = props.options.find((opt) => opt.value === val);
  const labelValue = selected?.label || "";

  if (localValue.value.includes(labelValue)) {
    localValue.value = localValue.value.filter((v) => v !== labelValue);
  } else {
    localValue.value.push(labelValue);
  }

  emit("update:modelValue", localValue.value);
};

const isItemSelected = computed(() => {
  return (selected: string[], item: string) => {
    return selected.map((val) => val.trim()).includes(item);
  };
});
</script>

<style>
.PopoverContent {
  width: var(--reka-popover-trigger-width);
}
</style>
