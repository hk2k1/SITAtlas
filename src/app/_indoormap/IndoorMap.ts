import type { BBox } from 'geojson';

import GeoJsonHelper from './GeojsonHelper';
import Style from './style';
import type { IndoorMapGeoJSON, IndoorMapOptions, LayerSpecification, LevelsRange } from './Types';

class IndoorMap {
    bounds: BBox;
    geojson: IndoorMapGeoJSON;
    layers: LayerSpecification[];
    levelsRange: LevelsRange;
    beforeLayerId?: string;
    layersToHide: string[];
    defaultLevel: number;
    showFeaturesWithEmptyLevel: boolean;

    constructor(
        bounds: BBox,
        geojson: IndoorMapGeoJSON,
        layers: LayerSpecification[],
        levelsRange: LevelsRange,
        layersToHide: string[],
        defaultLevel: number,
        showFeaturesWithEmptyLevel: boolean,
        beforeLayerId?: string,
    ) {
        this.bounds = bounds;
        this.geojson = geojson;
        this.layers = layers;
        this.levelsRange = levelsRange;
        this.layersToHide = layersToHide;
        this.defaultLevel = defaultLevel;
        this.showFeaturesWithEmptyLevel = showFeaturesWithEmptyLevel;
        this.beforeLayerId = beforeLayerId;
    }

    static fromGeojson(geojson: IndoorMapGeoJSON, options: IndoorMapOptions = {}): IndoorMap {
        const { bounds, levelsRange } = GeoJsonHelper.extractLevelsRangeAndBounds(geojson);

        const map = new IndoorMap(
            bounds,
            geojson,
            options.layers ? options.layers : Style.DefaultLayers,
            levelsRange,
            options.layersToHide ? options.layersToHide : [],
            options.defaultLevel ? options.defaultLevel : 0,
            options.showFeaturesWithEmptyLevel ? options.showFeaturesWithEmptyLevel : false,
            options.beforeLayerId,
        );

        return map;
    }
}

export default IndoorMap;
