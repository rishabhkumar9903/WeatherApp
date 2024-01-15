const userTab = document.querySelector("[dataUserTab]")
const searchTab = document.querySelector("[dataSearchTab]")
const searchForm = document.querySelector("[dataSearchform]")
const loadingScreen = document.querySelector(".loading-screen")
const grantAccessContainer = document.querySelector("[dataGrantAccessContainer]");
const userWeatherInfoContainer = document.querySelector("[dataUserWeatherInfo]");
const grantAccessButton = document.querySelector("[dataGrantAccessButton]");

const errorHandler = document.querySelector(".error-handling");

const API_KEY = "6fa844a003a1e12a8e9355ed7b7dfc5d";



let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(switchedTab){

    if(currentTab!=switchedTab)
    {
        currentTab.classList.remove("current-tab");
        switchedTab.classList.add("current-tab");
        currentTab=switchedTab;

        if(currentTab === searchTab)
        {
            
            searchForm.classList.add("active");
            userWeatherInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            errorHandler.classList.remove("visible");
        }
       else{
        searchForm.classList.remove("active");
        userWeatherInfoContainer.classList.remove("active");
        errorHandler.classList.remove("visible");
        getFromSessionStorage();
       }

        

    }
}

userTab.addEventListener('click',()=>switchTab(userTab));
searchTab.addEventListener('click',()=>switchTab(searchTab));

//********* GEOLOCATION FUNCTION **********/

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
    fetchUserWeatherInfo(coordinates);


}

//********** GEOLOCATION FUNCTION ***********/

grantAccessButton.addEventListener("click",getLocation);



// ********* Search Button Part ********* //

const searchButton = document.querySelector("[dataSumitSearch]")
const inputValue = document.querySelector("[datainputSearchForm]")
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let city = inputValue.value;

    if(city === "")
    {
        return;
    }
    
    fetchSearchWeatherInfo(city);

})



async function fetchSearchWeatherInfo(city)
{
   loadingScreen.classList.add("active");
   userWeatherInfoContainer.classList.remove("active");
   grantAccessContainer.classList.remove("active");
   
  
  try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    // to see the error handling enable the comment from here....

    // const vb = 0;
    // vb.addEventListener("click",()=>"hello")

    // to upto here.....

    let ansData = await response.json();
    console.log("We are in SearchWeatherInfo");
    loadingScreen.classList.remove("active");
    userWeatherInfoContainer.classList.add("active");
    renderOnUI(ansData);

  }
  catch(error)
  {

    loadingScreen.classList.remove("active");
    userWeatherInfoContainer.classList.remove("active");
    searchForm.classList.remove("active");
    errorHandler.classList.add("visible")
    console.log(error);

  }

}

// *********** SearchWeatherOnUI ************//


// *********** UserWeatherInfoData ************* //

async function fetchUserWeatherInfo(coordinates)
{
   let {lat,lon} = coordinates;
   errorHandler.classList.remove("visible");
   loadingScreen.classList.add("active");
   grantAccessContainer.classList.remove("active");
   try
   {
      
   const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
   
   // to see the error handling enable the comment from here to .....
//    const vb = 0;
//    vb.addEventListener("click",()=>"hello")
   // to here.......

   const data = await response.json();


   console.log("We are in fetchUserWeatherInfo")

   console.log(data);

   loadingScreen.classList.remove("active");
   userWeatherInfoContainer.classList.add("active");

   renderOnUI(data);

   }
   catch(err){
      loadingScreen.classList.remove("active");
      errorHandler.classList.add("visible");
      console.log("error occured in the API")
   }


}

//**********showtheSavedData in the Session Storage */

const showSavedData = document.querySelector("[showSavedData]");


function getFromSessionStorage()
{
    const localdata = sessionStorage.getItem("user-coordinates");
    
    if(!localdata)
    {
        grantAccessContainer.classList.add("active");
        console.log("make the grantAccess active because data is not stored in the sessionStorage");
        console.log(localdata);
    }
    else{
        const localcoordinates = JSON.parse(localdata);
        fetchUserWeatherInfo(localcoordinates);
    }
}

//**********showtheSavedData in the Session Storage */


// ********** fetchUserWeatherInfo *********** //

// function renderOnUI(valueData)
// {
//     console.log(valueData);
// }

function renderOnUI(weatherInfo) {
    

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