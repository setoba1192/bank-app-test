export interface TransferResponse {
  status: string;
  message: string;
  transaccionNumber: number;
  transaccionDate: Date;
  receivingAccount: string;
  sentAmount: number;
}
