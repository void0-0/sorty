import { DynamicModule, Module, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@recursyve/nestjs-config";
import { DatabaseConfig } from "./common/config/database-config";
import { SequelizeDriverConfigService } from "./common/services/sequelize-driver-config.service";
import { DatabaseTransactionsFactory } from "./common/transactions/transaction-factory.service";
import { DatabaseBootstrapOptions } from "./common/types/bootstrap-options.type";

@Module({
	imports: []
})
export class DatabaseModule {
	public static forRoot(options: DatabaseBootstrapOptions): DynamicModule {
		const driverImports: (DynamicModule | Type)[] = [];

		if (options.driver === "sequelize") {
			driverImports.push(
				SequelizeModule.forRootAsync({
					imports: [ConfigModule.forFeature(DatabaseConfig)],
					useClass: SequelizeDriverConfigService
				})
			);
		}

		return {
			global: true,
			module: DatabaseModule,
			imports: [
				...driverImports
				// AccountsModule.withInfrastructure(options.driver),
			],
			providers: [
				{
					provide: DatabaseTransactionsFactory,
					useFactory: (moduleRef: ModuleRef) => new DatabaseTransactionsFactory(options.driver, moduleRef),
					inject: [ModuleRef]
				}
			],
			exports: [DatabaseTransactionsFactory]
		};
	}
}
