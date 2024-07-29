// Establish a connection to the server
const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      socket.emit("send_location", { latitude, longitude });
    },
    (error) => {
      console.error(error.message);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

socket.on("receive_location", (location) => {
  const { id, latitude, longitude } = location;
  map.setView([latitude, longitude]);
  if(markers[id]){
    markers[id].setLatLng([latitude, longitude]);
  } else{
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("disconnected", () => {
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});