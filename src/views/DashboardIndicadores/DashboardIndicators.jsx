import React, { useContext, useEffect, useState } from 'react';
import { DashboardContainer, ContentContainer, LeftPanel, RightPanel, CardsContainer } from './DashboardIndicatorsStyle';
import FilterToolbar from '../../components/FilterToolbar/FilterToolbar';
import ActivitiesComponent from '../../components/ActivitiesComponent/ActivitiesComponent';
import { SidebarContext } from "../../context/SidebarContext";
import analysisConfig from '../../utils/analysisConfig';
import CardData from '../../components/CardData/DataCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import sidebarOptionsConfig from "../../utils/sidebarOptionsConfig";

const DashboardIndicators = ({ isSidebarOpen }) => {
    const [filterOptions, setFilterOptions] = useState([]);
    const [analysisOptions, setAnalysisOptions] = useState([]);
    const [indicators, setIndicators] = useState([]);
    const { selectedSidebarOption } = useContext(SidebarContext);

    useEffect(() => {
        const config = sidebarOptionsConfig[selectedSidebarOption];

        if (config) {
            setAnalysisOptions(config.analysisOptions || []);
            setFilterOptions(config.filterOptions || []);
        }
    }, [selectedSidebarOption]);


    const fetchIndicators = async (activityId) => {
        const config = analysisConfig[activityId];
        if (config && config.fetchDataIndicators) {
            try {
                const data = await config.fetchDataIndicators();
                setIndicators(data);
            } catch (error) {
                console.error("Error fetching indicators:", error);
            }
        }
    };

    return (
        <DashboardContainer isSidebarOpen={isSidebarOpen}>
            <FilterToolbar isSidebarOpen={isSidebarOpen} isDashboardIndicators={true} filterOptions={filterOptions} />
            <ContentContainer>
                <LeftPanel>
                    <ActivitiesComponent onSelectActivity={fetchIndicators} />
                </LeftPanel>
                <RightPanel>
                    <CardsContainer>
                        {indicators.map((indicator, index) => (
                            <CardData key={index} title={indicator.title || 'Indicador'}>
                                {indicator.value || indicator}
                            </CardData>
                        ))}
                    </CardsContainer>
                    <CardsContainer>
                        <ChartCard title="Ejemplo de Gráfica" data={indicators} size="full" />
                    </CardsContainer>
                </RightPanel>
            </ContentContainer>
        </DashboardContainer>
    );
};

export default DashboardIndicators;
