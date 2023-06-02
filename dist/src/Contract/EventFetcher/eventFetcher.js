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
class EventFetcher {
    /**
     * Constructs a new instance of the EventFetcher class.
     * @param providerUrl - The URL of the blockchain provider to connect to.
     * @param contractInstance - The smart contract instance to fetch events from.
     */
    constructor(contractInstance) {
        this.events = contractInstance;
    }
    /**
     * Fetches event logs from the smart contract instance.
     * @param eventName - The name of the event to fetch logs for. If not provided, all events will be fetched.
     * @param options - An optional filter object containing fromBlock, toBlock.
     * @returns An array of event logs matching the specified criteria.
     * @throws An error if the specified event name is not found on the contract instance.
     */
    fetchEvents(eventName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the event name is valid, if provided
            if (eventName && !(eventName in this.events.events)) {
                throw new Error(`Event "${eventName}" not found`);
            }
            // Set default values for fromBlock and toBlock if not provided
            const fromBlock = (options === null || options === void 0 ? void 0 : options.fromBlock) || 0;
            const toBlock = (options === null || options === void 0 ? void 0 : options.toBlock) || "latest";
            const eventLogs = yield this.events.getPastEvents(eventName || "allEvents", Object.assign(Object.assign({}, options), { fromBlock, toBlock }));
            return eventLogs;
        });
    }
}
exports.default = EventFetcher;
