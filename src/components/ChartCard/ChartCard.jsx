import React from 'react';
import { CardContent, Typography } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { StyledCard } from './ChartCardStyle';

const ChartCard = ({ title, data, size = 'full' }) => {
    const option = {
        title: {
            text: title,
            left: 'center',
            top: 20,
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.name),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: data.map(item => item.value),
                type: 'line',
                smooth: true,
                areaStyle: {},
            },
        ],
    };

    return (
        <StyledCard size={size}>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    {title}
                </Typography>
                <ReactECharts option={option} style={{ height: 300 }} />
            </CardContent>
        </StyledCard>
    );
};

export default ChartCard;