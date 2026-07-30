import "./MoneyInput.css"
import { SelectInput } from "../SelectInput/SelectInput"
import { useEffect, useState } from "react"
import { useMoneyValue } from "../../../../hooks/useMoneyValue"

const currency_options = [
    {
        id: crypto.randomUUID(),
        label: "USD",
        value: "USD"
    },
    {
        id: crypto.randomUUID(),
        label: "ARG",
        value: "ARG"
    }
]

export function MoneyInput({ name_input, value, onChange }){

    const {
        currency,
        amount,
        handleChangeAmount,
        handleChangeCurrency
    } = useMoneyValue(value, name_input, onChange)


    return(
        <div className="money__input">
            <div className="currency__selector__container">
                <SelectInput 
                    name_input={name_input}
                    activeOption={currency}
                    options={currency_options}
                    onSelect={handleChangeCurrency}
                    />
            </div>
            <input type="number" value={amount} onChange={handleChangeAmount} />
        </div>

    )


}