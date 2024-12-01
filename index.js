import { CONFIG } from "./config.js";
const form = document.querySelector(".form");
const inputIp = document.querySelector(".inputIp");
const mapContainer = document.getElementById("map");
const dataContainer = document.querySelector(".data-container");
let ip = "192.212.174.101";
let map = L.map(mapContainer);
let info = {};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputIp.value.length < 1) {
    alert("inserta una ip");
    return;
  }
  ApiPetition(inputIp.value);
  e.target.reset();
});

async function ApiPetition(dataIp = localStorage.getItem("ip") || ip) {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${CONFIG.API_KEY}&ipAddress=${dataIp}`
    );
    // console.log(response);
    if (!response.ok) {
      let error = new Error("error detected");
      error.stattus = response.status || "000";
      error.stattusText = response.statusText || "ip uncknown";
      throw error;
    }
    const data = await response.json();
    info = { ip: data.ip, isp: data.isp, location: data.location };
    // console.log(info);
    renderData(info);
    showMap(data.location.lat, data.location.lng);
    localStorage.setItem("ip", dataIp);
  } catch (error) {
    // console.log(error);
    errorData(error);
  }
}

function showMap(lat, long) {
  /* creando el mapa
   el setView recibe 2 parametros un array con las cordenadas lattitud y longitud
   respectivamente el segundo parametro es el nivel de zoom

*/
  map.setView([lat, long], 13);

  // creando mosaicos para el mapa
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // agregar un marcador tipo pin
  var marker = L.marker([lat, long]).addTo(map);

  // agregar un marcador tipo circulo
  var circle = L.circle([lat, long], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 500,
  }).addTo(map);
}

function renderData({ ip, isp, location }) {
  dataContainer.innerHTML = `
     <div class = 'info-ip'>
         <div> <span>IP Address<span/> <p>${ip}</p> </div>
         <div> <span>Location</span> <p>${location.city}, ${location.region}</p> </div>
         <div> <span>Timezone </span> <p>UTC ${location.timezone}</p> </div>
         <div> <span>ISP </span> <p>${isp}</p> </div>     
     </div>
   `;
}

function errorData({ message, stattus, stattusText }) {
  console.log(message);
  console.log(stattus);
  console.log(stattusText);
  dataContainer.innerHTML = `
      <div class ='error-message'>
         <div>
            <h1>${message}</h1>
            <h1>${stattus}</h1>
            <h1>${stattusText}</h1>
            </div>
         </div>
      </div>
   `;
}

document.addEventListener("DOMContentLoaded", () => ApiPetition());
document.addEventListener("DOMContentLoaded", () => {
  alert("mira la consola para mas ips");
  console.log("ips : 192.250.123.101;  70.150.100.200; 192.212.174.101");
});

// ips : 192.250.123.101;  70.150.100.200; 192.212.174.101
