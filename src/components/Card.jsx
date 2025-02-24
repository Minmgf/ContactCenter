import React from 'react';

const Card = ({ name, email, status }) => {
    return (
        <div className='text-white flex flex-col gap-2 p-2 bg-zinc-900 w-fit rounded-lg items-center'>
            <p className='text-3xl bg-blue-300 rounded-full w-fit py-2 px-4 '>
                {name?.charAt(0).toUpperCase() || 'U'}
            </p>

            <section className='text-center'>
                <p>{name}</p>
                <p>{email}</p>
                <p>{status}</p>
            </section>
        </div>
    )
}

export default Card
