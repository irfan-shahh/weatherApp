const cityInput=document.querySelector('.city-input')
const searchBtn=document.querySelector('.search-btn')
const notfoundsection=document.querySelector('.not-found-section-message')
const searchcitysection=document.querySelector('.search-city')
const weatherinfosection=document.querySelector('.weather-info')

const cityTxt=document.querySelector('.city-txt')
const tempTxt=document.querySelector('.temp-txt')
const conditionTxt=document.querySelector('.condition-txt')
const humidityvalueTxt=document.querySelector('.humidity-value-txt')
const windvalueTxt=document.querySelector('.wind-value-txt')
const weathersummaryImg=document.querySelector('.img-wea')
const currentdateTxt=document.querySelector('.current-date-txt')
const forecastitemcontainer=document.querySelector(".forecast-items-container")



const apikey='b1f8f00470277b744a705372a6df3693'

searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim() !== ''){
        updateweatherinfo(cityInput.value)
        cityInput.value=''
        cityInput.blur();
    }

})



cityInput.addEventListener('keydown',(event)=>{
    if(event.key=='Enter' && cityInput.value.trim()!==''){
        updateweatherinfo(cityInput.value)
        cityInput.value=''
        cityInput.blur();

    }
})
function getweathericon(id){
    if(id <= 232) return 'thunderstorm.png'
    if(id <= 321) return 'fog.png'
    if(id <= 531) return 'rain.png'
    if(id <= 662) return 'snow.png'
    if(id <= 781) return 'hurricane.png'
    if(id <= 800) return 'sun.png'
    else return 'clouds.png'
}

function getCurrentDate(){
    const currentdate=new Date();
    const options={
                  weekday:'short',
                   day: '2-digit',
                   month:'short'
    }
    return currentdate.toLocaleDateString('en-GB',options)

}


    async function fetchdata(endPoint,city){

     const apiURL=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`
     let response=  await fetch(apiURL);
     return response.json();
    }


    async function updateweatherinfo(city){
       const weatherdata= await fetchdata('weather',city)
       if(weatherdata.cod!=200){
        showdisplaysection(notfoundsection)
        return
       }
       
     

        const {
            name:country,
            weather:[{id,main}],
            main:{temp,humidity},
            wind:{speed}
        }=weatherdata;

        cityTxt.textContent=country;
        tempTxt.textContent=Math.round(temp )+ '°C';
        conditionTxt.textContent=main;
        humidityvalueTxt.textContent=humidity+ '%'
        windvalueTxt.textContent=speed+ 'm/s'
        currentdateTxt.textContent=getCurrentDate();
        weathersummaryImg.src=`images/${getweathericon(id)}`

        showdisplaysection(weatherinfosection)
        await getforecastdata(city)
       

    }
    async function getforecastdata(city) {
        const forecastdata= await fetchdata('forecast',city)
        const timetaken='12:00:00'
        const todaydate=new Date().toISOString().split('T')[0];
        forecastdata.list.forEach((forecastweather)=>{
            if(forecastweather.dt_txt.includes(timetaken) && !forecastweather.dt_txt.includes(todaydate)){
                updateforecastitems(forecastweather)
            }

            
        })
       
    }
    forecastitemcontainer.innerHTML = '';

    function updateforecastitems(weatherdata){
        console.log(weatherdata)
        const {
            dt_txt:date,
            weather:[{id}],
            main:{temp}
        
        
            
        }=weatherdata

        const datetaken=new Date(date);
        const dateoptions={
            weekday:'short',
             day: '2-digit',
             month:'short'
}
        const dateresult=datetaken.toLocaleDateString('en-GB',dateoptions)


        const forecastItem=`
           <div class="forecast-item">
            <h5 class="forecast-date regular-txt">${dateresult}</h5>
            <img class=" forecast-item-img" src="images/${getweathericon(id)}" alt="">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>`

        forecastitemcontainer.insertAdjacentHTML('beforeend',forecastItem)
    }



    function showdisplaysection(section){
       [weatherinfosection, notfoundsection, searchcitysection].forEach(section=>
        section.style.display='none')
        section.style.display='flex';
    }