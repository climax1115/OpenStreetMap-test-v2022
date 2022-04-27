import React, { useEffect, useState } from "react";
import { Map, TileLayer, FeatureGroup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";
import { Button, Grid, Typography, Box } from "@mui/material";
import { useUser } from "../../Hooks/User";
import { toast } from "react-toastify";
import { Popup } from "react-leaflet";
const Leaflet = ({ setScreen }) => {
  const { user, setUser } = useUser();
  console.log("user3 ", user);
  // const { polygon, setPolygon } = useState(null);
  var polygon = null;
  useEffect(() => {
    console.log(user);
    setMarker(user.officeLocation ? user.officeLocation : [37.8189, -122.4786]);
  }, [user.officeLocation]);

  const [marker, setMarker] = useState(
    user.officeLocation ? user.officeLocation : [37.8189, -122.4786]
  );
  const [editableFG, setEditableFG] = useState(null);
  const icon = L.icon({ iconUrl: "/marker-icon.png" });
  const onCreated = (e) => {
    console.log(e);
    console.log(editableFG);

    const drawnItems = editableFG.leafletElement._layers;
    console.log(drawnItems);
    if (Object.keys(drawnItems).length > 1) {
      Object.keys(drawnItems).forEach((layerid, index) => {
        if (index == 0 || index == 1) {
          if (index == 1) {
            let latlng = drawnItems[layerid]._latlngs[0];
            let d = [];
            Object.keys(latlng).forEach((data, i) => {
              d.push({ lat: latlng[data].lat, lng: latlng[data].lat });
            });
            polygon = d;
            // setUser({ ...user, polygon: latlngs });
          }
          return;
        }
        const layer = drawnItems[layerid];
        editableFG.leafletElement.removeLayer(layer);
      });
    }
    console.log(drawnItems);
  };
  const onDeleted = (e) => {
    console.log(e);
    console.log(editableFG);

    const drawnItems = editableFG.leafletElement._layers;
    console.log(drawnItems);
    if (Object.keys(drawnItems).length > 2) {
      Object.keys(drawnItems).forEach((layerid, index) => {
        if (index == 0 || index == 1) {
          // const latlngs = drawnItems[layerid]._latlngs[0];
          // setPolygon(latlngs);
          // setUser({ ...user, polygon: latlngs });
          return;
        }
        const layer = drawnItems[layerid];
        editableFG.leafletElement.removeLayer(layer);
      });
      console.log(drawnItems);
    }
  };

  const onFeatureGroupReady = (reactFGref) => {
    // store the ref for future access to content
    setEditableFG(reactFGref);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <Typography variant="h6">Where is your office</Typography>
        <Button
          variant="contained"
          onClick={() => {
            console.log(polygon);
            if (!polygon) {
              toast.error("Draw your office location");
            } else {
              setUser({ ...user, polygon: polygon });
              console.log(user);
              toast.success("Form submitted successfully");
              setScreen(2);
            }
          }}
        >
          Submit
        </Button>
      </div>

      <Map
        center={marker}
        zoom={13}
        style={{ height: "90vh", margin: "10px" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup
          ref={(featureGroupRef) => {
            onFeatureGroupReady(featureGroupRef);
          }}
        >
          <EditControl
            position="topright"
            draw={{
              rectangle: false,
              circle: false,
              polyline: false,
              circlemarker: false,
              marker: false,
              deletelayers: false,
            }}
            edit={{
              edit: false,
              remove: false,
            }}
            onCreated={onCreated}
            // onDeleted={onDeleted}
          />
          <Marker position={marker} icon={icon}>
            <Popup>
              Email: {user.email} <br />
              Name: {user.name} <br />
              City: {user.city} <br />
              State: {user.stateOfAddress} <br />
            </Popup>
          </Marker>
        </FeatureGroup>
      </Map>
    </>
  );
};

export default Leaflet;
