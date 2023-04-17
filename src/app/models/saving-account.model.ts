import { Account } from "./account.model";

export class SavingAccount extends Account {

    public updateBalance = (newBalance : number) : void => {
        if(newBalance<0){
            throw Error('Saving account cannot have negative values');
        }
        this.balance = newBalance;
    }
    
}