import {Provider} from "react-redux";
import CurrencyTable from "./CurrencyTable";
import store from "../store";

export default function Home() {
    return (
        <Provider store={store}>
            <CurrencyTable></CurrencyTable>
        </Provider>
    )
}
