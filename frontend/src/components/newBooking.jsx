import { useState } from "react";

const NewBooking = () => {
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const booking = {fullname, email, password}

        const response = await fetch('/api', {
            method: 'POST',
            body: JSON.stringify(booking),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setFullname('')
            setEmail('')
            setPassword('')
            setError(null)
            console.log('New booking made', json)
        }
   }

    return (
        <form onSubmit={handleSubmit} className="create">
            <h3>Make a new booking</h3>
            <label>Fullname:</label>
            <input type="text" onChange={(e) => setFullname(e.target.value)} value={fullname}/>

            <label>Email:</label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} value={email}/>

            <label>Password:</label>
            <input type="text" onChange={(e) => setPassword(e.target.value)} value={password}/>
        </form>
    )
}

export default NewBooking