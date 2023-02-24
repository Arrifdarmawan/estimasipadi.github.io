var map, featureList, Fase_Tumbuh_AsliSearch = [], SAMPEL_FTSearch = [], SAMPEL_PRODSearch = [], ADMIN_KAB_LINESearch = [], ADMIN_KECSearch = [], JALANSearch = [], SUNGAISearch = [], REL_KASearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

/* Button */
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(Sawah.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#downloaddata-btn").click(function() {
  $("#downloaddataModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through SAMPEL_FT layer and add only features which are in the map bounds */
  SAMPEL_FT.eachLayer(function (layer) {
    if (map.hasLayer(SAMPEL_FTLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-Nama">' + layer.feature.properties.Nama + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through SAMPEL_PROD layer and add only features which are in the map bounds */
  SAMPEL_PROD.eachLayer(function (layer) {
    if (map.hasLayer(SAMPEL_PRODLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-Nama">' + layer.feature.properties.Nama + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNama: ["feature-Nama"]
  });
  featureList.sort("feature-Nama", {
    order: "asc"
  });
}

/* Basemap Layers */
var basemap0 = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3'],
	attribution: '&copy;Google Streets'
});
var basemap1 = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3'],
	attribution: '&copy;Google Satellite'
});
var basemap2 = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3'],
	attribution: '&copy;Google Terrain'
});
var basemap3 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy;Open Street Map'
});

/* Overlay Layers Highlight */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

/* Marker cluster layer to hold all clusters */
var pointkabkotClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 15
});

/* Titik Kabupaten/Kota */
var pointkabkot = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/bubble_green32.png",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.KAB_KOTA,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Kabupaten/Kota</th><td>" + feature.properties.KAB_KOTA + "</td></tr>" + "<tr><th>Provinsi</th><td>" + feature.properties.PROVINSI + "</td></tr>" + "<tr><th>Logo</th><td><img src='" + feature.properties.LOGO + "' width='100' alt='Logo'></td></tr>" + "</table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.KAB_KOTA);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
    }
  }
});
$.getJSON("data/SAMPEL_FT.geojson", function (data) {
  pointkabkot.addData(data);
  pointkabkotClusters.addLayer(pointkabkot);
});

/* Jalan Utama */
var jalanutamaColors = {"Jalan Arteri":"3", "Jalan Kolektor":"1"};
var jalanutama = L.geoJson(null, {
  style: function (feature) {
      return {
        color: "red",
        weight: jalanutamaColors[feature.properties.KETERANGAN],
        opacity: 1
      };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Panjang Meter</th><td>" + feature.properties.PANJANG_M + "</td></tr>" + "<tr><th>Panjang Kilometer</th><td>" + feature.properties.PANJANG_KM + "</td></tr>" + "<tr><th>Kondisi</th><td>" + "-" + "</td></tr>" + "</table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.KETERANGAN);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        jalanutama.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/jalan_utama_diy_line.geojson", function (data) {
  jalanutama.addData(data);
  map.addLayer(jalanutama);
});

/* Layer Sungai */
var sungaibesarColors = {"Sungai":"lightblue", "Gosong Sungai":"gray"};
var sungaibesar = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: sungaibesarColors[feature.properties.KETERANGAN],
	  fillOpacity: 0.7,
	  color: "blue",
	  weight: 0.5,
      opacity: 1,
	  smoothFactor: 0,
      clickable: false
    };
  }
});
$.getJSON("data/sungai_besar_diy_polygon.geojson", function (data) {
  sungaibesar.addData(data);
});

/* Layer Sawah */
var SawahColors = {"Mature Grain":"#bd0026", "Tillering":"#fd8d3c", "Flowring":"#ffffb2"};
var Sawah = L.geoJson(null, {
  style: function (feature) {
    return {
      fillColor: SawahColors[feature.properties.Fase_Tumbu],
	  fillOpacity: 0.7,
	  color: "gray",
	  weight: 1,
      opacity: 1,
	  smoothFactor: 0,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
	layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 2,
          fillColor: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        Sawah.resetStyle(e.target);
      }
    });
	if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Fase Tumbuh</th><td>" + feature.properties.Fase_Tumbu + "</td></tr>" + "<tr><th>Waktu Panen</th><td>" + feature.properties.Estimasi + " Lagi</td></tr>" + "<tr><th>Tanggal Estimasi</th><td>" + feature.properties.PerTGL + "</td></tr>" +  "<tr><th>Luas Panen</th><td>" + feature.properties.Luas + " Ha</td></tr>" +"<tr><th>Produksi</th><td>" + feature.properties.Produksi + " Kw</td></tr>"+ "</table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("Estimasi Fase Tumbuh " + feature.properties.Fase_Tumbu);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
	}
  }
});
$.getJSON("data/SAWAH.geojson", function (data) {
  Sawah.addData(data);
  map.addLayer(Sawah);
});

/* Map Center */
var map = L.map('map', {
  zoom: 20,
  center: [-7.682,110.864],
  layers: [basemap2, pointkabkotClusters, highlight],
  zoomControl: false,
  attributionControl: true
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

const newLocal = '<a href="https://www.instagram.com/arrifdarmawan/" target="_blank">Arif Darmawan</a>';
/* Attribution control */
map.attributionControl.addAttribution(newLocal);

/* Zoom control position */
var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "Lokasi saya",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Google Streets": basemap0,
  "Google Satellite": basemap1,
  "Google Terrain": basemap2,
  "Open Street Map": basemap3
};

var groupedOverlays = {
  "Titik (Point)": {
	"Kabupaten/Kota": pointkabkotClusters
  },
  "Garis (Line)": {
	"Jalan Utama": jalanutama
  },
  "Area (Polygon)": {
	"Sungai Besar": sungaibesar,
	"Sawah": Sawah
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Progress Bar */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to layer bounds */
  map.fitBounds(Sawah.getBounds());
});

/* Leaflet patch to make layer control scrollable on touch browsers */
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

/* ScaleBar */
L.control.betterscale({
	metric: true,
	imperial: false
}).addTo(map);

/* Logo watermark */
L.Control.Watermark = L.Control.extend({
	onAdd: function(map) {
		var img = L.DomUtil.create('img');
		img.src = 'assets/img/UMS.png';
		img.style.width = '50px';
			return img;
	},
	onRemove: function(map) {
		// Nothing to do here
	}
});

L.control.watermark = function(opts) {
	return new L.Control.Watermark(opts);
}

L.control.watermark({ position: 'bottomleft' }).addTo(map);