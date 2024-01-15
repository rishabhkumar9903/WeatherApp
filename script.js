const userTab = document.querySelector("[dataUserTab]")
const searchTab = document.querySelector("[dataSearchTab]")
const searchForm = document.querySelector("[dataSearchform]")
const loadingScreen = document.querySelector(".loading-screen")
const grantAccessContainer = document.querySelector("[dataGrantAccessContainer]");
const userWeatherInfoContainer = document.querySelector("[dataUserWeatherInfo]");
const grantAccessButton = document.querySelector("[dataGrantAccessButton]");



const API_KEY = "6fa844a003a1e12a8e9355ed7b7dfc5d";

let currentTab = userTab;
currentTab.classList.add("current-tab");


function switchTab(switchedTab){

    if(currentTab!=switchedTab)
    {
        currentTab.classList.remove("current-tab");
        switchedTab.classList.add("current-tab");
        currentTab=switchedTab;


        if(!searchForm.classList.contains("active")){
            userWeatherInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }else{
            searchForm.classList.remove("active");
            //grantAccessContainer.classList.add("active");
            userWeatherInfoContainer.classList.remove("active");
            // here i have to do something to show the user weather data
            getFromSessionStorage();
        }

    }
}


userTab.addEventListener('click',()=>switchTab(userTab));
searchTab.addEventListener('click',()=>switchTab(searchTab));

 function getFromSessionStorage()
 {
    const localdata = sessionStorage.getItem("user-coordinates");
    
    if(!localdata)
    {
        grantAccessContainer.classList.add("active");
    }
    else{
        const localcoordinates = JSON.parse(localdata);
        fetchUserWeatherInfo(localcoordinates);
    }
 }


// ********getLocation Means geolocation starts********

function getLocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("Geolocation not supported by the browser");
    }
}

function showPosition(position)
{
    let coordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates",JSON.stringify(coordinates));
    //let {lat,lon} = coordinates;
    fetchUserWeatherInfo(coordinates);
}

// ********getLocation Means geolocation ends********




async function fetchUserWeatherInfo(coordinates)
{
   let {lat,lon} = coordinates;

   userWeatherInfoContainer.classList.remove("active");
   grantAccessContainer.classList.remove("active")
   loadingScreen.classList.add("active");
   try
   {
      
   const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)

   const data = await response.json();

   loadingScreen.classList.remove("active");
   userWeatherInfoContainer.classList.add("active");
   renderOnUI(data);

   }
   catch(err){
      loadingScreen.classList.remove("active");
      console.log("error occured in the API")
   }


}


// function renderOnUI(weatherdata)
// {
//     const cityName = document.querySelector("[dataCityName]");
//     const flagPic = document.querySelector("[cityIconFlag]");
//     const desc = document.querySelector("[dataDescription]");
//     const weatherType = document.querySelector("[dataWeatherType]")
//     const weatherTemp = document.querySelector("[weatherTemp]")
//     const windSpeed = document.querySelector("[dataWindSpeed]")
//     const humidity = document.querySelector("[dataHumidity]")
//     const clouds = document.querySelector("[dataClouds]")

    

//     cityName.innerText = weatherdata?.name;
//     flagPic.src = `https://flagcdn.com/144x108/${weatherdata?.sys?.country.toLowerCase()}.png`;
//     desc.innerText = weatherdata?.weather?.[0]?.description;
//     weatherType.src = `https://openweathermap.org/img/w/${weatherdata?.weather?.[0]?.icon}.png`
//     weatherTemp.innerText = weatherdata?.main?.temp;
//     windSpeed.innerText = `${weatherdata?.wind?.speed}m/s`
//     humidity.innerText = `${weatherdata?.main?.humidity}%`
//     clouds.innerText = `${weatherdata?.clouds?.all}%`

//     loadingScreen.classList.remove("active");
//     userWeatherInfoContainer.classList.add("active");
 


// }


function renderWeatherInfo(weatherInfo) {
    

    const cityName = document.querySelector("[dataCityName]");
    const flagPic = document.querySelector("[cityIconFlag]");
    const desc = document.querySelector("[dataDescription]");
    const weatherType = document.querySelector("[dataWeatherType]")
    const weatherTemp = document.querySelector("[weatherTemp]")
    const windSpeed = document.querySelector("[dataWindSpeed]")
    const humidity = document.querySelector("[dataHumidity]")
    const clouds = document.querySelector("[dataClouds]")

    console.log(weatherInfo);

    
    cityName.innerText = weatherInfo?.name;
    flagPic.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherType.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    weatherTemp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;


}







grantAccessButton.addEventListener("click",getLocation);


const searchButton = document.querySelector("[dataSumitSearch]")
const inputValue = document.querySelector("[datainputSearchForm]")
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let city = inputValue.value;

    if(city==="")
    {
        return;
    }
    //loadingScreen.classList.add("active");
    fetchSearchWeatherInfo(city);

})

async function fetchSearchWeatherInfo(city)
{
  loadingScreen.classList.add("active");
  userWeatherInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
    let ansData = await response.json();
    loadingScreen.classList.remove("active");
    userWeatherInfoContainer.classList.add("active");

    renderOnUI(ansData);

  }
  catch(error)
  {
    alert("Error occured in the Fetch API");
  }

}













