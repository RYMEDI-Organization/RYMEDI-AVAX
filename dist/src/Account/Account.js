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
exports.Accounts = void 0;
class Accounts {
    /**
     * @param {string} providerUrl - The web3 provider URL
     * @param {string} privateKeys - The private keys to get account.
     */
    constructor(web3, privateKeys) {
        this.web3 = web3;
        this.nonces = {};
        this.accounts = privateKeys.map((privateKey) => {
            const address = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
            this.web3.eth.getTransactionCount(address).then((networkNonce) => {
                this.nonces[address] = networkNonce;
            });
            return address;
        });
        this.currentKeyIndex = 0;
        this.PrivateKeys = privateKeys;
    }
    /**
     * Returns the addresses of the account for the given private key.
     *
     * @returns Update the variable with the current account addresses for further use.
     */
    getAccounts() {
        return this.accounts;
    }
    /**
     * Used to fetch the current transaction count of the account
     *
     * @param account The address of the account
     *
     * @returns a number which is the transaction count.
     */
    getNonce(account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const networkNonce = yield this.web3.eth.getTransactionCount(account);
                const localNonce = this.nonces[account] || 0;
                const maxNonce = Math.max(networkNonce, localNonce);
                this.nonces[account] = maxNonce;
                return maxNonce;
            }
            catch (error) {
                throw new Error(`Failed to fetch nonce: ${error.message}`);
            }
        });
    }
    /**
     * An function used to update the transaction count of the account.
     *
     * @param account The address of the account
     */
    incrementNonce(account) {
        if (!this.nonces[account]) {
            this.nonces[account] = 1;
        }
        else {
            this.nonces[account]++;
        }
    }
    /**
     * To fetch the balance of the account.
     *
     * @param account The address of the account.
     *
     * @returns a string which represents the balance of the account.
     */
    getBalance(account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.web3.eth.getBalance(account);
                return balance;
            }
            catch (error) {
                throw new Error(`Failed to fetch balance: ${error.message}`);
            }
        });
    }
    /**
     * To return private key in round robin way.
     * @returns private key.
     */
    returnPrivateKey() {
        const numKeys = this.PrivateKeys.length;
        let signerPrivateKey = this.PrivateKeys[this.currentKeyIndex];
        this.currentKeyIndex = (this.currentKeyIndex + 1) % numKeys;
        return signerPrivateKey;
    }
    /**
     * Resets the local nonce for the given account to 0.
     * @param account The address of the account
     */
    resetNonces(account) {
        this.nonces[account] = 0;
    }
}
exports.Accounts = Accounts;
