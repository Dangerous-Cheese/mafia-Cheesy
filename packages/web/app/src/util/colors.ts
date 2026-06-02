import { ROLE_ALIGNMENT_MAP, type RoleAlignment, type RoleName } from "@mafia/sdk";

export const colorForAlignment = (alignment: RoleAlignment) => {
	switch (alignment) {
		case 'Town':
			return '#00ff00';
		case 'Mafia':
			return '#ff0000';
		case 'Neutral':
			return '#f5deb3';
		// case 'Cult':
		// 	return '#8000ff';
		default:
			return '#00bfff';
	}
}


export const colorForRole = (roleName: RoleName) => {
	const alignment = ROLE_ALIGNMENT_MAP[roleName];
	if (alignment !== "Neutral") {
		return colorForAlignment(alignment);
	}

	switch (roleName) {
		case 'Survivor':
			return '#f5deb3';
		// case 'Serial Killer':
		// 	return '#8000ff';
		default:
	}
	return colorForAlignment(alignment);
};