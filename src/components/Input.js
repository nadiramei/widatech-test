import React from "react";

const Input = ({ label, id, type }) => {
    return (
        <>
            <div className="flex flex-col">
                <label htmlFor="inputField" className="block text-gray-400 text-sm font-semibold mb-2">{label}</label>
                <input id={id} type={type} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>

        </>
    )
}

export default Input;