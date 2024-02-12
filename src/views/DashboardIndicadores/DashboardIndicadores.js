// DashboardIndicadores.js
import React from 'react';
import ReactECharts from 'echarts-for-react';
import './DashboardIndicadoresStyle.css';
const DashboardIndicadores = () => {
    const barOptions = {
        title: {
            text: 'Cantidad de análisis realizados',
            left: 'center',
            textStyle: {
                color: '#333',
                fontWeight: 'bold',
                fontSize: 20
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            data: ["Categoría 1", "Categoría 2", "Categoría 3", "Categoría 4"],
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#666'
                }
            }
        },
        yAxis: {
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#666'
                }
            }
        },
        series: [
            {
                name: 'Análisis',
                type: 'bar',
                data: [5, 20, 36, 10],
                itemStyle: {
                    normal: {
                        color: function(params) {
                            const colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265'];
                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}'
                        }
                    }
                }
            }
        ],
        color: ['#3398DB']
    };

    const pieOptions = {
        title: {
            text: 'Análisis por usuario',
            left: 'center',
            textStyle: {
                color: '#333',
                fontWeight: 'bold',
                fontSize: 20
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
            {
                name: 'Análisis',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: 235, name: 'Usuario 1' },
                    { value: 274, name: 'Usuario 2' },
                    { value: 310, name: 'Usuario 3' },
                    { value: 335, name: 'Usuario 4' },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    return (
        <div className="dashboard-indicadores">
            <h1>Dashboard Indicadores</h1>
            <div className="content">
                <div className="charts">
                    <ReactECharts option={barOptions} style={{ height: '400px' }} />
                    <ReactECharts option={pieOptions} style={{ height: '400px' }} />
                </div>
                <div className="feed-analisis">
                    <h2>Feed Análisis</h2>
                    {/* Aquí puedes mapear tus datos de análisis para mostrarlos */}
                    <div className="feed-item">Item 1</div>
                    <div className="feed-item">Item 2</div>
                    {/* ... */}
                </div>
            </div>
        </div>
    );
};

export default DashboardIndicadores;
