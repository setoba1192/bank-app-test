import { Currency } from "./account.model";

export interface TransferRequest {
    accountNumber : string,
    currency : Currency,
    amountToTransfer : number,
    receivingAccount : string
}