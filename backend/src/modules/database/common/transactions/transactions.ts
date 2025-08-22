export type AfterTransactionCommitCallback = () => void | Promise<void>;
export type AfterTransactionRollbackCallback = () => void | Promise<void>;

export abstract class DatabaseTransactions<T = unknown> {
	public abstract _: T;
	public abstract commit(): Promise<void>;
	public abstract rollback(): Promise<void>;
	public abstract afterCommit(fn: AfterTransactionCommitCallback): this;
	public abstract afterRollback(fn: AfterTransactionRollbackCallback): this;
}
