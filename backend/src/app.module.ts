import { DynamicModule, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseBootstrapOptions } from "./modules/database/common/types/bootstrap-options.type";
import { DatabaseModule } from "./modules/database/database.module";

export type BootstrapOptions = Pick<DatabaseBootstrapOptions, "driver">;

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {
	public static register(options: BootstrapOptions): DynamicModule {
		return {
			module: AppModule,
			imports: [DatabaseModule.forRoot({ driver: options.driver })]
		};
	}
}
