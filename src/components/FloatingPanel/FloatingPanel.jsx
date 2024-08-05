import React, { useMemo, useState } from 'react';
import { Typography, Box, TextField, IconButton, Menu, MenuItem, Button, CardContent } from '@mui/material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { FixedSizeList } from 'react-window';
import { LotCard, SearchContainer } from './FloatingPanelStyle';
import { StyledButton } from '../ToolbarComponent/ToolbarComponentStyle';

const FloatingPanel = ({
                           polygonsData,
                           highlightedLote,
                           activeLotes,
                           searchTerm,
                           setSearchTerm,
                           onHoverLote,
                           onLeaveLote,
                           onSelectLote,
                           clearAllLotes,
                       }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const filteredLotes = useMemo(
        () =>
            Object.entries(
                polygonsData.reduce((acc, feature) => {
                    const loteId = getLoteId(feature.properties);
                    if (!acc[loteId]) {
                        acc[loteId] = [];
                    }
                    acc[loteId].push(feature);
                    return acc;
                }, {})
            ).filter(([loteId]) =>
                loteId.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [polygonsData, searchTerm]
    );

    const Row = ({ index, style }) => {
        const [loteId, features] = filteredLotes[index];
        return (
            <LotCard
                key={loteId}
                style={style}
                highlighted={highlightedLote === loteId}
                selected={activeLotes.includes(loteId)}
                onMouseEnter={() => onHoverLote(loteId)}
                onMouseLeave={onLeaveLote}
                onClick={() => onSelectLote(loteId)}
            >
                <CardContent>
                    <Typography variant="h6">{loteId}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Número de polígonos: {features.length}
                    </Typography>
                </CardContent>
            </LotCard>
        );
    };

    return (
        <Box>
            <StyledButton // Cambiar Button por StyledButton
                aria-controls={open ? 'lote-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                startIcon={<DragIndicatorIcon />}
            >
                Seleccionar Lote
            </StyledButton>
            <Menu
                id="lote-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        width: '300px',
                        maxHeight: '400px',
                        overflow: 'auto',
                    },
                }}
            >
                <SearchContainer>
                    <Box display="flex" alignItems="center" mb={1}>
                        <TextField
                            label="Buscar Lote"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <IconButton
                            color="secondary"
                            onClick={clearAllLotes}
                            disabled={activeLotes.length === 0}
                            style={{ marginLeft: '8px' }}
                        >
                            <CleaningServicesIcon />
                        </IconButton>
                    </Box>
                    <FixedSizeList
                        height={300}
                        itemCount={filteredLotes.length}
                        itemSize={80}
                        width={'100%'}
                    >
                        {Row}
                    </FixedSizeList>
                </SearchContainer>
            </Menu>
        </Box>
    );
};

export default FloatingPanel;

const getLoteId = (properties) => {
    const keys = Object.keys(properties).map((key) => key.toLowerCase());
    const idLoteIndex = keys.indexOf('id_lote');
    const idIndex = keys.indexOf('id');

    if (idLoteIndex !== -1) {
        return properties[Object.keys(properties)[idLoteIndex]];
    } else if (idIndex !== -1) {
        return properties[Object.keys(properties)[idIndex]];
    } else {
        return null;
    }
};
