import { useEffect, useState } from "react"

export function useMoneyValue(value, name_input, onChange) {

    const [currency, setCurrency] = useState(null)
    const [amount, setAmount] = useState(null)

    useEffect(() => {

        if (!value) return

        const [currency_value, amount_raw] = value.split("$")

        const amount_value = amount_raw === undefined || amount_raw === "" || isNaN(amount_raw)
            ? null
            : parseInt(amount_raw)

        setCurrency(currency_value)
        setAmount(amount_value)

    }, [value])

    const buildValue = (newCurrency, newAmount) => {
        const safeAmount = newAmount ?? ""
        return `${newCurrency}$${safeAmount}`
    }

    const handleChangeCurrency = (option_selected) => {
        const currency_selected = option_selected?.value
        const new_value = buildValue(currency_selected, amount)

        setCurrency(currency_selected)
        onChange(name_input, new_value)
    }

    const handleChangeAmount = (e) => {
        const { value: rawValue } = e.target
        const parsedAmount = rawValue === "" ? null : parseInt(rawValue)

        const new_value = buildValue(currency, parsedAmount)

        setAmount(parsedAmount)
        onChange(name_input, new_value)
    }

    return { currency, amount, handleChangeCurrency, handleChangeAmount }
}