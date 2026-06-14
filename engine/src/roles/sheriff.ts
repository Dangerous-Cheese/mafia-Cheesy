import { z } from 'zod';
import { Town, type Actor, type ActorContext, type ActorState } from './actor';
import { RoleTags } from './role';
import { RoleAlignment } from './role';

export const SheriffSettingsSchema = z.object({}).strict();

export type SheriffSettings = z.infer<typeof SheriffSettingsSchema>;
export type SheriffSettingsInput = z.input<typeof SheriffSettingsSchema>;

export class Sheriff extends Town {
  static override tags = [
    ...super.tags,
    RoleTags.TownInvestigative,
  ] as const;

  static override roleName = 'Sheriff' as const;
  static override roleKey = 'sheriff' as const;

  static settingsSchema = SheriffSettingsSchema;
  static override description = 'A member of law enforcement, forced into hiding because of the threat of murder. ';
  static override abilities = [
    'Check one player each night for criminal activity.',
  ]
}

export function sheriffInvestigate(target: Actor): SheriffInvestigationResult {
  const alignment = target.alignment;
  const isDetectionImmune = target.detectionImmune == true;

  if (isDetectionImmune) {
    return {
      targetId: target.input.id,
      result: 'not_suspicious',
      message: 'Your target is not suspicious.',
    };
  }

  if (alignment === RoleAlignment.Mafia) {
    return {
      targetId: target.input.id,
      result: 'suspicious',
      message: 'Your target is a member of the Mafia.',
    };
  }

  const isNeutralEvil =
    target.tags.includes(RoleTags.NeutralEvil) ||
    target.tags.includes(RoleTags.NeutralKilling);

  if (isNeutralEvil) {
    return {
      targetId: target.input.id,
      result: 'suspicious',
      message: `Your target is a ${target.roleName}.`,
    };
  }

  return {
    targetId: target.input.id,
    result: 'not_suspicious',
    message: 'Your target is not suspicious.',
  };
}

export type SheriffInvestigationResult = {
  targetId: string;
  result: 'suspicious' | 'not_suspicious';
  message: string;
};
