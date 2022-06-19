// MIT: https://github.com/grian32/gini
// TODO: make complete

// the user facing ini object
interface UserINIObject {
	parse(str: string): object;
	stringify(obj: object): string;
}

// internal ini variable object, its what is used for vars
interface INIVariableObject {
	[name: string]: number | string | boolean | null;
}

// internal INI object, its what parseFunc() parses to.
interface INIObject {
	[section: string]: INIVariableObject;
}

function convertVariable(str: string): number | string | boolean | null {
	if (str.match(/\'.+\'/gi) || str.match(/\".+\"/gi)) {
		return str.slice(1, str.length - 1);
	} else if (str === "false") {
		return false;
	} else if (str === "true") {
		return true;
	} else if (str === "null") {
		return null;
	} else if (
		!Number.isNaN(str) ||
		Number(str) != undefined ||
		Number(str) != null
	) {
		return Number(str);
	} else {
		return null;
	}
}

function parseFunc(str: string): INIObject {
	let obj: INIObject = {};
	let lines = str.split("\n").filter((i) => i != "" && !i.startsWith(";"));
	let reachedBlockName = "";

	for (let i of lines) {
		if (i.match(/\[.+\]/gi)) {
			reachedBlockName = i.slice(1, i.length - 1);
			obj[reachedBlockName] = {};
		} else {
			let variable = i.split("=").map((i) => i.trim());
			obj[reachedBlockName][variable[0]] = convertVariable(variable[1]);
		}
	}

	return obj;
}

function stringifyFunc(obj: INIObject): string {
	let str = "";

	for (let i in obj) {
		str += `[${i}]\n`;
		for (let j in obj[i]) {
			let variable = [j, obj[i][j]];
			if (typeof variable[1] === "string") {
				str += `${variable[0]}="${variable[1]}"\n`;
			} else {
				str += `${variable[0]}=${variable[1]}\n`;
			}
		}
	}

	return str;
}

const module: types.FoxModule = {
	parse: parseFunc,
	stringify: stringifyFunc,
} as UserINIObject;
