type Material = {
  texture: string;
  color: string;
  pbr?: string;
  image?: string;
  metallic?: number;
  roughness?: number;
};

type MaterialBlock = [material: Material];

type Shape = {
  id: string;
  type: string;
  size: {
    w?: number; // width
    h?: number; // height
    l?: number; // length
    r?: number; // radius
    d?: number; // diameter
    t?: number; // diameter of top
    b?: number; // diameter of bottom
    s?: number; // tile size
  };
  tileSize?: number; // tile size for walls and ground
  material: MaterialBlock;
};

type ShapeBlock = [shape: Shape];

type Coords = {
  x: number;
  y: number;
  z: number;
};

type CoordsBlock = [coords: Coords];

type Light = {
  id: string;
  type: string;
  props: {
    b?: number; // brightness
    c?: string; // color
    s?: number; // beam size
    r?: number; // range
    x?: number; // x position of directionality
    y?: number; // y position of directionality
    z?: number; // z position of directionality
  };
};

type LightBlock = [light: Light];

type Skybox = {
  asset: string;
};