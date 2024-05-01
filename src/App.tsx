import styles from "./App.module.css"
import Alert from "./components/Alert/Alert"
import Form from "./components/Form/Form"
import Spinner from "./components/Spinner/Spinner"
import WeatherDetails from "./components/WeatherDetails/WeatherDetails"
import useWeather from "./hooks/useWeather"

function App() {

  const { weather, loading, notFound, fetchWeather, hasWeather } = useWeather()

  return (
    <>
      <h1 className={styles.title}>Buscador de clima</h1>

      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />

        { loading && <Spinner /> }
        { hasWeather && <WeatherDetails weather={weather}/>}
        { notFound && <Alert>Ciudad no encontrada</Alert> }
      </div>
    </>
  )
}

export default App
