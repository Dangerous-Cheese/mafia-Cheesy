import { ROLE_INFO, type RoleAlignment, type RoleName, type TagLike } from "@mafia/sdk";

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
	const alignment = ROLE_INFO[roleName].alignment;
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

export const colorForTag = (tag: TagLike) => {
	if (tag.includes('town')) {
		return colorForAlignment('Town');
	} else if (tag.includes('mafia')) {
		return colorForAlignment('Mafia');
	} else if (tag.includes('neutral')) {
		return colorForAlignment('Neutral');
	} else {
		return '#00bfff';
	}
}

export const getCssVar = (name: string) => {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
};

/** Useful I guess by not currently used anywhere so commenting it out */
// const cssColorToRgb = (color: string): [number, number, number] | null => {
// 	const el = document.createElement('div');
// 	el.style.color = color;
// 	document.body.appendChild(el);

// 	const computed = getComputedStyle(el).color;
// 	document.body.removeChild(el);

// 	const match = computed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

// 	if (!match) return null;

// 	return [
// 		Number(match[1]),
// 		Number(match[2]),
// 		Number(match[3]),
// 	];
// };

// const relativeLuminance = ([r, g, b]: [number, number, number]) => {
// 	const normalize = (value: number) => {
// 		const channel = value / 255;

// 		return channel <= 0.03928
// 			? channel / 12.92
// 			: Math.pow((channel + 0.055) / 1.055, 2.4);
// 	};

// 	const [rs, gs, bs] = [normalize(r), normalize(g), normalize(b)];

// 	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
// };

// const contrastRatio = (a: number, b: number) => {
// 	const lighter = Math.max(a, b);
// 	const darker = Math.min(a, b);

// 	return (lighter + 0.05) / (darker + 0.05);
// };

// export const getReadableTextColor = (backgroundColor: string) => {
// 	const rgb = cssColorToRgb(backgroundColor);

// 	if (!rgb) return '#ffffff';

// 	const bgLuminance = relativeLuminance(rgb);

// 	const whiteContrast = contrastRatio(bgLuminance, 1);
// 	const blackContrast = contrastRatio(bgLuminance, 0);

// 	return whiteContrast >= blackContrast ? '#ffffff' : '#000000';
// };