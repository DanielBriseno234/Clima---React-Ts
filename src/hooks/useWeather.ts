import axios from "axios"
import { z } from "zod"
// import { string, number, object, Output, parse } from "valibot"
import { SearchType } from "../types"
import { useMemo, useState } from "react"

// //Type Guards
// function isWeatherResponse( weather : unknown ) : weather is Weather {
//     return (
//         Boolean(weather) &&
//         typeof weather === 'object' &&
//         typeof (weather as Weather).name ===  'string' && 
//         typeof (weather as Weather).main.temp ===  'number' && 
//         typeof (weather as Weather).main.temp_max ===  'number' && 
//         typeof (weather as Weather).main.temp_min ===  'number' 
//     )
// }

// Zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})
export type Weather = z.infer<typeof Weather>

// // Valibot
// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// })
// type Weather = Output<typeof WeatherSchema> 

const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_min: 0,
        temp_max: 0
    }
}

export default function useWeather () {

    const [weather, setWeather] = useState<Weather>(initialState)

    const [loading, setLoading] = useState(false)

    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async ( search: SearchType ) => {
        
        try {
            setWeather(initialState)
            setLoading(true)
            setNotFound(false)
            const apiKey = import.meta.env.VITE_API_KEY
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiKey}`
            
            const { data } = await axios.get(geoUrl)

            if( !data[0] ){
                setNotFound(true)
                return
            }
            const lat = data[0].lat
            const lon = data[0].lon

            const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`

            // //La menos optima de tipar los datos de una api
            // const { data : weatherResults } = await axios.get<Weather>(urlWeather)            
            // console.log(weatherResults.name)
            // console.log(weatherResults.main.temp)

            // //La segunda forma es con type Guards
            // const { data : weatherResults } = await axios.get(urlWeather)
            // const results = isWeatherResponse(weatherResults)
            // if( results ){
            //     console.log(weatherResults.name)
            // }else{
            //     console.log("Respuesta mal formada")
            // }

            //La trcera forma es utilizar la libreria Zod
            const { data : weatherResults } = await axios.get(urlWeather)
            const results = Weather.safeParse(weatherResults)
            if( results.success ){
                setWeather(results.data)
            }

            // //La cuarta es con valibot
            // const { data : weatherResults } = await axios.get(urlWeather)
            // const results = parse(WeatherSchema, weatherResults)
            // if (results){
            //     console.log(results.name)
            // }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const hasWeather = useMemo( () => weather.name , [weather] )
    
    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeather
    }
} 