import { z } from 'zod';
import type { ActorContext, ActorState } from './actor';
import { Bodyguard } from './bodyguard';
import { Citizen } from './citizen';
import { Doctor } from './doctor';
import { Godfather } from './godfather';
import { Mafioso } from './mafioso';
import { RolePoolTagSchema, type RoleName, type RoleSettings, type RoleTag } from './role';
import { Survivor } from './survivor';

export {
	RoleAlignment,
	RoleAlignmentSchema,
	RoleNamesAndPriorityOrder,
	RoleNameSchema,
	RolePoolTagSchema,
	RoleSettingsSchema,
	RoleTags,
	ROLE_TAGS,
	type RoleName,
	type RoleSettings,
	type RoleTag
} from './role';

export { ActorStateSchema, type ActorState } from './actor';

export const RoleRegistry = [
	// Town Roles
	Citizen,
	Bodyguard,
	Doctor,

	// Mafia Roles
	Godfather,
	Mafioso,

	// Neutral Roles
	Survivor,
] as const;

export type RoleClass = (typeof RoleRegistry)[number];

export type RoleInstance = InstanceType<RoleClass>;

// A role key is the canonical identifier declared on each role class (e.g.
// "citizen", "serial_killer"). Derived from the registry, not from role names.
export type RoleKey = RoleClass['roleKey'];

const asNonEmptyTuple = <T extends string>(values: T[]) => values as [T, ...T[]];

// Every role's declared key, e.g. ["citizen", "bodyguard", ...].
export const ROLE_KEYS = RoleRegistry.map((RoleClass) => RoleClass.roleKey);

// role name -> role key lookup (canonical, from class metadata).
export const ROLE_KEY_BY_NAME = RoleRegistry.reduce(
	(acc, RoleClass) => {
		acc[RoleClass.roleName] = RoleClass.roleKey;
		return acc;
	},
	{} as Record<RoleName, RoleKey>,
);

export const RoleKeySchema = z.enum(asNonEmptyTuple(ROLE_KEYS));

// A tag is either a pool tag (e.g. "town_random") or a role key (e.g. "citizen").
export const RoleTagSchema = z.union([RolePoolTagSchema, RoleKeySchema]);

// Widened tag type usable in game config: pool tag or direct role key.
export type RoleSelectionTag = RoleTag | RoleKey;

type DynamicRoleConstructor = new (
	input: ActorState,
	settings: RoleSettings['settings'],
	context: ActorContext,
) => RoleInstance;

const RoleClassesByName = RoleRegistry.reduce(
	(acc, RoleClass) => {
		acc[RoleClass.roleName] = RoleClass;
		return acc;
	},
	{} as Partial<Record<RoleName, RoleClass>>,
);

export const getRoleClass = (name: RoleName): RoleClass => {
	const RoleClass = RoleClassesByName[name];

	if (!RoleClass) {
		throw new Error(`Role class not found for role name: ${name}`);
	}

	return RoleClass;
};

export const instantiateRole = (
	name: RoleName,
	input: ActorState,
	settings: RoleSettings['settings'],
	context: ActorContext,
): RoleInstance => {
	const RoleClass = getRoleClass(name) as unknown as DynamicRoleConstructor;

	return new RoleClass(input, settings, context);
};

// Helper constants for use by consumers

// Fallback role to use when a role cannot be instantiated for some reason (e.g. invalid role name)
export const FALLBACK_ROLE: RoleName = 'Citizen';

// Map each role name to its static tag list.
export const ROLE_TAGS_MAP = RoleRegistry.reduce(
	(acc, RoleClass) => {
		acc[RoleClass.roleName] = RoleClass.tags;
		return acc;
	},
	{} as Record<RoleName, readonly RoleTag[]>
);