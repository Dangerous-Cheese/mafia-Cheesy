import { z } from 'zod';
import { MAX_ACTORS } from '../constants';

// The order here matters, this is the order that actions will be resolved in (e.g. citizen will vest before mafia shoots, doctor will heal after mafia shoots, etc.)
export const RoleNamesAndPriorityOrder = [
	// Town Roles
	'Citizen',
	'Bodyguard',
	'Doctor',

	// Mafia Roles
	'Godfather',
	'Mafioso',

	// Neutral Roles
	'Survivor',
] as const;
export type RoleName = (typeof RoleNamesAndPriorityOrder)[number];

export const RoleNameSchema = z.enum(RoleNamesAndPriorityOrder);

// Alignment
export const RoleAlignment = ['Town', 'Mafia', 'Neutral'] as const;
export type RoleAlignment = (typeof RoleAlignment)[number];

export const RoleAlignmentSchema = z.enum(RoleAlignment);

// Tags
export const RoleTags = {
	AnyRandom: 'any_random',

	// Town
	TownRandom: 'town_random',
	TownGovernment: 'town_government',
	TownProtective: 'town_protective',
	TownKilling: 'town_killing',
	TownPower: 'town_power',
	TownInvestigative: 'town_investigative',
	TownSupport: 'town_support',

	// Mafia
	MafiaRandom: 'mafia_random',
	MafiaKilling: 'mafia_killing',
	MafiaSupport: 'mafia_support',
	MafiaDeception: 'mafia_deception',


	// Neutrals
	NeutralRandom: 'neutral_random',
	NeutralKilling: 'neutral_killing',
	NeutralEvil: 'neutral_evil',
	NeutralBenign: 'neutral_benign',
} as const;

export type RoleTag = (typeof RoleTags)[keyof typeof RoleTags];

// export type RoleTag = RolePoolTag | RoleIdentityTag;

export const ROLE_TAGS = Object.values(RoleTags) as RoleTag[];

const asNonEmptyTuple = <T extends string>(values: T[]) => values as [T, ...T[]];

// Pool tags only (e.g. "town_random"). Role-key tags and the combined
// RoleTagSchema live in ./index, where the role registry (the canonical source
// of role keys) is available without a circular import.
export const RolePoolTagSchema = z.enum(asNonEmptyTuple(ROLE_TAGS));

// Allies
export const RoleAllySchema = z.object({
	number: z.number().int().min(1).max(MAX_ACTORS),
	alias: z.string(),
	role: RoleNameSchema,
	alive: z.boolean(),
});

export type RoleAlly = z.infer<typeof RoleAllySchema>;

// Role settings
export const RoleSettingsSchema = z.object({
	max: z.number().int().min(0),
	weight: z.number().min(0),
	settings: z.record(z.string(), z.unknown()).default({}),
});

export type RoleSettings = z.infer<typeof RoleSettingsSchema>;