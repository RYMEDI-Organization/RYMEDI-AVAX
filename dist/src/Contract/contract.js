"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("../Account/Account");
const Ledger_1 = __importDefault(require("../Ledger/Ledger"));
const eventFetcher_1 = __importDefault(require("./EventFetcher/eventFetcher"));
class SmartContract {
    constructor(contractAddress, abi, privateKeys, providerUrl) {
        this.contractAddress = contractAddress;
        this.web3 = providerUrl;
        this.contract = new this.web3.eth.Contract(abi, contractAddress);
        this.accounts = new Account_1.Accounts(providerUrl, privateKeys);
        this.transaction = new Ledger_1.default(providerUrl, privateKeys);
        this.EventFetcher = new eventFetcher_1.default(this.contract);
        this.createSignedTx = this.transaction["createSignedTransaction"];
        this.sendSignedTx = this.transaction["sendSignedTransaction"];
        this.storeAbi = abi;
    }
    /**
     * Signs the transaction and sends the transaction.
     * @param {TransactionPayload} payload The object of the payload.
     * @param {string} signerPrivateKey The private key for signing transaction.
     * @returns The transaction hash of the submitted transaction.
     */
    signTransaction(payload, signerPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            //estimating the gasLimit of keys and values we passed in Bulk Records
            try {
                const signedTx = yield this.createSignedTx.call(this.transaction, payload, signerPrivateKey);
                const txReceipt = yield this.sendSignedTx.call(this.transaction, signedTx.rawTransaction);
                return txReceipt.transactionHash;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Pushes data to the blockchain by invoking the smart contract function that writes a record.
     * The transaction is signed with the provided private key.
     * @param key The key of the record to write.
     * @param value The value of the record to write.
     * @returns The transaction hash of the submitted transaction.
     */
    pushRecord(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signerPrivateKey = this.accounts["returnPrivateKey"].call(this.accounts);
                const address = this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
                const isSender = yield this.contract.methods.isSender(address).call();
                if (isSender) {
                    const data = yield this.contract.methods.addRecord(key, value);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const gasLimit = yield data.estimateGas({
                        from: address,
                    });
                    const tx = {
                        from: address,
                        to: this.contractAddress,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                    };
                    const txhash = yield this.signTransaction(tx, signerPrivateKey);
                    return txhash;
                }
                return "";
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Pushes data in bulk to the blockchain by invoking the smart contract function that writes a record.
     * The transaction is signed with the provided private key.
     * @param keys The array of keys of the record to write.
     * @param values The array of values of the record to write.
     * @returns The transaction hash of the submitted transaction.
     */
    pushBulkRecord(keys, values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signerPrivateKey = this.accounts["returnPrivateKey"].call(this.accounts);
                const address = this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
                const isSender = yield this.contract.methods.isSender(address).call();
                if (isSender) {
                    const data = yield this.contract.methods.addBulkRecords(keys, values);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const gasLimit = yield data.estimateGas({
                        from: address,
                    });
                    const tx = {
                        from: address,
                        to: this.contractAddress,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                    };
                    const txhash = yield this.signTransaction(tx, signerPrivateKey);
                    return txhash;
                }
                return "";
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Reads a record from the blockchain by invoking the smart contract function that reads a record.
     * @param key The key of the record to read.
     * @returns The value of the record as a string.
     */
    readRecord(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.contract.methods.getRecord(key).call();
                if (result != '0x0000000000000000000000000000000000000000000000000000000000000000') {
                    return result;
                }
                return "";
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Removes a record from the blockchain by invoking the smart contract function that removes the record.
     * @param key The key of the record to remove.
     * @returns The transaction hash of the submitted transaction.
     */
    removeRecord(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signerPrivateKey = this.accounts["returnPrivateKey"].call(this.accounts);
                const address = this.web3.eth.accounts.privateKeyToAccount(signerPrivateKey).address;
                const isAdmin = yield this.contract.methods.isAdmin(address).call();
                if (isAdmin) {
                    const data = this.contract.methods.removeRecord(key);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const gasLimit = yield data.estimateGas({
                        from: address,
                    });
                    const tx = {
                        from: address,
                        to: this.contractAddress,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                    };
                    const txhash = yield this.signTransaction(tx, signerPrivateKey);
                    return txhash;
                }
                return "";
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Returns a count of records from the blockchain by invoking the smart contract function.
     * @param key The address of the new Contract.
     * @returns The value of the record as a object of string.
     */
    getRecordCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.contract.methods.recordCount().call();
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Returns the ABI which is used to initialize contract.
     * @returns The copy of ABI used.
     */
    getAbi() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storeAbi;
        });
    }
}
exports.default = SmartContract;
