// MyTimeline.js
import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './HistoryStyle.css';

const MyTimeline = () => {

    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Título del Evento 1",
            description: "Descripción del evento 1.",
            date: "2/12/2024 14:00:00"
        },
        {
            id: 2,
            title: "Título del Evento 2",
            description: "Descripción del evento 2.",
            date: "3/12/2024 16:00:00"
        },
        {
            id: 3,
            title: "Título del Evento 2",
            description: "Descripción del evento 2.",
            date: "3/12/2024 16:00:00"
        },
        {
            id: 4,
            title: "Título del Evento 2",
            description: "Descripción del evento 2.",
            date: "3/12/2024 16:00:00"
        },
        {
            id: 5,
            title: "Título del Evento 2",
            description: "Descripción del evento 2.",
            date: "3/12/2024 16:00:00"
        },
        {
            id: 6,
            title: "Título del Evento 2",
            description: "Descripción del evento 2.",
            date: "3/12/2024 16:00:00"
        }
        // ...otros eventos
    ]);

    const [searchTitle, setSearchTitle] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const handleTitleChange = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleDateChange = (e) => {
        setSearchDate(e.target.value);
    };

    const filteredEvents = events.filter(event => {
        return event.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
            event.date.includes(searchDate);
    });


    return (
        <div className="timeline-container">
            <h1>HISTORIAL</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Buscar por título"
                    value={searchTitle}
                    onChange={handleTitleChange}
                />
                <input
                    type="date"
                    placeholder="Buscar por fecha"
                    value={searchDate}
                    onChange={handleDateChange}
                />
            </div>
            <div className="timeline-scroll">
                <VerticalTimeline>
                    {filteredEvents.map(event => (
                        <VerticalTimelineElement
                            key={event.id}
                            className="vertical-timeline-element--work"
                            date={event.date}
                            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                        >
                            <h3 className="vertical-timeline-element-title">{event.title}</h3>
                            <p>{event.description}</p>
                        </VerticalTimelineElement>
                    ))}
                </VerticalTimeline>
            </div>
        </div>
    );
};

export default MyTimeline;
