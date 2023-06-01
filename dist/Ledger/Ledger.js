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
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("../Account/Account");
/**
 * Class representing a Transaction
 */
class Ledger {
    /**
     * @param {string} providerUrl - The web3 provider URL
     * @param {string} privateKeys - The default private key to sign the transactions
     */
    constructor(web3, privateKeys) {
        this.web3 = web3;
        this.accounts = new Account_1.Accounts(this.web3, privateKeys);
        this.getNonce = this.accounts["getNonce"];
        this.currentAddress = "";
    }
    /**
     * Get transaction details/status from blockchain for any provided transaction ID
     * @param {string} transactionId - The transaction ID
     * @returns {Promise<TransactionDetails>} - The transaction object
     */
    fetchTransactionDetails(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.web3.eth.getTransaction(transactionId);
                if (!transaction) {
                    throw new Error(`Transaction details for ${transactionId} not found`);
                }
                return transaction;
            }
            catch (error) {
                throw new Error(`Failed to fetch transaction details: ${error.message}`);
            }
        });
    }
    /**
     * Get block number from blockchain for any provided transaction ID/hash
     * @param {string} transactionHash - The transaction IDs
     * @returns {Promise<number>} - The block number
     */
    getBlockByTransactionHash(transactionHash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const txDetails = yield this.fetchTransactionDetails(transactionHash);
                if (!txDetails) {
                    throw new Error(`Block Number for ${transactionHash} not found`);
                }
                return txDetails.blockNumber;
            }
            catch (error) {
                throw new Error(`Failed to fetch block number: ${error}`);
            }
        });
    }
    /**
     * Get transaction receipt from blockchain providing the ID for it in the input.
     * @param {string} transactionId - The transaction ID
     * @returns {Promise<TransactionReceipt>} - The transaction receipt object
     */
    fetchTransactionReceipt(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receipt = yield this.web3.eth.getTransactionReceipt(transactionId);
                if (!receipt) {
                    throw new Error(`Transaction receipt for ${transactionId} not found`);
                }
                return receipt;
            }
            catch (error) {
                throw new Error(`Failed to fetch transaction receipt: ${error.message}`);
            }
        });
    }
    /**
     * Create signed transaction for all different payloads of transactions
     * @param {TransactionPayload} payload - The transaction object
     * @param {string} privateKey - If a private key is provided, use that to sign the transaction, otherwise use the default private key
     * @returns {Promise<SignedTransaction>} - The signed transaction object
     */
    createSignedTransaction(payload, privateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nonce = yield this.getNonce.call(this.accounts, payload.from);
                this.currentAddress = payload.from;
                const tx = Object.assign(Object.assign({}, payload), { nonce });
                this.accounts.incrementNonce(payload.from);
                const signedTransaction = yield this.web3.eth.accounts.signTransaction(tx, privateKey);
                return {
                    rawTransaction: signedTransaction.rawTransaction,
                };
            }
            catch (error) {
                this.accounts.resetNonces(this.currentAddress);
                throw new Error(`Failed to create signed transaction: ${error.message}`);
            }
        });
    }
    /**
     * Sends an already signed transaction.
     * @param {string} signedTransactionData - Signed transaction data in HEX format
     * @returns {Promise<SendSignedTransactionResponse>} - The transaction response
     */
    sendSignedTransaction(signedTransactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.web3.eth.sendSignedTransaction(signedTransactionData);
                return {
                    transactionHash: result.transactionHash,
                };
            }
            catch (error) {
                this.accounts.resetNonces(this.currentAddress);
                throw new Error(`Failed to create signed transaction: ${error.message}`);
            }
        });
    }
    /**
     * Retrieves the current gas price(in wei) from the blockchain network
     * @returns {Promise<string>} - gas price
     */
    getGasPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gasPrice = yield this.web3.eth.getGasPrice();
                return gasPrice;
            }
            catch (error) {
                throw new Error(`Failed to get average gas fee: ${error.message}`);
            }
        });
    }
    /**
     * Retrieves the latest block number from the blockchain network
     * @returns {Promise<number>} - latest block number
     */
    getLatestBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latestBlock = yield this.web3.eth.getBlock("latest");
                return latestBlock.number;
            }
            catch (error) {
                throw new Error(`Failed to get latest block number: ${error.message}`);
            }
        });
    }
    /**
     * Retrieves details of a block on the blockchain network based on its identifier (either block number or block hash)
     * @param blockIdentifier The identifier of the block to retrieve details for
     * @returns A promise that resolves to the block details object or throws an error if the block is not found
     */
    getBlockDetails(blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const block = yield this.web3.eth.getBlock(blockIdentifier);
                if (!block) {
                    throw new Error("Block not found");
                }
                return block;
            }
            catch (error) {
                throw new Error(`Failed to get block details: ${error.message}`);
            }
        });
    }
}
exports.default = Ledger;
