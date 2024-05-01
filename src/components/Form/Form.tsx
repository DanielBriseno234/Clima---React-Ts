import { useState } from "react";
import { countries } from "../../data/countries";
import styles from "./Form.module.css"
import { SearchType } from "../../types";
import Alert from "../Alert/Alert";

type FormProps = {
    fetchWeather : (search: SearchType) => Promise<void>
}

export default function Form( {fetchWeather} : FormProps ) {

    const [search, setSearch] = useState<SearchType>({
        city: '',
        country: ''
    })

    const [alert, setAlert] = useState('')

    const handleChange = ( e : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> ) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if( Object.values(search).includes('') ){
            setAlert('Todos los campos son obligatorios')
            return
        }

        fetchWeather(search)
    }

  return (
    <form 
        className={styles.form}
        onSubmit={handleSubmit}
    >
        { alert && <Alert>{alert}</Alert> }

        <div className={styles.field}>
            <label htmlFor="city">Ciudad:</label>
            <input 
                id="city"
                type="text" 
                name="city"
                placeholder="Ciudad"
                onChange={handleChange}
            />
        </div>
        <div className={styles.field}>
            <label htmlFor="country">Pais:</label>
            <select 
                id="country"
                name="country"
                onChange={handleChange}
            >
                <option value="">-- Seleccione una opción --</option>
                { countries.map( country => (
                    <option 
                        key={country.code}
                        value={country.code}
                    >
                        {country.name}
                    </option>
                ) ) }
            </select>
        </div>
        <input 
            className={styles.submit}
            type="submit"
            value="Consultar Clima" 
        />
    </form>
  )
}
