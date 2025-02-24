'use client'
import React, { useEffect, useState } from 'react'
import Card from './Card'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination, Navigation } from 'swiper/modules'

const NewsLetter = () => {
    const [agents, setAgents] = useState([])

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await fetch('/api/agents')
                const data = await res.json()
                setAgents(data)
            } catch (error) {
                console.error('❌ Error al obtener agentes:', error)
            }
        }
        fetchAgents()
    }, [])

    return (
        <div 
            id='scroll'
            className="w-full my-4 flex flex-col items-center gap-4 text-white"
        >
            <h1 className='text-4xl font-bold text-gray-300'>Nuestro equipo</h1>
            
            <Swiper
                breakpoints={{
                    640: { slidesPerView: 1 , spaceBetween: 25 },
                    768: { slidesPerView: 4, spaceBetween: 30 },
                    1024: { slidesPerView: 5, spaceBetween: 10 },
                }}
                navigation={true}
                // pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                // onSlideChange={() => console.log('slide change')}
                // onSwiper={(swiper) => console.log(swiper)}
                className='max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl w-full'
                loop={true}
                modules={[Pagination, Navigation]}
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                }}
            >
                {agents.map(agent => (
                    <SwiperSlide key={agent._id}>
                        <Card
                            name={agent.name}
                            email={agent.email}
                            status={agent.status || 'Sin estado'}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default NewsLetter
