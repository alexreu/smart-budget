export const Currencies = [
    {
        value: "USD",
        label: "$ Dollar",
        locale: "en-US",
    },
    {
        value: "EUR",
        label: "€ Euro",
        locale: "en-US",
    },
    {
        value: "GBP",
        label: "£ Pound",
        locale: "en-GB",
    },
    {
        value: "JPY",
        label: "¥ Yen",
        locale: "ja-JP",
    },
];

export type Currency = (typeof Currencies)[0];
