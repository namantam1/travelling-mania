export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicmFqMTEwMSIsImEiOiJjbDVwbjkzbWcxcGRuM2pzeDFkeGdlZ2gxIn0.6GheOmw-yTXaW5fvroENEQ';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/raj1101/cl5q5pmn500bv14pvqi91z03q', // style URL
    scrollZoom: false,
    //   zoom: 10, // starting zoom
    //     center: [-118.113491, 34.111745],
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create markers
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include current locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
