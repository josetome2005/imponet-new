import { useState } from "react";

export function useConfirm(){

    const [state, setState] = useState(null)    //{message, resolve}

    const confirm = (message) => {
        return new Promise((resolve) => {
            setState({message, resolve})
        })
    }

    const handleConfirm = () => {
        state.resolve(true)
        setState(null)
    }

    const handleCancel = () => {
        state.resolve(false)
        setState(null)
    }

    return {
        state,
        confirm, 
        handleConfirm, 
        handleCancel
    }



}