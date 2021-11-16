import {Currency} from "../entity/Currency";

export function sortData(data:Currency[]){
    return data.sort((e1: Currency, e2: Currency) => {
        return parseFloat(e2.price) - parseFloat(e1.price)
    })
}