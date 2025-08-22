import { ConsoleLogger } from "@nestjs/common";

export class SortyLogger extends ConsoleLogger {
	constructor(context?: string) {
		super({
			context,
			json: true,
			compact: true,
			colors: process.env.LOGGER_DISABLE_COLORS !== "true"
		});
	}
}
