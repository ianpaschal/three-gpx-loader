# three-gpx-loader
Load .gpx files as Three.js geometry.

<p>
	<a href="https://github.com/ianpaschal/polyply/blob/master/LICENSE">
		<img src="https://img.shields.io/npm/v/three-gpx-loader.svg" />
	</a>
	<a href="https://github.com/ianpaschal/polyply/blob/master/LICENSE">
		<img src="https://img.shields.io/npm/dt/three-gpx-loader.svg" />
	</a>
	<a href="https://github.com/ianpaschal/three-gpx-loader/blob/master/LICENSE">
		<img src="https://img.shields.io/github/license/ianpaschal/three-gpx-loader.svg" />
	</a>
	<a href="https://github.com/ianpaschal/three-gpx-loader/issues">
		<img src="https://img.shields.io/github/issues-raw/ianpaschal/three-gpx-loader.svg" />
	</a>
	<!--
	<a href="https://codeclimate.com/github/ianpaschal/three-gpx-loader">
		<img src="https://img.shields.io/codeclimate/github/ianpaschal/three-gpx-loader.svg" />
	</a>
	-->
</p>

`three-gpx-loader` can:

- [x] Parse `.gpx` files & convert to vertices with `x`, `y`, and `z` coordinates...
	- [x] ...as though the map is a plane.
	- [ ] ...as though the map is a sphere.
- [ ] Normalize or center the coordinates around the origin.

## Install
```
$ npm install --save three-gpx-loader
```

## Usage
```js
let Three = require( "three" );
// You can name it "THREE" instead of "Three" if you want, but it's just another
// module and therefore it has no business having an all-capital name.

let GPXLoader = require( "three-gpx-loader" )( Three );

let loader = Three.GPXLoader();
let path = "../input/gpx/col-du-galibier.gpx"
let onError = function( err ) {
	console.log( err );
}
let onLoad = function( result ) {
	let material = new Three.LineBasicMaterial({ color: 0xffff00 });
	let line = new Three.Line( result, material );
	scene.add( line );
}

loader.load( path, onError, onLoad );
```

## FAQ

**Q: Why?**

_A: To use within my GPX -> OBJ converter (CLI & GUI)._

**Q: How does the loader "flatten" the GPX coordinates?**

_A: Z-axis (changable in the future) is used for elevation so the elevation coordinates in meters are directly copied to the `z` value of each vertex. For `x` and `y`, the first point is considered to be at `0,0`. Each point after that is computed to be a certain distance and a certain bearing from the last point. This distance in that direction is added to the last point to find the coordinates of the next point. In code this looks like:_

```js

let vertices = [ new Three.Vector3( 0, 0, points[ 0 ].ele ) ];
let d, b; // d = distance, b = bearing

for ( let i = 0; i < points.length; i++ ) {

	// If there is a next point...
	if ( points[ i + 1 ] ) {

		// Compute distance and bearing between the current and next point:
		let d = getDistance( points[ i ], points[ i + 1 ] );
		let b = getBearing( points[ i ], points[ i + 1 ] );

		// Using the results, push a new vertex to the vertices array:
		vertices.push( new Three.Vector3(
			vertices[ i ].x - d * ( Math.cos( b )),
			vertices[ i ].y + d * ( Math.sin( b )),
			points[ i + 1 ].ele
		));
	}
```
_In the future, it should be possible as well to place coordinates in a sphere of a given radius, for the purpose of displaying them on a 3D globe, although this was exactly the opposite of my intention when originally creating it (creating maps for racing games)._


## License
[MIT](LICENSE)

© 2018, Ian Paschal.
