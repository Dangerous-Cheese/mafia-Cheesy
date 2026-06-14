// Shared attribute text helpers. Centralised so that wording stays consistent
// across roles that share the same trait (e.g. night immunity, self-vests).

export const RoleAttributeText = {
  NightImmune: 'Cannot be directly killed at night',
  DetectionImmune: 'Cannot be detected at night',
  RoleblockImmune: 'Cannot be Role-Blocked at night',
} as const;

/** Night immunity attribute, shared by any role that can start night-immune. */
export const nightImmuneAttribute = (immune: boolean): string[] =>
	immune ? [RoleAttributeText.NightImmune] : [];

/** Self-vest attribute(s), shared by Citizen and Survivor. */
export const vestAttributes = (maxVests: number): string[] => {
	if (maxVests <= 0) return [];
	const plural = maxVests === 1 ? 'vest' : 'vests';
	return [`${String(maxVests)} self-protection ${plural}`];
};

export const detectionImmuneAttribute = (detectable: boolean): string[] =>
	detectable ? [RoleAttributeText.DetectionImmune] : [];

export const roleblockImmunityAttribute = (roleblockImmunity: boolean): string[] =>
	roleblockImmunity ? [RoleAttributeText.RoleblockImmune] : [];
