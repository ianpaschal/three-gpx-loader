// NOTE: xml2js does annoying things with creating arrays. Roll own solution eventually.
const XML2JS = require( "xml2js" );
const FS = require( "fs" );
module.exports = function( Three ) {
	Three.GPXLoader = function() {
		return this;
	}
	Three.GPXLoader.prototype = {
		constructor: Three.GPXLoader,
		load( path, onError, onLoad ) {

			// Provide access to "this":
			let scope = this;

			// Read the file...
			FS.readFile( path, "utf8", ( err, data ) => {
				if ( err ) {
					if ( typeof onError === "function" ) {
						return onError( err );
					} else {
						throw err;
					}
				} else {
					if ( typeof onLoad === "function" ) {
						let geometry = scope.parse( data, () => {
							// Build and return the geometry instance:
							return onLoad( scope.build() );
						});
					} else {
						return "Please do something with the loaded file!"
					}
				}
			});
		},
		parse( data, callback ) {

			// Provide access to "this":
			let scope = this;

			// Parse the XML as a JSON object:
			XML2JS.parseString( data, ( err, data ) => {
				if ( err ) {
					throw err;
				} else {
					scope.points = [];

					// Loop in case GPX file has multiple segments:
					for ( let trkseg of data.gpx.trk[ 0 ].trkseg ) {
						for ( let trkpt of trkseg.trkpt ) {

							// Push points after converting to radians and rounding:
							scope.points.push({
								lat: scope.toRadians( trkpt.$.lat ),
								lon: scope.toRadians( trkpt.$.lon ),
								ele: scope.round( trkpt.ele[ 0 ], 2)
							});
						}
					}

					callback();

				}
			});
		},
		build() {
			let geometry = new Three.Geometry();

			geometry.vertices.push( new Three.Vector3( 0, 0, this.points[ 0 ].ele ));
			this.distance = 0;

			for ( let i = 0; i < this.points.length; i++ ) {
				let d, b; // d = distance, b = bearing

				// If there is a next point...
				if ( this.points[ i + 1 ] ) {

					// Compute distance and bearing between the current and next point:
					d = this.getDistance( this.points[ i ], this.points[ i + 1 ] );
					b = this.getBearing( this.points[ i ], this.points[ i + 1 ] );

					// Add the distance to the total distance:
					this.distance += d;

					// Using the results, push a new object to the points array:
					geometry.vertices.push( new Three.Vector3(
						geometry.vertices[ i ].x - d * ( Math.cos( b )),
						geometry.vertices[ i ].y + d * ( Math.sin( b )),
						this.points[ i + 1 ].ele
					));
				}
			}
			return geometry;
		},
		round( value, places ) {
			return Number( Math.round( value + 'e' + places ) + 'e-' + places );
		},
		toRadians( value ) {
			return Number( value * ( Math.PI / 180 ));
		},
		toDegrees() {
			// TODO: Add this function, even though it's not needed...?
		},
		getDistance( p1, p2 ) {
			/*
				NOTE: This uses the haversine formula. Other implementations are
				possible. In the future, the user can choose which option the loader
				uses. This will also be related to whether the user intends to preserve
				the spherical nature of the coordinates, or project them as a map.
			*/

			var R = 6371e3; // metres
			var φ1 = p1.lat;
			var φ2 = p2.lat;
			var Δφ = p2.lat - p1.lat;
			var Δλ = p2.lon - p1.lon;

			var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

			var d = R * c;
			return d;
		},
		getBearing( p1, p2 ) {
			var y = Math.sin( p2.lon - p1.lon ) * Math.cos( p2.lat );
			var x = Math.cos( p1.lat ) * Math.sin( p2.lat ) - Math.sin( p1.lat ) * Math.cos( p2.lat ) * Math.cos( p2.lon - p1.lon );
			var brng = Math.atan2( y, x );
			return brng;
		}
	};
};
