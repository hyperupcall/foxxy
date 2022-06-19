import { fs } from "../deps.ts";

import * as util from "../util/util.ts";
import * as types from "../types.ts";

export { module };
const module: types.FoxModule = {
	id: "license",
	name: "License",
	activateOn: {
		ecosystem: "any",
		form: "any",
	},
	triggers: {
		async onInitial(opts: types.foxLintArgs, notices: types.Notice[]) {
			// TODO: ensure it is one of the licenses approved by me for meeeee~
			if (await fs.exists("LICENSE.md")) return;

			// TODO: logging
			try {
				await Deno.rename("license.md", "LICENSE.md");
			} catch (unknownError: unknown) {
				const err = util.assertInstanceOfError(unknownError);

				if (!(err instanceof Deno.errors.NotFound)) {
					throw err;
				}
			}
		},
	},
};
