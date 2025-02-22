import React from 'react'

const InputItem = ({ labelName, id, placeholder, type, ...rest }) => {
    return (
        <div>
            <label htmlFor={id} className="block font-medium ">
                {labelName}
            </label>
            <input
                id={id}
                placeholder={placeholder}
                className="w-full bg-white border-2 px-4 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                type={type}
                // ref={ref}
                {...rest}
            />
        </div>
    )
}

export default InputItem
