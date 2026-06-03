<template>
	<q-item v-if="props.actor && props.actor.alive" class="rounded-borders no-select" clickable>
		<q-item-section side class="q-pr-sm">
			<q-avatar
				class="no-select"
				size="sm"
				:text-color="props.isPlayer ? playerColor : 'slategrey'"
			>
				{{ props.actor?.number ?? '?' }}.
			</q-avatar>
		</q-item-section>

		<q-item-section>
			<q-item-label :style="{ color: playerColor }">
				{{ props.actor.alias }}
				<span v-if="isPlayer" class="text-caption text-grey">(me)</span>
				<span v-if="isAlly" class="text-caption text-grey">(ally)</span>
			</q-item-label>
		</q-item-section>
	</q-item>

	<!-- Placeholder for empty slot keeping layout consistent -->
	<q-item v-else>
		<q-item-section side class="q-pr-sm">
			<q-avatar class="no-select" size="sm" rounded text-color="grey">{{ props.number }}.</q-avatar>
		</q-item-section>
	</q-item>
</template>

<script setup lang="ts">
import { type GameState } from '@mafia/sdk';
import { getCssVar } from 'src/util/colors';
import { computed } from 'vue';

const props = defineProps<{
	actor: GameState['actors'][number] | undefined;
	number: number;
	isPlayer?: boolean;
	isAlly?: boolean | undefined;
}>();

const playerColor = computed(() => {
	return getCssVar(`--player-${props.actor?.number}`) || 'grey';
});
</script>
