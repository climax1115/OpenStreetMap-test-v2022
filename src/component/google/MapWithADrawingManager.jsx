import React, { createRef, useState, useRef } from "react";
import { useEffect } from "react";

const { compose, withProps } = require("recompose");

const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon,
} = require("react-google-maps");
const {
  DrawingManager,
} = require("react-google-maps/lib/components/drawing/DrawingManager");

const MapWithADrawingManager = compose(
  withProps({
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `70vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const { polygon, zoom, center, onChange, onZoomChange, onCenterChange } =
    props;
  const mapRef = useRef(null);
  // useEffect(() => {
  //   try {
  //     console.log(mapRef);
  //     mapRef.panTo(new window.google.maps.LatLng(center.lat, center.lng));
  //     console.log("center changed");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [center]);
  function handleZoomChanged() {
    onZoomChange(this.getZoom());
  }
  function handleCenterChanged() {
    // console.log(this.getCenter().lat()); //this refers to Google Map instance
    onCenterChange({
      lat: this.getCenter().lat(),
      lng: this.getCenter().lng(),
    });
  }
  let defaultCenter = center
    ? center
    : new window.google.maps.LatLng(51.5074, 0.1278);
  // new window.google.maps.LatLng(51.5074, 0.1278)

  return (
    <GoogleMap
      defaultZoom={zoom}
      center={defaultCenter}
      // defaultCenter={defaultCenter}
      onZoomChanged={handleZoomChanged}
      onCenterChanged={handleCenterChanged}
      ref={mapRef}
    >
      {/* {console.log(props)} */}
      {polygon.length == 0 && (
        <DrawingManager
          defaultDrawingMode={window.google.maps.drawing.OverlayType.POLYGON}
          onCircleComplete={(e) => {
            console.log(e);
          }}
          drawingMode={null}
          onOverlayComplete={(e) => {
            // console.log(e);
            e.overlay.setMap(null); //delete newly made shape. as we already sabed its polygon
          }}
          onPolygonComplete={(e) => {
            let coordinates = [];
            for (var i = 0; i < e.getPath().getLength(); i++) {
              // console.log(e);
              coordinates.push({
                lat: e.getPath().getAt(i).lat(),
                lng: e.getPath().getAt(i).lng(),
              });
            }
            onChange(coordinates);
          }}
          defaultOptions={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                // window.google.maps.drawing.OverlayType.CIRCLE,
                window.google.maps.drawing.OverlayType.POLYGON,
                // window.google.maps.drawing.OverlayType.POLYLINE,
                // window.google.maps.drawing.OverlayType.RECTANGLE,
              ],
            },
            circleOptions: {
              fillColor: `#ffff00`,
              fillOpacity: 1,
              strokeWeight: 5,
              clickable: false,
              editable: true,
              zIndex: 1,
            },
            polygonOptions: {
              fillColor: `#ffff00`,
              fillOpacity: 0.5,
              strokeWeight: 5,
              clickable: false,
              editable: true,
              zIndex: 1,
            },
          }}
        />
      )}
      {polygon.length > 0 && <Polygon path={polygon}></Polygon>}
    </GoogleMap>
  );
});

export default MapWithADrawingManager;
