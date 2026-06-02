<template>
	<q-item class="rounded-borders" clickable>
		<q-item-section side class="q-pr-sm">
			<q-avatar size="sm" rounded text-color="white"> {{ playerNumber }}. </q-avatar>
		</q-item-section>

		<q-item-section>
			<q-item-label :style="{ color: playerColor }"> Test </q-item-label>
		</q-item-section>
	</q-item>
</template>

<script setup lang="ts">
import { getCssVar } from 'src/util/colors';
import { computed } from 'vue';

const props = defineProps<{
	playerNumber: number;
}>();

const playerColor = computed(() => {
	return getCssVar(`--player-${props.playerNumber}`) || 'grey';
});
</script>
