import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Sequelize } from "sequelize-typescript";
import type { DriverOptionsType } from "../types/driver-options.type";
import { SequelizeDatabaseTransactions } from "./sequelize-transactions";
import { DatabaseTransactions } from "./transactions";

export type DatabaseTransactionOptions = {
	transaction?: DatabaseTransactions;
	useSavePoints?: boolean;
};

@Injectable()
export class DatabaseTransactionsFactory {
	constructor(
		private readonly driver: DriverOptionsType,
		private readonly moduleRef: ModuleRef
	) {}

	public spawn<T>(
		options: DatabaseTransactionOptions,
		autoCallback: (t: DatabaseTransactions) => PromiseLike<T>
	): Promise<T>;
	public spawn<T>(autoCallback: (t: DatabaseTransactions) => PromiseLike<T>): Promise<T>;
	public spawn(options?: DatabaseTransactionOptions): Promise<DatabaseTransactions>;
	public async spawn<T>(
		optionsOrAutoCallback?: DatabaseTransactionOptions | ((t: DatabaseTransactions) => PromiseLike<T>),
		_autoCallback?: (t: DatabaseTransactions) => PromiseLike<T>
	): Promise<T | DatabaseTransactions> {
		switch (this.driver) {
			case "_":
				throw new Error(`${this.driver} not supported`);
			case "sequelize":
				return this.spawnSequelize(optionsOrAutoCallback, _autoCallback);
		}
	}

	public async spawnSequelize<T>(
		optionsOrAutoCallback?: DatabaseTransactionOptions | ((t: DatabaseTransactions) => PromiseLike<T>),
		_autoCallback?: (t: DatabaseTransactions) => PromiseLike<T>
	): Promise<T | DatabaseTransactions> {
		let options: DatabaseTransactionOptions = {};
		let autoCallback: ((t: DatabaseTransactions) => PromiseLike<T>) | null = null;

		if (_autoCallback) {
			autoCallback = _autoCallback;
			options = optionsOrAutoCallback as DatabaseTransactionOptions;
		}

		if (optionsOrAutoCallback instanceof Function) {
			autoCallback = optionsOrAutoCallback as (t: DatabaseTransactions) => PromiseLike<T>;
		} else if (optionsOrAutoCallback) {
			options = optionsOrAutoCallback;
		}

		if (options.transaction && !options.useSavePoints) {
			if (!autoCallback) {
				return options.transaction;
			}

			return await autoCallback(options.transaction);
		}

		const sequelize = this.moduleRef.get(Sequelize, { strict: false });
		const sequelizeTransaction = await sequelize.transaction();
		const transaction = new SequelizeDatabaseTransactions(sequelizeTransaction);
		if (!autoCallback) {
			return transaction;
		}

		try {
			const result = await autoCallback(transaction);
			await transaction.commit();

			return result;
		} catch (error) {
			await transaction.rollback();

			throw error;
		}
	}
}
