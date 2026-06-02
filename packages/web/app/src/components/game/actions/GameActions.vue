<template>
	<MCard class="column">
		<MCardContent class="col column" style="min-height: 0">
			<q-list dense class="q-pa-none q-ma-none col column no-wrap" style="min-height: 0">
				<q-item
					v-for="i in 15"
					:key="i"
					class="col items-center"
					style="min-height: 0"
					:class="i % 2 === 0 ? 'bg-green' : 'bg-orange'"
				>
					<q-item-section>
						<q-item-label>{{ phaseLabel }} {{ i }}</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</MCardContent>
	</MCard>
</template>

<script setup lang="ts">
import type { GamePhase } from '@mafia/sdk';
import MCard from 'src/components/ui/Card/MCard.vue';
import MCardContent from 'src/components/ui/Card/MCardContent.vue';
import { computed } from 'vue';

const DAY_PHASES: GamePhase[] = ['day', 'poll', 'defense', 'trial'];
const NIGHT_PHASES: GamePhase[] = ['night'];

const props = withDefaults(
	defineProps<{
		phase?: GamePhase | null;
		alive?: boolean;
		hasTargets?: boolean;
	}>(),
	{
		phase: null,
		alive: false,
		hasTargets: false,
	},
);

const phaseLabel = computed(() => {
	if (!props.phase) return 'Waiting for game to start...';
	if (props.phase === 'pregame') return 'Waiting for game to start...';
	if (!props.alive) return 'You are dead.';
	if (DAY_PHASES.includes(props.phase)) return `Day phase: ${props.phase}`;
	if (NIGHT_PHASES.includes(props.phase)) return 'Choose your night action.';
	return `Phase: ${props.phase}`;
});

// const canAct = computed(() => props.alive && !!props.phase && props.phase !== 'pregame');

// const canVote = computed(() => canAct.value && !!props.phase && DAY_PHASES.includes(props.phase));

// const canUseAbility = computed(() => canAct.value && props.hasTargets);
</script>
