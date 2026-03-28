declare module '@mapbox/mapbox-gl-draw' {
  import type { IControl } from 'mapbox-gl';

  interface DrawControl extends IControl {
    add(geojson: object): string[];
    get(featureId: string): object | undefined;
    getSelectedIds(): string[];
    getSelected(): { type: 'FeatureCollection'; features: object[] };
    getAll(): { type: 'FeatureCollection'; features: object[] };
    delete(featureId: string): void;
    deleteAll(): void;
    setFeatureProperty(
      featureId: string,
      property: string,
      value: unknown
    ): { type: 'FeatureCollection'; features: object[] };
    changeMode(mode: string, options?: Record<string, unknown>): void;
    trash(): void;
  }

  interface MapboxDrawConstructor {
    new (options?: Record<string, unknown>): DrawControl;
  }

  const MapboxDraw: MapboxDrawConstructor;
  export default MapboxDraw;
}
