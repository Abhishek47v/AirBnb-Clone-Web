mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat].note that first lan and then lat will be written.
    zoom: 8 // starting zoom
});
const marker1 = new mapboxgl.Marker({color : "red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25}).setHTML(`<h5>${listing.title}</h5><p>You are here !</p>`))
.addTo(map);