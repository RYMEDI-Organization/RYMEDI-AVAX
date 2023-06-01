/**
Interface for the filter options used for fetching event logs.
@property fromBlock - (Optional) The block number to start fetching event logs from. Defaults to earliest block (0).
@property toBlock - (Optional) The block number to stop fetching event logs at. Defaults to latest block ("latest").
*/
export interface EventFilter {
    fromBlock?: number;
    toBlock?: number;
}
/**

Interface for an individual event log object.
@property event - The name of the event that triggered the log.
@property address - The address of the contract that emitted the event.
@property blockNumber - The block number in which the event was triggered.
@property transactionHash - The hash of the transaction that triggered the event.
@property transactionIndex - The index of the transaction within the block.
@property blockHash - The hash of the block in which the event was triggered.
@property logIndex - The index of the log within the block.
@property raw - The raw log object returned by the web3 API.
*/
export interface EventLog {
    event: string;
    address: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    logIndex: number;
    raw: Object;
}
