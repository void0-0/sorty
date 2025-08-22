import { Injectable } from "@nestjs/common";
import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";
import { InjectConfig } from "@recursyve/nestjs-config";
import SequelizeBase from "sequelize";
import wkx from "wkx";
import { SortyLogger } from "../../../../logger";
import { GlobalConfig } from "../../../config/global.config";
import { DatabaseConfig } from "../config/database-config";

/**
 * Fix for MySql v8+
 * GeomFromText doesn't exist anymore, it has been replace by ST_GeomFromText
 * https://github.com/sequelize/sequelize/issues/9786#issuecomment-474122602
 */

/* eslint-disable */
SequelizeBase.GEOMETRY.prototype._stringify = function _stringify(value: any, options: any) {
	return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
};
SequelizeBase.GEOMETRY.prototype._bindParam = function _bindParam(value: any, options: any) {
	return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
};
SequelizeBase.GEOGRAPHY.prototype._stringify = function _stringify(value: any, options: any) {
	return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
};
SequelizeBase.GEOGRAPHY.prototype._bindParam = function _bindParam(value: any, options: any) {
	return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
};
/* eslint-enable */

/**
 * End: Fix for MySql v8+
 */

@Injectable()
export class SequelizeDriverConfigService implements SequelizeOptionsFactory {
	private readonly logger = new SortyLogger();

	constructor(
		@InjectConfig(GlobalConfig) private readonly globalConfig: GlobalConfig,
		@InjectConfig(DatabaseConfig) private readonly config: DatabaseConfig
	) {}

	public createSequelizeOptions(): SequelizeModuleOptions {
		return {
			autoLoadModels: true,
			synchronize: false,
			dialect: "mysql",
			host: this.config.DB_HOST,
			port: +this.config.DB_PORT,
			username: this.config.DB_USERNAME,
			password: this.config.DB_PASSWORD,
			database: this.config.DB_NAME,
			logging: this.globalConfig.isProduction ? false : (log) => this.logger.verbose(log),
			define: {
				timestamps: true,
				paranoid: true,
				underscored: true,
				updatedAt: "updated_at",
				createdAt: "created_at",
				deletedAt: "deleted_at",
				defaultScope: {
					attributes: {
						exclude: ["updated_at", "created_at", "deleted_at"]
					}
				}
			},
			pool: {
				min: 0,
				max: 1000,
				idle: 10000,
				acquire: 10000
			}
		};
	}
}
