import { AbiItem } from "web3-utils";
import { Accounts } from "./src/Account/Account";
import Ledger from "./src/Ledger/Ledger";
import SmartContract from "./src/Contract/contract";
import { AccessControl } from "./src/AccessControl/accessControl";
export declare class BlockchainClient {
    private web3;
    private privateKeys;
    private abi;
    private contractAddress;
    Account: Accounts;
    Ledger: Ledger;
    Contract: SmartContract;
    AccessControl: AccessControl;
    constructor(providedUrl: string, privateKeys: string[], contractAddress: string, abi?: AbiItem | AbiItem[]);
    /**
     * Creates a new instance of the Accounts class for managing Ethereum accounts
     *
     * @returns {Accounts} - An instance of the Accounts class
     */
    private accounts;
    /**
     * Creates a new instance of the Transaction class for managing Ethereum accounts
     *
     * @returns {Ledger} - An instance of the Ledger class
     */
    private ledger;
    private contract;
    /**
     * Creates a new instance of the AccessControl class for managing Ethereum accounts
     *
     * @returns {AccessControl} - An instance of the AccessControl class
     */
    private access;
}
