import { Variable } from "@recursyve/nestjs-config";
import packageJson from "../../../package.json";

export class GlobalConfig {
	@Variable
	ENVIRONMENT!: string;

	@Variable(false)
	VERSION?: string;

	public get isProduction(): boolean {
		return this.ENVIRONMENT.toLowerCase() === "production";
	}

	public get isDev(): boolean {
		return this.ENVIRONMENT.toLowerCase() === "development";
	}

	public get isStaging(): boolean {
		return this.ENVIRONMENT.toLowerCase() === "staging";
	}

	public get mode(): string {
		return this.ENVIRONMENT;
	}

	public get version(): string {
		return this.VERSION ?? packageJson.version;
	}
}
