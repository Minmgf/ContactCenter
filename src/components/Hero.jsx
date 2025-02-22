import React from 'react'
import LinkItem from './LinkItem'
import SplineBackground from './SplineBackground'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className='flex w-full h-[500px]'>
      <div className="w-1/2 px-3 py-2 flex flex-col justify-center gap-4 ">
        <p className='bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-600 text-5xl font-bold'>
          Contact Center
        </p>
        <p className='text-gray-300 pr-8'>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat suscipit ut aut repellat, provident placeat repudiandae nisi ullam est rerum magni molestiae ad distinctio! Iste totam quibusdam perspiciatis autem blanditiis!
        </p>
        <section className='flex items-center gap-4'>
          <LinkItem href={'agents'} name={'Explora nuestros agentes'} className={'bg-white w-fit py-2 px-3 rounded-full'} />
          <Link href={`#scroll`} className={'text-white'} > Mas informacion  </Link>
        </section>
      </div>

      <div className="w-1/2   ">
        <SplineBackground/>
      </div>
    </div>
  )
}

export default Hero