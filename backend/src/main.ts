import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle("Sorty API")
		.setDescription("API that powers the Sorty platform")
		.setVersion(process.env.VERSION ?? "")
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, documentFactory);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
