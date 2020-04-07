// Getting the map
var map = L.map("mapid");
var tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
var tileLayer = L.tileLayer(tileURL).addTo(map);

map.setView([52, 5], 8);


// Creates new Event Listener
map.on('click', mapClick);





function mapClick(e){

    let point = e.latlng;
     
    getCountryName(point.lat, point.lng);

    getCurrentWeather(point.lat, point.lng);
}


// When the page is loaded
window.addEventListener('load', () => {
    // Rotherdam on load default view

    let point = {
        lat: 51.908654,
        lng: 4.471436
    }
    getCountryName(point.lat, point.lng);    
    getCurrentWeather(point.lat, point.lng);
});


/**
 * @param {number} lat 
 * @param {number} lon 
 */
function getCurrentWeather(lat, lon){
    const APPID = "b432b286b3d8beba074a2045c82ee21c";
   
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${APPID}&units=metric`,
        dataType: "JSON",
     
        /**
         * @param {Object} response 
         */
        success: function (response) {

            $("#weather-description").html(response.weather[0].description);
            $("#current-temperature").html(response.main.temp + " C");
            $("#current-wind-speed").html(response.wind.speed + " m/s");
            
            // Get an icon from the img folder
            // $("#weather-icon").attr('src','../img/' + response.weather[0].icon + "@2x.png" );
            
            var iconurl = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

            $("#weather-icon").attr('src', iconurl);
            getForecast(lat, lon);
   },

           
        /**
         * @param {Object} request 
         * @param {String} status
         * @param {String} message 
         */
        error: function(request, status, message){

            $("#message-box-backdrop").fadeIn();
            $("#close-message").on("click", function () {
                $("#message-box-backdrop").fadeOut();
            });
        }
        
    });
}

function getForecast(lat, lon){
    const APPID = "b432b286b3d8beba074a2045c82ee21c";
   
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${APPID}&units=metric`,
        dataType: "JSON",
     
        /**
         * @param {Object} response 
         */
        success: function (response) {
            console.log(response);

            // check if everything is OK
            if(response.cod == 200){
                
                let labels = [];
                let data = [];
                let bckColor = [];

                let list = response.list;
                for (let i = 0; i < response.cnt/4; i++) {

                    data.push(list[i].main.temp);
                    bckColor.push('rgba(216, 100,84, 1)');
                    // Converts to datetime
                    var date = new Date(list[i].dt * 1000);
                    console.log(date.getHours());
                    const days = [
                        'Sun',
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat'
                    ];
                    labels.push(days[date.getDay()] + " " + date.getHours()+":00");
                    
                
                }

                drawChart(labels, data, bckColor);

            }
   },
    error: function(request, status, message){
        
    }
        
    });
}

function drawChart(labels, data, bckColor){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature',
                data: data,
                backgroundColor:bckColor,
                borderWidth: 0,
                pointBackgroundColor: 'rgba(166, 166, 166, 0.9)'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    },
                    drawBorder: false

                }],
                xAxes:[{
                    drawOnChartArea: true,
                    drawBorder: false
                }]
            }
        }
    });
  
}

function getCountryName(lat, lon){
    
    $.ajax({
        url:`https://us1.locationiq.com/v1/reverse.php?key=pk.57995f73cfcd071db18d191591974e1f&lat=${lat}&lon=${lon}&format=json`,
        dataType:"JSON",
        
         
        success: function (response) {

            console.log(response);
            // you can get town name
            $("#location-name").html(response.address.city); 
            $("#pop-location").html(response.address.city); 


            getCovidInformation(response.address.country.replace('The ',''));    
            
            // Pop up
            let popup = L.popup();

            var latlng = L.latLng(lat, lon);
            popup
                .setLatLng(latlng)
                .setContent("You clicked the map at " + response.address.city)
                .openOn(map);

           
    },
        
        error: function(request, status, message){

            $("#message-box-backdrop").fadeIn();
            $("#close-message").on("click", function () {
                $("#message-box-backdrop").fadeOut();
            });
        }
    })
}

/**
 * @param {string} country 
 */
function getCovidInformation(country){
    
  
    $.ajax({
        url:`https://api.covid19api.com/total/country/${country.toLowerCase()}/status/confirmed`,
        dataType:"JSON",
         
        success: function (response) {
          
          // Get the last case 
          let corona = response[response.length - 1];

          $("#corona-location").html(corona.Country); 
          $("#corona-date").html(corona.Date.substring(0, corona.Date.indexOf('T'))); 
          $("#corona-cases").html(corona.Cases); 
        
        
    },
        
        error: function(request, status, message){

            $("#message-box-backdrop").fadeIn();
            $("#close-message").on("click", function () {
                $("#message-box-backdrop").fadeOut();
            });
        }
    });
}
 






