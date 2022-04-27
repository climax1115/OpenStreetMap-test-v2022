import React, { useEffect, useState } from "react";
//import FuseLoading from "../../@fuse/components/FuseLoading/FuseLoading";
// import FuseLoading from "../../../../matx/components/MatxLoading/MatxLoading";
import MapWithADrawingManager from "./MapWithADrawingManager";
// import settingsService from "../../../services/cabify/SettingsService";
const AreaEditor = ({
  polygon = [],
  zoom,
  center = {},
  onChange,
  onZoomChange,
  onCenterChange,
}) => {
  const [apikey, setApikey] = useState(
    "AIzaSyB69ykU1SxJq8y91vq0k9l78lGRLW4YP18"
  );

  return (
    <MapWithADrawingManager
      polygon={polygon}
      onChange={(polygon) => {
        onChange(polygon);
      }}
      onZoomChange={(zoom) => {
        onZoomChange(zoom);
      }}
      onCenterChange={(center) => {
        onCenterChange(center);
      }}
      center={center}
      zoom={zoom}
      googleMapURL={
        "https://maps.googleapis.com/maps/api/js?key=" +
        apikey +
        "&v=3.exp&libraries=geometry,drawing,places"
      }
    />
  );
};

export default AreaEditor;
