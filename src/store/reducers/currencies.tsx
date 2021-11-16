import {Currency} from "../../entity/Currency";

export interface ICurrencyState {
    currencies: Currency[]
}

export enum ICurrencyActionType {
    INIT,
    ADD,
    REMOVE
}

const initCurrencyState: ICurrencyState = {
    currencies: []
}

const currencies = (
    state: ICurrencyState = initCurrencyState,
    action: { type: ICurrencyActionType, payload: { record: Currency } }
) => {
    switch (action.type) {
        case ICurrencyActionType.INIT:
            return state;
        case ICurrencyActionType.ADD:
            if (state.currencies.find(item => item.symbol === action.payload.record.symbol)) {
                return {...state, currencies: [...state.currencies]};
            }
            return {...state, currencies: [...state.currencies, action.payload.record]};
        case ICurrencyActionType.REMOVE:
            return {
                ...state,
                currencies: state.currencies.filter((item: Currency) =>
                    item.symbol !== action.payload.record.symbol
                )
            }
        default:
            return state;
    }
}

export default currencies;