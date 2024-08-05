import React, { useEffect, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SlideBackground, SlideContent } from './AdvertisingStyle';

const slides = [
    {
        date: '',
        title: 'Nos esforzamos por brindarte la mejor experiencia en geomática',
        description: 'Espera nuevas actualizaciones para mejorar tu experiencia.',
    },
    {
        date: 'Próximamente',
        title: 'Mapeo de Fertilización',
        description: 'Una nueva función que estará disponible pronto.',
    },
];

const Advertising = ({ isSidebarOpen }) => {
    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.swiper.update();
        }
    }, [isSidebarOpen]);

    return (
        <Box
            sx={{
                width: 'calc(100% - 120px)', // Ajustar para que se adapte al tamaño del contenedor
                transition: 'margin-left 0.5s ease',
                position: 'relative',
                mt: 10, // Ajustar para que haya espacio suficiente debajo del navbar
                ml: isSidebarOpen ? '120px' : '20px',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                style={{ width: '100%', height: '300px' }} // Ajuste para que no se desborde
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <SlideBackground>
                            <SlideContent>
                                <Typography variant="h6">{slide.date}</Typography>
                                <Typography variant="h4" sx={{ my: 2 }}>{slide.title}</Typography>
                                <Typography>{slide.description}</Typography>
                            </SlideContent>
                        </SlideBackground>
                    </SwiperSlide>
                ))}
            </Swiper>
            <IconButton className="swiper-button-prev" sx={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
                <ArrowBackIosIcon />
            </IconButton>
            <IconButton className="swiper-button-next" sx={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};

export default Advertising;