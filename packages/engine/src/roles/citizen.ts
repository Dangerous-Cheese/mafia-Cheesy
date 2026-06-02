import { z } from 'zod';
import { Town, type Actor, type ActorContext, type ActorState } from './actor';
import { vestAttributes } from './attributes';
import { RoleTags } from './role';

export const CitizenSettingsSchema = z.object({
	maxVests: z.number().int().min(0).default(2),
});

export type CitizenSettings = z.infer<typeof CitizenSettingsSchema>;
export type CitizenSettingsInput = z.input<typeof CitizenSettingsSchema>;

export class Citizen extends Town {
	static override tags = [
		...super.tags,
		RoleTags.TownGovernment,
	] as const;

	static override roleName = 'Citizen' as const;
	static override roleKey = 'citizen' as const;

	static settingsSchema = CitizenSettingsSchema;
	static override description = 'Town role with limited self-protection vests.';

	static override attributes(settings: CitizenSettingsInput = {}): string[] {
		const parsed = CitizenSettingsSchema.parse(settings);
		return ['Wins ties', ...vestAttributes(parsed.maxVests)];
	}

	private remainingVests = 0;

	constructor(
		input: ActorState,
		settings: CitizenSettingsInput = {},
		context: ActorContext,
	) {
		super(input, context);
		const parsed = CitizenSettingsSchema.parse(settings);
		const fromActions = input.roleActions?.remainingVests;
		this.remainingVests =
			typeof fromActions === 'number' ? fromActions : parsed.maxVests;
	}

	override dumpState() {
		return {
			...super.dumpState(),
			roleActions: { remainingVests: this.remainingVests },
		};
	}

	// override checkForWin(actors: Actor[]) {
	// 	const factionWin = super.checkForWin(actors);
	// 	if (factionWin) return true;

	// 	return false;
	// }

	override findPossibleTargets(_actors: Actor[] = []) {
		this.possibleTargets = [];
		if (this.remainingVests > 0) {
			this.possibleTargets = [[this]];
		}
		return this.possibleTargets;
	}

	override action() {
		if (this.remainingVests <= 0) {
			this.logger.critical(`${this.toString()} tried to use vest but has 0 remaining`);
			return;
		}
		this.remainingVests -= 1;
		const target = this.targets[0];
		if (!target) return;
		target.nightImmune = true;
		this.logger.info(
			`${this.toString()} used vest on ${target === this ? 'self' : target.toString()}. ${String(this.remainingVests)} remaining`,
		);
	}
}
