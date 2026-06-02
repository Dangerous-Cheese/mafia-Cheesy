<template>
	<span style="cursor: default; user-select: none">
		<span v-for="(part, index) in tagDisplayParts" :key="index" :style="{ color: part.color }">
			{{ part.text }}
		</span>
	</span>
</template>

<script setup lang="ts">
import { ROLE_KEYS, ROLE_NAME_BY_KEY, RoleTags, type RoleKey, type TagLike } from '@mafia/sdk';
import { computed } from 'vue';

import { colorForAlignment, colorForRole, colorForTag } from 'src/util/colors';

type TagDisplayPart = {
	text: string;
	color?: string;
};

const props = withDefaults(
	defineProps<{
		tag: TagLike;
	}>(),
	{
		tag: RoleTags.AnyRandom,
	},
);
const toTitleCase = (value: string) => {
	return value
		.split('_')
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(' ');
};

const isRoleKey = (tag: string): tag is RoleKey => {
	return (ROLE_KEYS as readonly string[]).includes(tag);
};

const tagDisplayParts = computed<TagDisplayPart[]>(() => {
	const tag = props.tag;

	// Explicit role key, e.g. "serial_killer"
	// Whole label gets one role colour.
	if (isRoleKey(tag)) {
		return [
			{
				text: toTitleCase(tag),
				color: colorForRole(ROLE_NAME_BY_KEY[tag]),
			},
		];
	}

	// Faction/pool tags, e.g. "town_random", "mafia_killing"
	const [first, ...rest] = tag.split('_');

	if (first === 'town') {
		return [
			{ text: 'Town', color: colorForAlignment('Town') },
			{ text: ` ${toTitleCase(rest.join('_'))}` },
		];
	}

	if (first === 'mafia') {
		return [
			{ text: 'Mafia', color: colorForAlignment('Mafia') },
			{ text: ` ${toTitleCase(rest.join('_'))}` },
		];
	}

	if (first === 'neutral') {
		return [
			{ text: 'Neutral', color: colorForAlignment('Neutral') },
			{ text: ` ${toTitleCase(rest.join('_'))}` },
		];
	}

	// e.g. "any_random"
	return [
		{
			text: toTitleCase(tag),
			color: colorForTag(tag),
		},
	];
});
</script>
