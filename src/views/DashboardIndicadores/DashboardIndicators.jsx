import React from 'react';
import { DashboardContainer, ContentContainer, LeftPanel, RightPanel, CardsContainer } from './DashboardIndicatorsStyle';
import FilterToolbar from '../../components/FilterToolbar/FilterToolbar';
import ActivitiesComponent from '../../components/ActivitiesComponent/ActivitiesComponent';
import ChartCard from '../../components/ChartCard/ChartCard';
import CardData from '../../components/CardData/DataCard';

const chartsData = [
    { name: '5k', value: 20 },
    { name: '10k', value: 30 },
    { name: '15k', value: 45 },
    { name: '20k', value: 40 },
    { name: '25k', value: 50 },
    { name: '30k', value: 35 },
    { name: '35k', value: 40 },
    { name: '40k', value: 60 },
    { name: '45k', value: 50 },
    { name: '50k', value: 70 },
    { name: '55k', value: 55 },
    { name: '60k', value: 65 },
];

const DashboardIndicators = ({ isSidebarOpen }) => {
    return (
        <DashboardContainer isSidebarOpen={isSidebarOpen}>
            <FilterToolbar isSidebarOpen={isSidebarOpen} isDashboardIndicators={true} />
            <ContentContainer>
                <LeftPanel>
                    <ActivitiesComponent />
                </LeftPanel>
                <RightPanel>
                    <CardsContainer>
                        <CardData title="Applied Tons">1,046,067.876</CardData>
                        <CardData title="Real Cane Tons">1,174,067.876</CardData>
                        <CardData title="Tons/Ha">115,452</CardData>
                        <CardData title="TAH">13,117</CardData>
                        <CardData title="Authorized">43.62</CardData>
                        <CardData title="OTHERS">43.62</CardData>
                    </CardsContainer>
                    <CardsContainer>
                        <ChartCard title="RTK Signal by FRONT" data={chartsData} size="half" />
                        <ChartCard title="RTK Signal by FARM" data={chartsData} size="half" />
                    </CardsContainer>
                    <CardsContainer>
                        <ChartCard title="Cumulative Auto Pilot Usage by Operator" data={chartsData} size="full" />
                    </CardsContainer>
                </RightPanel>
            </ContentContainer>
        </DashboardContainer>
    );
};

export default DashboardIndicators;