<template>
	<MCard class="column full-height">
		<MCardHeader
			:title="meta?.name ?? 'Unknown Role'"
			:subtitle="meta?.description"
			:separated="false"
			:title-color="colorForRole(props.roleName)"
		/>
		<MCardContent class="col column q-gutter-y-md q-mt-none">
			<template v-if="meta">
				<div v-if="meta.goal" class="q-gutter-y-xs">
					<div class="text-caption text-uppercase text-grey-5">Goal</div>
					<div class="text-body2">{{ meta.goal }}</div>
				</div>

				<div v-if="meta.abilities.length" class="q-gutter-y-xs">
					<div class="text-caption text-uppercase text-grey-5">Abilities</div>
					<ul class="q-my-none q-pl-md text-body2">
						<li v-for="ability in meta.abilities" :key="ability">{{ ability }}</li>
					</ul>
				</div>

				<div v-if="attributes.length" class="q-gutter-y-xs">
					<div class="text-caption text-uppercase text-grey-5">Attributes</div>
					<div class="row q-gutter-xs">
						<QChip
							v-for="attribute in attributes"
							:key="attribute"
							dense
							color="primary"
							text-color="white"
							:label="attribute"
						/>
					</div>
				</div>

				<div v-if="hasSettings" class="q-gutter-y-xs">
					<div class="text-caption text-uppercase text-grey-5">Settings</div>
					<div v-for="(value, key) in settings" :key="key" class="text-body2">
						<span class="text-grey-4">{{ key }}:</span> {{ value }}
					</div>
				</div>

				<div v-if="meta.tags.length" class="col-grow column justify-end">
					<div class="row q-gutter-xs q-mt-sm">
						<QChip
							v-for="tag in meta.tags"
							:key="tag"
							dense
							color="grey-8"
							text-color="white"
							:label="tag"
						/>
					</div>
				</div>
			</template>
		</MCardContent>
	</MCard>
</template>

<script setup lang="ts">
import { getRoleAttributes, ROLE_INFO, type RoleName, type RoleSettings } from '@mafia/sdk';
import { QChip } from 'quasar';
import { MCard, MCardContent, MCardHeader } from 'src/components/ui/Card';
import { colorForRole } from 'src/util/colors';
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		roleName: RoleName;
		settings?: RoleSettings['settings'];
	}>(),
	{
		settings: () => ({}),
	},
);

const meta = computed(() => ROLE_INFO[props.roleName]);
const attributes = computed(() => getRoleAttributes(props.roleName, props.settings ?? {}));
const hasSettings = computed(() => Object.keys(props.settings ?? {}).length > 0);
</script>
