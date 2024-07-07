import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './publicidadStyle.css';

const slides = [
    {
        date: '',
        title: 'Nos esforzamos por traerte la mejor experiencia en geomotica',
        description: 'Espera nuevas actualizaciones para mejorar tu experiencia.',
    },
    {
        date: 'Próximamente',
        title: 'Mapeo de fertilización',
        description: 'Una nueva funcionalidad que estará disponible pronto.',
    },
];

const Publicidad = ({ isSidebarOpen }) => {
    return (
        <Box
            sx={{
                width: isSidebarOpen ? 'calc(100% - 100px)' : '100%',
                transition: 'width 0.5s ease',
                position: 'relative',
                mt: 2,
                ml: isSidebarOpen ? '120px' : '20px', // Mover el contenedor hacia la derecha cuando el sidebar está abierto
            }}
        >
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                style={{ width: '100%', height: '300px' }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <Box className="slide-background" sx={{ borderRadius: '10px', p: 3, textAlign: 'center', color: 'white', position: 'relative' }}>
                            <Box className="slide-content">
                                <Typography variant="h6">{slide.date}</Typography>
                                <Typography variant="h4" sx={{ my: 2 }}>{slide.title}</Typography>
                                <Typography>{slide.description}</Typography>
                            </Box>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
            <IconButton className="swiper-button-prev" sx={{ position: 'absolute', top: '40%', left: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            </IconButton>
            <IconButton className="swiper-button-next" sx={{ position: 'absolute', top: '40%', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }}>
            </IconButton>
        </Box>
    );
};

export default Publicidad;
