export const capitalize = (s: string): string => {
	return s && s[0].toUpperCase() + s.slice(1);
};

export const parseServiceType = (s: string): string => {
	s = s.replace('_', ' ').toLowerCase();
	s = s.split(' ').map(capitalize).join(' ');
	return s;
};
