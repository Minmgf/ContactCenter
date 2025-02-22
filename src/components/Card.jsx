import React from 'react';

const Card = () => {
    return (
        <div className='text-white flex flex-col gap-2 p-2 bg-zinc-900 w-fit rounded-lg items-center'>
            <p className='text-3xl bg-blue-300 rounded-full w-fit py-2 px-4 '>N</p>
            <section>
            <p>Nombre</p>
            <p>Empresa</p>
            <p>Trabaja desde</p>
            <p>Estado</p>
            </section>

        </div>
    )
}

export default Card