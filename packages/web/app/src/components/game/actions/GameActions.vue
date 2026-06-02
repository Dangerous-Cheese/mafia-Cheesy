<template>
	<MCard class="column">
		<MCardContent class="col column" style="min-height: 0">
			<q-list
				dense
				class="col column no-wrap justify-evenly"
				style="min-height: 0; padding-left: 0px !important"
			>
				<GameActionsItem v-for="i in 15" :key="i" style="min-height: 0" :player-number="i" />
			</q-list>
		</MCardContent>
	</MCard>
</template>

<script setup lang="ts">
import MCard from 'src/components/ui/Card/MCard.vue';
import MCardContent from 'src/components/ui/Card/MCardContent.vue';
import GameActionsItem from './GameActionsItem.vue';

const props = withDefaults(defineProps<{}>(), {});
</script>

<style lang="scss" scoped>
.q-list--dense > .q-item {
	padding-left: 0px !important;
	padding: 2px 8px !important;
}
</style>
