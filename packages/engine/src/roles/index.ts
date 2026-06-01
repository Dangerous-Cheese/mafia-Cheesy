import type { ActorContext, ActorState } from './actor';
import { Bodyguard } from './bodyguard';
import { Citizen } from './citizen';
import { Doctor } from './doctor';
import { Godfather } from './godfather';
import { Mafioso } from './mafioso';
import type { RoleName, RoleSettings, RoleTag } from './role';
import { Survivor } from './survivor';

export {
	RoleAlignment,
	RoleAlignmentSchema,
	RoleNamesAndPriorityOrder,
	RoleNameSchema,
	RoleSettingsSchema,
	RoleTags,
	RoleTagSchema,
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

export const ROLE_TAGS_MAP: Record<RoleName, RoleTag[]> = RoleRegistry.map(roleClass => [roleClass.roleName, roleClass.tags]) as unknown as Record<RoleName, RoleTag[]>;