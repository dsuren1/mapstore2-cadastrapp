import {
    CADASTRAPP_RASTER_LAYER_ID,
    CADASTRAPP_VECTOR_LAYER_ID
} from '../constants';
import { additionalLayersSelector } from '@mapstore/selectors/additionallayers';

// **********************************************
// CONFIGURATION
// **********************************************

/**
 * Gets the configuration loaded from cadastrapp API
 * @param {object} state
 */
export function configurationSelector(state) { return state?.cadastrapp.configuration;}

/**
 * loads from the configuration the property name to use as id for parcelle.
 * @param {object} state
 */
export function cadastreLayerIdParcelle(state) {
    const conf = configurationSelector(state);
    return conf?.cadastreLayerIdParcelle;
}
/**
 * gets the whole cadastrapp layer object
 * @param {object} state
 */
export function getCadastrappLayer(state) {
    const additionalLayers = additionalLayersSelector(state) ?? [];
    return additionalLayers.filter(({ id }) => id === CADASTRAPP_RASTER_LAYER_ID)?.[0]?.options;
}
// this if the layer is in TOC
// export function getCadastrappLayer(state) { return getLayerFromId(state, CADASTRAPP_RASTER_LAYER_ID); }
/**
 * gets the whole cadastrapp vector overlay object
 * @param {object} state
 */
export function getCadastrappVectorLayer(state) {
    const additionalLayers = additionalLayersSelector(state) ?? [];
    return additionalLayers.filter(({ id }) => id === CADASTRAPP_VECTOR_LAYER_ID)?.[0]?.options;
}

// **********************************************
// TOOLS
// **********************************************

/**
 * gets the current active selection tool for map (id)
 * @param {object} state
 * @returns {string} the selection type (one of constants.SELECTION_TYPES)
 */
export function currentSelectionToolSelector(state) { return state?.cadastrapp.selectionType; }

/**
 * gets the current active search form id.
 * @param {object} state
 * @returns {string} the search type (one of constants.SEARCH_TOOLS)
 */
export function currentSearchToolSelector(state) { return state?.cadastrapp.searchType; }


// **********************************************
// PLOTS
// **********************************************

export function plotsSelector(state) {
    return state?.cadastrapp?.plots;
}
/**
 * Gets the data of all plot selection from the state
 * @param {object} state
 */
export function plotDataSelector(state) {
    const selection = plotsSelector(state);
    if (!selection) {
        return [];
    }
    return selection.map(({data}) => data); // transform in array of array
}
// CURRENT TAB PLOTS

/**
 * gets from the state the index of the current tab selected
 * @param {object} state
 * @returns {number} the index of the current tab
 */
export function activeSelectionTabIndexSelectors(state) { return state?.cadastrapp.activePlotSelection || 0; }

/**
 * Selector of the current plots object (for the selected tab)
 * @param {object} state
 */
export function currentPlotsSelector(state) {
    const plots = plotsSelector(state);
    const active = activeSelectionTabIndexSelectors(state);
    return plots[active];
}

/**
 * Get the curretn selected plots Ids
 * @param {object} state
 * @return {string[]} the IDs of current selected items
 */
export function selectedPlotIdsSelector(state) {
    const current = currentPlotsSelector(state);
    return current?.selected;
}
/**
 * Get the current plots
 * @param {object} state
 * @return {object[]} the current plots in the table
 */
export function getCurrentPlotData(state) {
    const current = currentPlotsSelector(state);
    return current?.data ?? [];
}

export function getSelectedPlots(state) {
    const selectedIds = selectedPlotIdsSelector(state);
    const data = getCurrentPlotData(state) ?? [];
    return data.filter(({ parcelle }) => selectedIds.includes(parcelle));
}

// **********************************************
// LAYER AND STYLE
// **********************************************
export function layerStylesSelector(state) {
    return state.cadastrapp?.styles;
}
export function getSelectedStyle(state) {
    return layerStylesSelector(state)?.selected;
}
export function getDefaultStyle(state) {
    return layerStylesSelector(state)?.default;
}
/**
 * Gets th ecurrent features to plog.
 * @param {object} state the application state
 */
export function getCurrentPlotFeatures(state) {
    const selectedStyle = getSelectedStyle(state);
    const defaultStyle = getDefaultStyle(state);
    return getCurrentPlotData(state).map(({ feature, parcelle }) => {
        const ids = selectedPlotIdsSelector(state);
        const selected = ids.includes(parcelle);
        return {
            ...feature,
            style: selected ? selectedStyle : defaultStyle
        };
    });
}

export function getSelectedFeatures(state) {
    return getSelectedPlots(state).map(({ feature }) => feature);
}
