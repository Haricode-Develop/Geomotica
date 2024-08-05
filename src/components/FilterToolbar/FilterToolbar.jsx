import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FilterBar, FilterButton, ResetButton } from './FilterToolbarStyle';

const filters = [
    'Zafra',
    'Tercio',
    'Semana',
    'Finca',
    'Lote',
    'Operador',
    'Turno',
    'Fecha',
];

const FilterToolbar = ({ isSidebarOpen, isDashboardIndicators }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedFilter, setSelectedFilter] = React.useState(null);

    const handleClick = (event, filter) => {
        setAnchorEl(event.currentTarget);
        setSelectedFilter(filter);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <FilterBar
            position="static"
            isSidebarOpen={isSidebarOpen}
            isDashboardIndicators={isDashboardIndicators}
        >
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="filter">
                    <FilterListIcon />
                </IconButton>
                {filters.map((filter) => (
                    <FilterButton
                        key={filter}
                        endIcon={<ArrowDropDownIcon />}
                        onClick={(event) => handleClick(event, filter)}
                    >
                        {filter}
                    </FilterButton>
                ))}
                <ResetButton
                    startIcon={<RefreshIcon />}
                    onClick={handleClose}
                >
                    Reset Filter
                </ResetButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Option 1</MenuItem>
                    <MenuItem onClick={handleClose}>Option 2</MenuItem>
                    <MenuItem onClick={handleClose}>Option 3</MenuItem>
                </Menu>
            </Toolbar>
        </FilterBar>
    );
};

export default FilterToolbar;