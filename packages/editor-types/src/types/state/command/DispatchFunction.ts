import type { PmTransaction } from '../PmTransaction';

export type DispatchFunction = (transaction: PmTransaction) => void;
