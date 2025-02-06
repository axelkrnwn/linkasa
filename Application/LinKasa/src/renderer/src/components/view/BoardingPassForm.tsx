import { getDatabase, insert } from "@renderer/database/database"
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function BoardingPassForm(props:any):JSX.Element{


  interface Flight{
    id:string,
    src:string,
    srcCode:string,
    dest:string,
    destCode:string,
    date:Date,
  }

  interface Passenger{
    id:string,
    email:string
  }

  const [flights, setFlights] = useState<Flight[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])

  useEffect(() => {
    if (props.isUpdate){
      setFlight(props.b.flightID)
      setFlight(props.b.passengerID)
    }else{
      setFlight(props.flight)
      setPassenger(props.passenger)
    }
  },[])




  useEffect(() => {
    const q = query(collection(getDatabase(),'Passenger'))

    onSnapshot(q, snapshot => {
      // setPassenger(snapshot.docs[0].id);
      setPassengers(snapshot.docs.map(e =>{
        return ({
        id:e.id,
        email:e.data().passengerEmail,
      })}))
    })
  }, [passengers])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Flight'))
    onSnapshot(q, snapshot => {

      // setFlight(snapshot.docs[0].id);
      setFlights(snapshot.docs.map(
        doc =>
        {
          return (
          {
            id:doc.id,
            src:doc.data().source,
            srcCode:doc.data().sourceAirportCode,
            dest:doc.data().destination,
            destCode:doc.data().destAirportCode,
            date:doc.data().flightDate.toDate()
          }
        )}
      ))

    })
  }, [flights])

  const [flight,setFlight] = useState('')
  const [passenger,setPassenger] = useState('')

  const [isLoading, setLoading] = useState(false)
  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>

  const insertBoarding = (e:any) => {
    e.preventDefault()
    setLoading(true)
    console.log(passenger,flight)
    insert('BoardingPass',{flightID:flight, passengerID:passenger})
    setLoading(false)
    props.func()
  }

  const updateBoarding = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    await updateDoc(doc(getDatabase(),'BoardingPass',props.b.id),{
      flightID:flight,
      passengerID:passenger
    })
    setLoading(false)
    props.func()
  }

  return <>
    {isLoading && loading}
    <form  onSubmit={props.isUpdate?updateBoarding:insertBoarding} style={{position:"fixed",backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl h-2/5 z-40">
      <button onClick={() => {props.func()}}>Back</button>
      <h1 className="font-bold text-center">Boarding Pass</h1>
      <h1>Flight</h1>
      <select name="" id="" onChange={e => setFlight(e.target.value)} defaultValue={flight}>
      {flights.map(e =><option key = {e.id} value = {e.id}>{e.src} - {e.dest} at {e.date.getDate()}-{e.date.getMonth() + 1} {e.date.getFullYear()}</option>)}
      </select> <br />
      <h1>Passenger</h1>
      <select name="" id="" onChange={e =>setPassenger(e.target.value)} defaultValue={passenger}>
      {passengers.map(e => <option key = {e.id} value = {e.id}>{e.email}</option>)}
      </select>
      <button type="submit" className="my-4 px-4 bg-green-400 font-bold text-white rounded-lg py-1 w-full">Submit</button>

    </form>

  </>
}
