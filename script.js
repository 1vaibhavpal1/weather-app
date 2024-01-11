const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorScreen = document.querySelector(".api-error-container");
const APIkey = "168771779c71f3d64106d8a88376808a";
const grantAccessButton = document.querySelector("[data-grantAccess]")

let currTab = userTab;
currTab.classList.add("current-tab");
getFromSessionStorage();
//for switching between tabs
function switchTab(clickedTab) {
    if(clickedTab!==currTab){
        currTab.classList.remove("current-tab");
        currTab = clickedTab;
        currTab.classList.add("current-tab");

        //matlab abhi my weather vala tab khula hai
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            errorScreen.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        //matlab search weather vala tab khula hai
        else{
            errorScreen.classList.remove("active");
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }

}

//to switch to userTab
userTab.addEventListener('click', ()=> {
    switchTab(userTab);
});

//to switch to searchTab
searchTab.addEventListener('click', ()=> {
    switchTab(searchTab);
});

//to check if data is there in session storage or not
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //matlab location ki permission nhi mili hai abhi
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    
    
    const {lat,long} = coordinates;
    //making grant acces screen invisible
    grantAccessContainer.classList.remove("active");
    //making loading screen visible
    loadingScreen.classList.add("active");

    try{
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIkey}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch{
        loadingScreen.classList.remove("active");
        errorScreen.classList.add("active");
    }

}
//api se data nikaalke display me daalna hai
function renderWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-item]")
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText =`${ weatherInfo?.clouds?.all}%`;
}

//when user clicks on 'grant access' button then the value of curretn coords needs to be stored in seessional storage
const messageText = document.querySelector("[data-apiErrorText]")
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    }
    else{
        alert("cant fetch your location");
    }
}
function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }
function showPosition(position){
    const userCordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
    } 
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCordinates));
    fetchUserWeatherInfo(userCordinates);
    renderWeatherInfo()
}

grantAccessButton.addEventListener('click', getLocation);

//Search coountry to function de rhe hain
const searchInput = document.querySelector("[data-searchInp]");

searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let city = searchInput.value;

    if(city==="")
    return;

    else
    fetchSearchWeatherInfo(city);

});

async function fetchSearchWeatherInfo(city){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
        const data = await response.json();
        if(data?.cod == 404){
            loadingScreen.classList.remove("active");
            errorScreen.classList.add("active");
        }
        else{
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
        console.log(data)
        if (!data.sys) {
            throw data;
          }
    }catch(error){
        
        loadingScreen.classList.remove("active");
        errorScreen.classList.add("active");
    }
}




