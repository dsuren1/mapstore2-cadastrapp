
/**
 * Identifier of mapstore layer ID for  cadastrapp
 */
export const CADASTRAPP_RASTER_LAYER_ID = "__CADASTRAPP_VECTOR_LAYER__";
export const CADASTRAPP_VECTOR_LAYER_ID = "__CADASTRAPP_RASTER_LAYER__";
// owner for tools like additional layers and draw support
export const CADASTRAPP_OWNER = "CADASTRAPP";
/**
 * Name of the control in controls reducer to get the enabled property
 */
export const CONTROL_NAME = 'cadastrapp';

export const SELECTION_TYPES = {
    POINT: "POINT",
    LINE_STRING: "LINE_STRING",
    POLYGON: "POLYGON",
    LANDED_PROPERTY: "LANDED_PROPERTY"
};

/**
 * type of the search tools
 */
export const SEARCH_TOOLS = {
    PLOT: "PLOT",
    OWNER: "OWNER",
    COOWNER: "COOWNER"
};

export const LAYER_STYLES = {
    selected: {
        fillColor: "#81BEF7",
        opacity: 0.6,
        fillOpacity: 0.6,
        color: "#111111", // stroke color
        weight: 4
    },
    "default": {
        fillColor: "#222111",
        opacity: 0.4,
        fillOpacity: 0.4,
        color: "#111222", // stroke color
        weight: 2
    }
};
/*
 * SEARCH TYPES (plot search, more....)
 */
export const SEARCH_TYPES = {
    // PLOT
    REFERENCE: "reference",
    ADDRESS: "address",
    ID: "id",
    LOT: "lot",
    // OWNER
    USER: 'user',
    OWNER_ID: 'ownerId',
    OWNER_LOT: "ownerLot", // comptecommunal
    COOWNER: "coowner"
};
export const MIN_PARCELLE_ID_LENGTH = 14;
