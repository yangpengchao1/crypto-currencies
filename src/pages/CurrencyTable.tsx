import {Image, Input, message, Switch, Table, Tabs} from 'antd';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {API_URL, HAS_DATA} from "../constant/config";
import {Currency} from "../entity/Currency";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../store";
import {ICurrencyActionType, ICurrencyState} from "../store/reducers/currencies";
import {sortData} from "../utils/DataUtils";
import {checkStatus} from "../utils/APIUtils";
import {useInterval} from "../utils/UseUtils";

const {Search} = Input;

const {TabPane} = Tabs;

export default function CurrencyTable() {
    const [currencyData, setCurrencyData] = useState<Currency[]>();
    let {currencies} = useSelector<IRootState, ICurrencyState>((state: IRootState) => state.currencies);

    const [favoriteCurrencyData, setFavoriteCurrencyData] = useState<Currency[]>(currencies);

    const [count, setCount] = useState(0);
    const [delay, setDelay] = useState(15);

    const dispatch = useDispatch();
    const addFavorite = (record: Currency) => {
        currencies = [...currencies, record];
        setFavoriteCurrencyData(currencies);
        dispatch({
            type: ICurrencyActionType.ADD,
            payload: {record}
        })
    }
    const removeFavorite = (record: Currency) => {
        currencies = currencies.filter((item: Currency) =>
            item.symbol !== record.symbol);
        setFavoriteCurrencyData(currencies);
        dispatch({
            type: ICurrencyActionType.REMOVE,
            payload: {record}
        })
    }

    useInterval(() => {
        // Your custom logic here
        setCount(count + 1);
    }, delay * 1000);


    useEffect(() => {
        (async () => {
            const res = await axios.get(API_URL);
            console.log(res)
            await handRes(res);
        })();
    }, [count]);

    const handleDelayChange = (value: string) => setDelay(parseInt(value));

    // handle the response
    const handRes = (res: any) => {
        if (checkStatus(res.status)) {
            if (res.data.code === HAS_DATA) {
                return handleData(res.data.data.markets)
            }
        }
        return message.info("No data currently")
    }

    // filter and sort data
    const handleData = (data: Currency[]) => {
        const data1 = data.filter((element: Currency) => {
            return element.exchange_id === "BINANCE" && element.quote_asset === "USDT"
        });
        const data2 = sortData(data1);
        refreshCurrencies(data2);
        setCurrencyData(data2);
    }

    // refresh favorite data
    const refreshCurrencies = (data: Currency[]) => {
        const latestCurrenciesData = currencies.map(item => {
            return getLatestData(data, item.symbol)[0]
        })
        currencies = latestCurrenciesData;
        setFavoriteCurrencyData(currencies)
    }

    //compare between favorite data and refresh data
    const getLatestData = (data: Currency[], symbol: string) => {
        return data.filter(item => item.symbol === symbol)
    }

    const columns = [
        {
            title: 'Exchange id',
            dataIndex: 'exchange_id',
            key: 'exchange_id',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Base Asset',
            dataIndex: 'base_asset',
            key: 'base_asset',
        },
        {
            title: 'Quote Asset',
            dataIndex: 'quote_asset',
            key: 'quote_asset',
        },
        {
            title: 'Price Unconverted',
            dataIndex: 'price_unconverted',
            key: 'price_unconverted',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Change 24h',
            dataIndex: 'change_24h',
            key: 'change_24h',
        },
        {
            title: 'Volume 24h',
            dataIndex: 'volume_24h',
            key: 'volume_24h',
        },
        {
            title: 'Favorite',
            dataIndex: 'favorite',
            key: 'action',

            render: (text: any, record: Currency) => (
                <Switch onChange={(flag: boolean) => {
                    if (flag) {
                        addFavorite(record);
                    } else {
                        removeFavorite(record)
                    }
                }}/>
            ),
        },
    ];
    const favorite_columns = [
        {
            title: 'Exchange id',
            dataIndex: 'exchange_id',
            key: 'exchange_id',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Base Asset',
            dataIndex: 'base_asset',
            key: 'base_asset',
        },
        {
            title: 'Quote Asset',
            dataIndex: 'quote_asset',
            key: 'quote_asset',
        },
        {
            title: 'Price Unconverted',
            dataIndex: 'price_unconverted',
            key: 'price_unconverted',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Change 24h',
            dataIndex: 'change_24h',
            key: 'change_24h',
        },
        {
            title: 'Volume 24h',
            dataIndex: 'volume_24h',
            key: 'volume_24h',
        }
    ];

    return (
        <div className="card-container div-frame">

            <a href='https://liverton.com/'><Image
                width={200}
                src="/logo.png"
                preview={false}
            />
            </a>
            <div className="set-div">
                <h3 className="set-title">Refresh Time (s): </h3>
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Set"
                    size="large"
                    onSearch={handleDelayChange}
                    type="number"
                    max="20"
                    min="5"
                    defaultValue={delay}
                    className="set-search-bar"
                />
            </div>
            <Tabs type="card">
                <TabPane tab="Current" key="1">
                    <Table columns={columns} dataSource={currencyData} pagination={false}/>
                </TabPane>
                <TabPane tab="My Favorite" key="2">
                    <Table columns={favorite_columns} dataSource={favoriteCurrencyData} pagination={false}/>
                </TabPane>
            </Tabs>
        </div>
    )
}
