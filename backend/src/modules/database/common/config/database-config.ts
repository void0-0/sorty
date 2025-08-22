import { Variable } from "@recursyve/nestjs-config";

export class DatabaseConfig {
	@Variable
	DB_HOST!: string;

	@Variable
	DB_NAME!: string;

	@Variable
	DB_USERNAME!: string;

	@Variable
	DB_PASSWORD!: string;

	@Variable
	DB_PORT!: string;
}
