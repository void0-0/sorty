import { Transaction } from "sequelize";
import { AfterTransactionRollbackCallback, DatabaseTransactions } from "./transactions";

export class SequelizeDatabaseTransactions extends DatabaseTransactions<Transaction> {
	private readonly _afterRollbackHooks: Set<AfterTransactionRollbackCallback>;

	public get _(): Transaction {
		return this.transaction;
	}

	constructor(private readonly transaction: Transaction) {
		super();

		this._afterRollbackHooks = new Set();
	}

	public override async commit(): Promise<void> {
		await this.transaction.commit();
	}

	public override async rollback(): Promise<void> {
		/* eslint-disable */
		try {
			if (!(this.transaction as any).finished) {
				await this.transaction.rollback();
			} else {
				// release the connection, even if we don't need to rollback
				await (this.transaction as any).cleanup();
			}
		} catch (_) {}
		/* eslint-enable */

		/** Pretty much a copy and paste of the afterCommit of the original Transaction of Sequelize */
		for (const hook of this._afterRollbackHooks) {
			await Reflect.apply(hook, this, []);
		}
	}

	public afterCommit(fn: () => void | Promise<void>): this {
		this.transaction.afterCommit(async () => fn());
		return this;
	}

	public afterRollback(fn: () => void | Promise<void>): this {
		if (typeof fn !== "function") {
			throw new TypeError('"fn" must be a function');
		}

		this._afterRollbackHooks.add(fn);

		return this;
	}
}
