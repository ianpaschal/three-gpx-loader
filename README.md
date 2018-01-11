# three-gpx-loader
Load .gpx files as Three.js geometry.

**NOTE: Currently WIP. Check back soon!**

`three-gpx-loader` can:

- [x] Parse `.gpx` files & convert to vertices with `x`, `y`, and `z` coordinates...
	- [x] ...as though the map is a plane.
	- [ ] ...as though the map is a sphere.
- [x] Normalize or center the coordinates around the origin.

## Install
```
$ npm install --save three-gpx-loader
```

## Usage
```
let Three = require( "three" );
// You can name it "THREE" instead of "Three" if you want, but it's just another module and has no business having an all-capital name.

let GPXLoader = require( "three-gpx-loader" )( Three );

let geometry = Three.GPXLoader( "../input/gpx/my-route.gpx" );

let route = new Three.Line( geometry, new Three.LineBasicMaterial({ color: 0xff0000 }));
```

## FAQ

**Why?** _To use within my GPX -> OBJ converter (CLI & GUI).

## License
[MIT](LICENSE)
© Ian Paschal, 2018.
