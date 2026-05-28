import { z } from 'zod';
import { MAX_ACTORS } from './constants';
import type { GameEventGroupDump } from './events';
import { ActorStateSchema, type ActorState } from './roles/actor';
import { RoleAlignmentSchema, RoleNameSchema, RoleSettingsSchema, RoleTagSchema } from './roles/role';

// ---------------------------------------------------------------------------
// Game config
// ---------------------------------------------------------------------------

export const GameConfigSchema = z.object({
	tags: z.array(RoleTagSchema),
	settings: z.record(z.string(), z.unknown()).default({}),
	/**
	 * Role keys are constrained to {@link RoleNameSchema} so the inferred type
	 * is `Partial<Record<RoleName, RoleSettings>>` without resorting to a refine
	 * predicate cast. Unknown role keys are rejected at parse time; missing
	 * known role keys are permitted (use {@link z.partialRecord} so callers
	 * supply only the roles they configure).
	 */
	roles: z.partialRecord(RoleNameSchema, RoleSettingsSchema),
});

export type GameConfig = z.infer<typeof GameConfigSchema>;


// ---------------------------------------------------------------------------
// State sub-types
// ---------------------------------------------------------------------------

export const StateActorSchema = z.object({
	number: z.number().int().min(1).max(MAX_ACTORS),
	alias: z.string(),
	alive: z.boolean(),
});

export type StateActor = z.infer<typeof StateActorSchema>;

export const StateGraveyardRecordSchema = z.object({
	number: z.number().int().min(1).max(MAX_ACTORS),
	alias: z.string(),
	cod: z.string(),
	dod: z.number().int().min(0),
	role: RoleNameSchema,
	will: z.string().default(''),
	alignment: RoleAlignmentSchema,
});

export type StateGraveyardRecord = z.infer<typeof StateGraveyardRecordSchema>;

export const GameStateSchema = z.object({
	day: z.number().int().min(0).default(0),
	actors: z.array(StateActorSchema).default([]),
	graveyard: z.array(StateGraveyardRecordSchema).default([]),
});

export type GameState = z.infer<typeof GameStateSchema>;

// ---------------------------------------------------------------------------
// Engine I/O
// ---------------------------------------------------------------------------

export const EngineOptionsSchema = z
	.object({
		seed: z.number().int().optional(),
	})
	.default({});

export type EngineOptions = z.infer<typeof EngineOptionsSchema>;

export const EngineInputSchema = z.object({
	actors: z.array(ActorStateSchema),
	config: GameConfigSchema,
	state: GameStateSchema.optional(),
	options: EngineOptionsSchema.optional(),
});

export type EngineInput = z.infer<typeof EngineInputSchema>;

export const WinnerSummarySchema = z.object({
	id: z.string(),
	name: z.string(),
	alias: z.string(),
	number: z.number().int().min(1).max(MAX_ACTORS),
	role: RoleNameSchema,
	alignment: RoleAlignmentSchema,
});

export type WinnerSummary = z.infer<typeof WinnerSummarySchema>;

export type EngineResult = {
	state: GameState;
	actors: ActorState[];
	events: GameEventGroupDump;
	winners: WinnerSummary[] | null;
	log: string[];
};
