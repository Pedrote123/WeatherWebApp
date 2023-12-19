document.addEventListener('DOMContentLoaded', ()=>{

    const day = new Date()
    const hour = day.getHours()

    var urlCountries = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json'
    var urlStates = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json'

    var body = document.querySelector('body')
    var divSelector = document.querySelector('.divSelector')
    var point = document.querySelector('.points')
    var option = document.querySelector('#selector')
    var option2 = document.querySelector('#selector2')

    if (hour >= 17 || hour <= 5){
        body.classList.add('night')
        divSelector.classList.add('night')
        point.classList.add('night')
    } else if (hour >= 12 && hour < 17){
        body.classList.add('midday')
        divSelector.classList.add('midday')
        point.classList.add('midday')
    }


    var CountryCode;
    fetch(urlCountries)
    .then(response => {return response.json()})
    .then(data => {
        data.forEach((i) => {
            var CountryOption = document.createElement('option')
            CountryOption.innerText = i.name
            option.appendChild(CountryOption)
        })
        return data
    })
    .then(Datass => {
        var selectedOption = option.options[option.selectedIndex];

        CountryCode = Datass.filter(cc => cc.name == selectedOption.innerText)
        CountryCode = CountryCode[0].iso2
        fetch(urlStates)
        .then(response => {return response.json()})
        .then(data => {
            var selectedOption2 = option2.options[option2.selectedIndex];

            var filteredData = data.filter(st => st.country_code == CountryCode)
            filteredData.forEach((j) => {
                var StateOption = document.createElement('option')
                StateOption.innerText = j.name
                option2.appendChild(StateOption)
                StateOption.classList.add('option' + selectedOption.innerText)
                StateOption.dataset.latitude = j.latitude
                StateOption.dataset.longitude = j.longitude
            })
            

            option.addEventListener('change', (e)=>{
                e.preventDefault();
                option2 = document.querySelector('#selector2')
                selectedOption = option.options[option.selectedIndex];
                selectedOption2 = option2.options[option2.selectedIndex];
                CountryCode = Datass.filter(cc => cc.name == selectedOption.innerText)
                CountryCode = CountryCode[0].iso2
                filteredData = data.filter(st => st.country_code == CountryCode)    

                for (let i = option2.options.length - 1; i >= 0; i--) {
                    option2.remove(i);
                }
                filteredData.forEach((j) => {
                    StateOption = document.createElement('option')
                    StateOption.innerText = j.name
                    StateOption.classList.add('option' + selectedOption.innerText.replace(/ /g, '_'));
                    StateOption.dataset.latitude = j.latitude;
                    StateOption.dataset.longitude = j.longitude;

                    option2.appendChild(StateOption);
                })
            })
            return filteredData
        })
        .then(datass => {
            option.addEventListener('change', (e)=>{
                var selectedOption2 = option2.options[option2.selectedIndex];
                e.preventDefault()
                var latitude = selectedOption2.dataset.latitude;
                var longitude = selectedOption2.dataset.longitude;
                var urlWeather = 'https://api.open-meteo.com/v1/forecast?latitude='+ latitude +'&longitude='+ longitude +'&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,cloud_cover,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max&timezone=auto'
                fetch(urlWeather)
                .then(response => {return response.json()})
                .then(data => {
                    google.charts.load('current', {'packages':['corechart']});
                    google.charts.setOnLoadCallback(() => drawChart(data));
                    if (document.querySelector('img')){
                        var image = document.querySelector('img')
                        if (data.current.cloud_cover > 50){
                            if (data.current.rain > 0){
                                image.setAttribute('src', 'weather/cloudyRain.png')
                            }
                            else{
                                image.setAttribute('src', 'weather/cloudy.png')
                            }
                        }
                        else{
                            if (data.current.rain > 0){
                                image.setAttribute('src', 'weather/rainy.png')
                            }
                            else{
                                image.setAttribute('src', 'weather/sun.png')
                            }

                        }
                    }
                    if (document.querySelector('#Temperature')){
                        var temp = document.querySelector('#Temperature')
                        temp.innerHTML = data.current.temperature_2m + data.current_units.temperature_2m
                    }
                    if (document.getElementById('Variations')){
                        document.getElementById('Variation0').innerHTML = 'Humidity: ' + data.current.relative_humidity_2m + data.current_units.relative_humidity_2m;
                        document.getElementById('Variation1').innerHTML = 'Wind: ' + data.current.wind_speed_10m + data.current_units.wind_speed_10m;
                        document.getElementById('Variation2').innerHTML = 'Precipitation probability: ' + data.daily.precipitation_probability_max[0] + data.daily_units.precipitation_probability_max;            
                    }
                })
                option2.addEventListener('change', (e)=> {
                    selectedOption2 = option2.options[option2.selectedIndex];
                    e.preventDefault()
                    console.log(selectedOption2)
                    latitude = selectedOption2.dataset.latitude;
                    longitude = selectedOption2.dataset.longitude;
                    urlWeather = 'https://api.open-meteo.com/v1/forecast?latitude='+ latitude +'&longitude='+ longitude +'&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,cloud_cover,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max&timezone=auto'
                    
                    fetch(urlWeather)
                    .then(response => {return response.json()})
                    .then(data => {
                        console.log(data)
                        google.charts.load('current', {'packages':['corechart']});
                        google.charts.setOnLoadCallback(() => drawChart(data));
                        if (document.querySelector('img')){
                            var image = document.querySelector('img')
                            if (data.current.cloud_cover > 50){
                                if (data.current.rain > 0){
                                    image.setAttribute('src', 'weather/cloudyRain.png')
                                }
                                else{
                                    image.setAttribute('src', 'weather/cloudy.png')
                                }
                            }
                            else{
                                if (data.current.rain > 0){
                                    image.setAttribute('src', 'weather/rainy.png')
                                }
                                else{
                                    image.setAttribute('src', 'weather/sun.png')
                                }

                            }
                        }
                        if (document.querySelector('#Temperature')){
                            var temp = document.querySelector('#Temperature')
                            temp.innerHTML = data.current.temperature_2m + data.current_units.temperature_2m
                        }
                        if (document.getElementById('Variations')){
                            document.getElementById('Variation0').innerHTML = 'Humidity: ' + data.current.relative_humidity_2m + data.current_units.relative_humidity_2m;
                            document.getElementById('Variation1').innerHTML = 'Wind: ' + data.current.wind_speed_10m + data.current_units.wind_speed_10m;
                            document.getElementById('Variation2').innerHTML = 'Precipitation probability: ' + data.daily.precipitation_probability_max[0] + data.daily_units.precipitation_probability_max;            
                        }

                    })  
                })
                
            })

            function drawChart(information) {
                // Sample data for the chart
                var data = google.visualization.arrayToDataTable([
                    ['Temperature', 'Max', 'Min'],
                    [information.daily.time[0].slice(-2), information.daily.temperature_2m_max[0], information.daily.temperature_2m_min[0]],
                    [information.daily.time[1].slice(-2), information.daily.temperature_2m_max[1], information.daily.temperature_2m_min[1]],
                    [information.daily.time[2].slice(-2), information.daily.temperature_2m_max[2], information.daily.temperature_2m_min[2]],
                    [information.daily.time[3].slice(-2), information.daily.temperature_2m_max[3], information.daily.temperature_2m_min[3]],
                    [information.daily.time[4].slice(-2), information.daily.temperature_2m_max[4], information.daily.temperature_2m_min[4]],
                    [information.daily.time[5].slice(-2), information.daily.temperature_2m_max[5], information.daily.temperature_2m_min[5]],
                    [information.daily.time[6].slice(-2), information.daily.temperature_2m_max[6], information.daily.temperature_2m_min[6]]
                ]);
                if (!document.querySelector('.Current')){
                    Current(information)
                }


                var options = {
                    title: 'Next 7 days temperature',
                    vAxis: {title: 'Temperature'},

                    legend: 'top',
                    pointSize: 5, 

                };
    

                var chart = new google.visualization.LineChart(document.getElementById('myChart'));
                chart.draw(data, options);

            }
            function Current(information){
                var CurrentTemperature = document.createElement('div')
                CurrentTemperature.classList.add('Current')
                var points = document.querySelector('.points')
                points.insertBefore(CurrentTemperature, points.firstChild)

                var image = document.createElement('img')
                if (information.current.cloud_cover > 50){
                    if (information.current.rain > 0){
                        image.setAttribute('src', 'weather/cloudyRain.png')
                    }
                    else{
                        image.setAttribute('src', 'weather/cloudy.png')
                    }
                }
                else{
                    if (information.current.rain > 0){
                        image.setAttribute('src', 'weather/rainy.png')
                    }
                    else{
                        image.setAttribute('src', 'weather/sun.png')
                    }

                }
                CurrentTemperature.appendChild(image)
                var temp = document.createElement('p')
                temp.innerHTML = information.current.temperature_2m + information.current_units.temperature_2m
                temp.setAttribute('id', 'Temperature')
                CurrentTemperature.appendChild(temp)


                var variations = document.createElement('ul')
                variations.setAttribute('id', 'Variations')
                for (let i = 0; i < 3; i++){
                    var variation = document.createElement('li')
                    variation.setAttribute('id', 'Variation' + i)
                    variations.appendChild(variation)
                }
                CurrentTemperature.appendChild(variations)
                document.getElementById('Variation0').innerHTML = 'Humidity: ' + information.current.relative_humidity_2m + information.current_units.relative_humidity_2m;
                document.getElementById('Variation1').innerHTML = 'Wind: ' + information.current.wind_speed_10m + information.current_units.wind_speed_10m;
                document.getElementById('Variation2').innerHTML = 'Precipitation probability: ' + information.daily.precipitation_probability_max[0] + information.daily_units.precipitation_probability_max;


            }
        })


    })
})
