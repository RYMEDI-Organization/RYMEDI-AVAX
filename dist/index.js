"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainClient = void 0;
const web3_1 = __importDefault(require("web3"));
const Account_1 = require("./src/Account/Account");
const Ledger_1 = __importDefault(require("./src/Ledger/Ledger"));
const contract_1 = __importDefault(require("./src/Contract/contract"));
const accessControl_1 = require("./src/AccessControl/accessControl");
const abi_1 = require("./abi");
class BlockchainClient {
    constructor(providedUrl, privateKeys, contractAddress, abi) {
        this.abi = abi ? abi : abi_1.ABI;
        this.web3 = new web3_1.default(providedUrl);
        this.privateKeys = privateKeys;
        this.contractAddress = contractAddress;
        this.Account = this.accounts();
        this.Contract = this.contract();
        this.Ledger = this.ledger();
        this.AccessControl = this.access();
    }
    /**
     * Creates a new instance of the Accounts class for managing Ethereum accounts
     *
     * @returns {Accounts} - An instance of the Accounts class
     */
    accounts() {
        return new Account_1.Accounts(this.web3, this.privateKeys);
    }
    /**
     * Creates a new instance of the Transaction class for managing Ethereum accounts
     *
     * @returns {Ledger} - An instance of the Ledger class
     */
    ledger() {
        return new Ledger_1.default(this.web3, this.privateKeys);
    }
    contract() {
        return new contract_1.default(this.contractAddress, this.abi, this.privateKeys, this.web3);
    }
    /**
     * Creates a new instance of the AccessControl class for managing Ethereum accounts
     *
     * @returns {AccessControl} - An instance of the AccessControl class
     */
    access() {
        return new accessControl_1.AccessControl(this.web3, this.Contract, this.abi, this.contractAddress);
    }
}
exports.BlockchainClient = BlockchainClient;
