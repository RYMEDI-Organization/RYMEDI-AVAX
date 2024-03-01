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
exports.AccessControl = void 0;
class AccessControl {
    constructor(web3, contract, Abi, contractAddress) {
        this.web3 = web3;
        this.contract = new this.web3.eth.Contract(Abi, contractAddress);
        this.contractAddress = contractAddress;
        this.smartContract = contract;
        this.signTransaction = this.smartContract["signTransaction"];
        this.getMaximumPrioriityFeeGas = this.smartContract["getMaximumPrioriityFeeGas"];
    }
    /**
     * Checks if the given address is owner
     * @param {string} address - The address which needs to be checked
     * @returns {boolean} - true or false
     */
    isOwner(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validOwnerKey = yield this.contract.methods.isOwner(address).call();
                return validOwnerKey;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Checks if the given address is admin
     * @param {string} address - The address which needs to be checked
     * @returns {boolean} - true or false
     */
    isAdmin(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validAdminKey = yield this.contract.methods.isAdmin(address).call();
                return validAdminKey;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Assign the given address as the admin
     * Can only be signed by owners.
     * @param {string} address - The address which needs to be admin
     * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
     * @returns {string} - The transaction hash
     */
    assignAdmin(address, ownerPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownerPublicAddress = this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
                const validOwnerKey = yield this.isOwner(ownerPublicAddress);
                if (validOwnerKey === true) {
                    const data = yield this.contract.methods.setAdmin(address);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const maxPriorityFeePerGas = yield this.getMaximumPrioriityFeeGas();
                    const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
                    const gasLimit = yield data.estimateGas({
                        from: ownerPublicAddress,
                    });
                    const tx = {
                        from: ownerPublicAddress,
                        to: this.contractAddress,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                        maxPriorityFeePerGas: maxPriorityFeePerGas,
                        maxFeePerGas: maxFeePerGas
                    };
                    const txhash = yield this.signTransaction.call(this.smartContract, tx, ownerPrivateKey);
                    return txhash;
                }
                throw new Error("Provided private key is not of owner");
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Revoke the address from sender role.
     * Can only be signed by admins.
     * @param {string} address - The address which needs to be removed
     * @param {string} adminPrivateKey - The private key of admin to sign the transaction
     * @returns {string} - The transaction hash
     */
    removeSender(address, adminPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminPublicAddress = this.web3.eth.accounts.privateKeyToAccount(adminPrivateKey).address;
                const validAdminKey = yield this.isAdmin(adminPublicAddress);
                if (validAdminKey === true) {
                    const data = yield this.contract.methods.revokeSender(address);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const gasLimit = yield data.estimateGas({
                        from: adminPublicAddress,
                    });
                    const maxPriorityFeePerGas = yield this.getMaximumPrioriityFeeGas();
                    const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
                    const tx = {
                        from: adminPublicAddress,
                        to: this.contractAddress,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                        maxPriorityFeePerGas: maxPriorityFeePerGas,
                        maxFeePerGas: maxFeePerGas
                    };
                    const txhash = yield this.signTransaction.call(this.smartContract, tx, adminPrivateKey);
                    return txhash;
                }
                throw new Error("Provided private key is not of admin");
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Revoke the address from admin role.
     * Can only be signed by owners.
     * @param {string} address - The address which needs to be removed as admin
     * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
     * @returns {string} - The transaction hash
     */
    removeAdmin(address, ownerPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownerPublicAddress = this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
                const validOwnerKey = yield this.isOwner(ownerPublicAddress);
                if (validOwnerKey === true) {
                    let data = yield this.contract.methods.revokeAdmin(address);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const gasLimit = yield data.estimateGas({
                        from: ownerPublicAddress,
                    });
                    const maxPriorityFeePerGas = yield this.getMaximumPrioriityFeeGas();
                    const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
                    const tx = {
                        from: ownerPublicAddress,
                        to: this.contractAddress,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                        maxPriorityFeePerGas: maxPriorityFeePerGas,
                        maxFeePerGas: maxFeePerGas
                    };
                    const txhash = yield this.signTransaction.call(this.smartContract, tx, ownerPrivateKey);
                    return txhash;
                }
                throw new Error("Provided private key is not of owner");
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Function is used to transfer ownership
     * Can only be signed by owners.
     * @param {string} address - The address which needs to be owner
     * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
     * @returns {string} - The transaction hash
     */
    transferOwnership(address, ownerPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownerPublicAddress = this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
                const validOwnerKey = yield this.isOwner(ownerPublicAddress);
                if (validOwnerKey === true) {
                    let data = yield this.contract.methods.transferOwnership(address);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const gasLimit = yield data.estimateGas({
                        from: ownerPublicAddress,
                    });
                    const maxPriorityFeePerGas = yield this.getMaximumPrioriityFeeGas();
                    const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
                    const tx = {
                        from: ownerPublicAddress,
                        to: this.contractAddress,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                        maxPriorityFeePerGas: maxPriorityFeePerGas,
                        maxFeePerGas: maxFeePerGas
                    };
                    const txhash = yield this.signTransaction.call(this.smartContract, tx, ownerPrivateKey);
                    return txhash;
                }
                throw new Error("Provided private key is not of owner");
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Set the address to sender role.
     * Can only be signed by admins.
     * @param {string} address - The address which needs to be sender
     * @param {string} adminPrivateKey - The private key of owner to sign the transaction
     * @returns {string} - The transaction hash
     */
    assignSender(address, adminPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminPublicAddress = this.web3.eth.accounts.privateKeyToAccount(adminPrivateKey).address;
                const validAdminKey = yield this.isAdmin(adminPublicAddress);
                if (validAdminKey === true) {
                    let data = yield this.contract.methods.setSender(address);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const gasLimit = yield data.estimateGas({
                        from: adminPublicAddress,
                    });
                    const maxPriorityFeePerGas = yield this.getMaximumPrioriityFeeGas();
                    const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
                    const tx = {
                        from: adminPublicAddress,
                        to: this.contractAddress,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                        maxPriorityFeePerGas: maxPriorityFeePerGas,
                        maxFeePerGas: maxFeePerGas
                    };
                    const txhash = yield this.signTransaction.call(this.smartContract, tx, adminPrivateKey);
                    return txhash;
                }
                throw new Error("Provided private key is not of admin");
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * update the address of new smart contract.
     * can only be done by owner.
     * @param contractAddress The address of new contract.
     * @param {string} ownerPrivateKey - The private key of owner to sign the transaction
     * @returns The transaction hash of the submitted transaction.
     */
    updateContractAddress(contractAddress, ownerPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownerPublicAddress = this.web3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
                const isOwner = yield this.isOwner(ownerPublicAddress);
                if (isOwner === true) {
                    const data = yield this.contract.methods.updateCode(contractAddress);
                    const gasPrice = yield this.web3.eth.getGasPrice();
                    const gasLimit = yield data.estimateGas({
                        from: ownerPublicAddress,
                    });
                    const maxPriorityFeePerGas = yield this.getMaximumPrioriityFeeGas();
                    const maxFeePerGas = (parseInt(gasPrice) + parseInt(maxPriorityFeePerGas)).toString();
                    const tx = {
                        from: ownerPublicAddress,
                        to: this.contractAddress,
                        gasLimit: gasLimit,
                        data: data.encodeABI(),
                        maxPriorityFeePerGas: maxPriorityFeePerGas,
                        maxFeePerGas: maxFeePerGas
                    };
                    const txhash = yield this.signTransaction.call(this.smartContract, tx, ownerPrivateKey);
                    return txhash;
                }
                throw new Error("Provided private key is not of owner");
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.AccessControl = AccessControl;
