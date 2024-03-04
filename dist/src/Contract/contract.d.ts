import Web3 from "web3";
import EventFetcher from "./EventFetcher/eventFetcher";
import { AbiItem } from "web3-utils";
declare class SmartContract {
    private readonly contractAddress;
    private readonly web3;
    private readonly contract;
    private accounts;
    private transaction;
    private storeAbi;
    EventFetcher: EventFetcher;
    private readonly createSignedTx;
    private readonly sendSignedTx;
    constructor(contractAddress: string, abi: AbiItem | AbiItem[], privateKeys: string[], providerUrl: Web3);
    /**
     * Signs the transaction and sends the transaction.
     * @param {TransactionPayload} payload The object of the payload.
     * @param {string} signerPrivateKey The private key for signing transaction.
     * @returns The transaction hash of the submitted transaction.
     */
    private signTransaction;
    /**
     * Pushes data to the blockchain by invoking the smart contract function that writes a record.
     * The transaction is signed with the provided private key.
     * @param key The key of the record to write.
     * @param value The value of the record to write.
     * @returns The transaction hash of the submitted transaction.
     */
    pushRecord(key: string, value: string, options?: {
        nonce?: number;
    }): Promise<string>;
    /**
     * Pushes data in bulk to the blockchain by invoking the smart contract function that writes a record.
     * The transaction is signed with the provided private key.
     * @param keys The array of keys of the record to write.
     * @param values The array of values of the record to write.
     * @returns The transaction hash of the submitted transaction.
     */
    pushBulkRecord(keys: string[], values: string[], options?: {
        nonce?: number;
    }): Promise<string>;
    /**
     * Reads a record from the blockchain by invoking the smart contract function that reads a record.
     * @param key The key of the record to read.
     * @returns The value of the record as a string.
     */
    readRecord(key: string): Promise<string>;
    /**
     * Removes a record from the blockchain by invoking the smart contract function that removes the record.
     * @param key The key of the record to remove.
     * @returns The transaction hash of the submitted transaction.
     */
    removeRecord(key: string): Promise<string>;
    /**
     * Returns a count of records from the blockchain by invoking the smart contract function.
     * @param key The address of the new Contract.
     * @returns The value of the record as a object of string.
     */
    getRecordCount(): Promise<string>;
    /**
     * Returns the ABI which is used to initialize contract.
     * @returns The copy of ABI used.
     */
    getAbi(): Promise<AbiItem | AbiItem[]>;
    private getMaximumPrioriityFeeGas;
}
export default SmartContract;
