
import { useEffect, useState } from "react"
import NewBooking from "../components/newBooking"

export default function Home() {

    const [bookings, setBookings] = useState(null)

    useEffect(() => {
        const fecthBooking = async () => {
            const response = await fetch('/api')
            const json = await response.json()

            if (response.ok) {
                setBookings(json)
            }
        }
        fecthBooking()
    }, [])

    return (
        <>
        <div>
        <header>
            <div>
                <ul>
                    <li>
                        <a aria-current="page" href="Home">Home</a>
                    </li>
                    <li>
                        <a href="Setting">Settings</a>
                    </li>
                    <li>
                        <a href="Login">Logout</a>
                    </li>
                </ul>
            </div>
        </header>
        <main>
            <div>
                <div><h5>Book a time (.max for 3 hrs)</h5></div>
                <div><input type="date" /></div>
                <div><input type="time" /></div><br />
                <div>
                    <button >Save</button>
                </div>
            </div>
        </main>
        <div>kush.agv@gmail.com</div>
        <div className="bookings">
            {bookings && bookings.map((booking) => (
                <p key={booking._id}>{booking.fullname}</p>
            ))}
        </div>
        <NewBooking />
    </div>
        </>
    )
};