<template>
  <div>
    <div class="font-semibold text-lg mb-3">Characters</div>

    <div v-if="isLoadingCharacter">
      <div class="grid grid-cols-4 gap-4 mb-3">
        <div v-for="i in 12" :key="i" class="col-span-1">
          <div class="flex flex-col space-y-2">
            <Skeleton class="h-[180px] w-full rounded-xl" />
            <div class="space-y-2">
              <Skeleton class="h-3 w-[85%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="errorCharacter">Error {{ errorCharacter }}"></div>
    <template
      v-else-if="
        !isLoadingCharacter && !errorCharacter && characters.length > 0
      "
    >
      <div class="grid grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
        <template v-if="lessCharacters.length > 0">
          <div
            v-for="char in lessCharacters"
            :key="char.character.mal_id"
            class="col-span-1 relative hover:scale-[1.085] transition-all duration-300 ease-in-out"
          >
            <NuxtImg
              :src="char.character.images.webp.image_url"
              :alt="char.character.name"
              class="h-[200px] w-full object-cover object-center rounded-t-md"
              placeholder="/images/fallback-image.png"
            />
            <div
              class="absolute z-10 top-2 left-2 px-1 py-0.5 rounded"
              :class="{
                'bg-blue-600/80': char.role == 'Main',
                'bg-yellow-600/80': char.role == 'Supporting',
              }"
            >
              <div class="text-[11px] text-white">
                {{ char.role }}
              </div>
            </div>
            <div class="absolute z-10 bottom-2 left-2">
              <div class="text-[13px] truncate text-white font-bold">
                {{ char.character.name }}
              </div>
            </div>
            <div
              class="absolute z-0 inset-0 h-full w-full bg-gradient-to-t from-gray-950 via-transparent"
            ></div>
          </div>
        </template>
        <template v-if="moreCharacters.length > 0 && isMoreCharacters">
          <div
            v-for="char in moreCharacters"
            :key="char.character.mal_id"
            class="col-span-1 relative hover:scale-[1.085] transition-all duration-300 ease-in-out"
          >
            <NuxtImg
              :src="char.character.images.webp.image_url"
              :alt="char.character.name"
              class="h-[200px] w-full object-cover object-center rounded-t-md"
              placeholder="/images/fallback-image.png"
            />
            <div
              class="absolute z-10 top-2 left-2 px-1 py-0.5 rounded"
              :class="{
                'bg-blue-600/80': char.role == 'Main',
                'bg-yellow-600/80': char.role == 'Supporting',
              }"
            >
              <div class="text-[11px] text-white">
                {{ char.role }}
              </div>
            </div>
            <div class="absolute z-10 bottom-2 left-2">
              <div class="text-[13px] truncate text-white font-bold">
                {{ char.character.name }}
              </div>
            </div>
            <div
              class="absolute z-0 inset-0 h-full w-full bg-gradient-to-t from-gray-950 via-transparent"
            ></div>
          </div>
        </template>
      </div>
      <div class="mt-6">
        <div class="w-full text-center my-2">
          <Button
            variant="secondary"
            @click="
              isMoreCharacters
                ? (isMoreCharacters = false)
                : (isMoreCharacters = true)
            "
          >
            <span v-if="!isMoreCharacters && characters.length > 16"
              >More Characters</span
            >
            <span v-if="isMoreCharacters">Less Characters</span>
          </Button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TMangaCharacter } from "~/types/jikanMangaCharacter.type";

const props = defineProps<{
  isLoadingCharacter: boolean;
  errorCharacter: string;
  characters: TMangaCharacter[];
}>();

const isMoreCharacters = ref(false);

const lessCharacters = computed(() => {
  return props.characters.slice(0, 16) ?? [];
});

const moreCharacters = computed(() => {
  return props.characters.slice(16, props.characters.length) ?? [];
});
</script>
