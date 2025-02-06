import { useEffect, useState } from "react"
import Home from "./Home"
import { getDatabase } from "@renderer/database/database"
import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore"
import { checkUser } from "@renderer/middleware/Middleware"
import Error from "../view/error"
import { NavLink } from "react-router-dom"
import BoardingPassForm from "../view/BoardingPassForm"

export function CheckInHome():JSX.Element{

  const [isCreate, setCreate] = useState(false)
  const [isUpdate, setUpdate] = useState(false)


  interface Flight{
    id:string,
    src:string,
    srcCode:string,
    dest:string,
    destCode:string,
    gate:string,
    date:Date,
    flightClass:string,
    terminal:string
  }

  interface Passenger{
    id:string,
    DOB:Date,
    email:string,
    seat:string
  }
  interface BoardingPass{
    id:string,
    passengerID:string,
    flightID:string
  }

  const [flights, setFlights] = useState<Flight[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [boardingPasses, setBP] = useState<BoardingPass[]>([])


  useEffect(() => {
    const q = query(collection(getDatabase(),'BoardingPass'))

    onSnapshot(q, snapshot => {
      setBP(snapshot.docs.map(e =>{return ({
        id:e.id,
        passengerID:e.data().passengerID,
        flightID:e.data().flightID
      })}))
    })
  }, [boardingPasses])
  useEffect(() => {
    const q = query(collection(getDatabase(),'Passenger'))

    onSnapshot(q, snapshot => {
      setPassengers(snapshot.docs.map(e =>{return ({
        id:e.id,
        email:e.data().passengerEmail,
        DOB:e.data().passengerDOB.toDate(),
        seat:e.data().seatNumber
      })}))
    })
  }, [passengers])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Flight'))
    onSnapshot(q, snapshot => {

      setFlights(snapshot.docs.map(
        doc =>
        (
          {
            id:doc.id,
            src:doc.data().source,
            srcCode:doc.data().sourceAirportCode,
            dest:doc.data().destination,
            destCode:doc.data().destAirportCode,
            flightClass:doc.data().class,
            gate:doc.data().gateNumber,
            date:doc.data().flightDate.toDate(),
            terminal:doc.data().terminal
          }
        )
      ))

    })
  }, [flights])

  const getHour = (hour:number)=> (hour < 10)? '0'+ hour:hour


  const [showFlight, setShowFlight] = useState(true)
  const [showBoarding, setShowBoarding] = useState(false)
  const[b,setB] = useState<BoardingPass>()

  const openFlight = () => {
    setShowFlight(true)
    setShowBoarding(false)
  }
  const openBoarding = () => {
    setShowFlight(false)
    setShowBoarding(true)
  }


  const [isLoading, setLoading] = useState(false)
  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>


  if (checkUser('Check-in Staff')){

  return <div>
    {isLoading && loading}
    {(isUpdate || isCreate) && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-20 t-0 l-0"></div>}
    {(isCreate) && <BoardingPassForm isUpdate = {false} func = {() => setCreate(false)} passenger = {passengers[0].id} flight= {flights[0].id}></BoardingPassForm>}
    {(isUpdate) && <BoardingPassForm isUpdate = {true} func = {() => setUpdate(false)} b = {b}></BoardingPassForm>}
    <Home></Home>
    <div className="flex gap-x-5 px-5 border-y-2 border-solid border-blue-200 py-2">
      <button onClick={openFlight} className={showFlight?'font-bold':''}>Flight</button>
      <button onClick={openBoarding} className={showBoarding?'font-bold':''}>Boarding Pass</button>
    </div>
    {showFlight && flights.map(e => <NavLink to = {`/flight/${e.id}`} key={e.id}>
      <div className="bg-slate-100 m-5 p-3">
        <h1>{e.date.getDate()} - {e.date.getMonth() + 1} {e.date.getFullYear()}</h1>
        <h4>{e.srcCode} - {e.destCode}</h4>
        <h4>{e.src} - {e.dest}</h4>
        <p>Gate Number : {e.gate}</p>
        <p>Class : {e.flightClass}</p>
      </div>
    </NavLink>)
    }
    {showBoarding && <>
      <div className="mx-5">
        <button onClick={() => setCreate(true)} className="my-4 px-6 bg-green-400 font-bold text-white rounded-lg py-1">Create Boarding Pass</button>
        {boardingPasses.map(e =><>
        <div className="bg-white w-full my-3 p-3 shadow-xl">
          <h1 className="font-bold">Boarding {e.id}</h1>
          <div className="flex justify-between">
            <button onClick={() => {
              setB(e)
              setUpdate(true)
            }} className="my-4 px-6 bg-blue-400 font-bold text-white rounded-lg py-1">Update</button>
            <button className="my-4 px-6 bg-red-400 font-bold text-white rounded-lg py-1" onClick={async () => {setLoading(true);await deleteDoc(doc(getDatabase(),'BoardingPass',e.id));setLoading(false)}}>Remove</button>
          </div>

          <div className="flex">
            <div className="px-4 border-r-2 border-solid border-slate-400" style={{width:'65%'}}>
              <h1 className="my-3">{passengers.filter(p => p.id === e.passengerID)[0]?.email.slice(0,passengers.filter(p => p.id === e.passengerID)[0].email.lastIndexOf('@')).replace('.','/')}</h1>
              <div className="flex gap-x-10 justify-between">
                <div>
                  <h1 className="font-bold">Flight</h1>
                  <h1>{e.flightID}</h1>
                </div>
                <div>
                  <h1 className="font-bold">Boarding Time</h1>
                  <h1>{getHour(flights.filter(f => f.id === e.flightID)[0].date.getHours())}:{getHour(flights.filter(f => f.id === e.flightID)[0].date.getMinutes())}</h1>
                </div>
                <div>
                  <h1 className="font-bold">Gate</h1>
                  <h1>{flights.filter(f => f.id === e.flightID)[0].gate}</h1>
                </div>
                <div>
                  <h1 className="font-bold">Seat</h1>
                  {passengers.filter(f => f.id === e.passengerID)[0]?.seat}
                </div>
              </div>
              <div className="flex gap-x-10 my-3 justify-between">
                <div>
                  <h1 className="font-bold">Route</h1>
                  <h4>{flights.filter(f => f.id === e.flightID)[0].srcCode} - {flights.filter(f => f.id === e.flightID)[0].destCode}</h4>
                </div>
                <div>
                  <h1 className="font-bold">Date</h1>
                     <h1>{getHour(flights.filter(f => f.id === e.flightID)[0].date.getDate())} - {getHour(flights.filter(f => f.id === e.flightID)[0].date.getMonth() + 1)} {flights.filter(f => f.id === e.flightID)[0].date.getFullYear()}</h1>
                </div>
                <div>
                  <h1 className="font-bold">Departure</h1>
                  <h1>{getHour(new Date(flights.filter(f => f.id === e.flightID)[0].date.getTime() + 1000*60*30).getHours())}:{getHour(new Date(flights.filter(f => f.id === e.flightID)[0].date.getTime() + 1000*60*30).getMinutes())}</h1>
                </div>
                <div>
                  <h1 className="font-bold">Terminal</h1>
                  <h1>{flights.filter(f => f.id === e.flightID)[0].terminal}</h1>
                </div>
              </div>
              <h1 className="font-bold my-3">Please Be At The Boarding Gate 30 Mins Prior to Departure. Gate Closes 10 Mins Before.</h1>
            </div>
            <div className="px-4">
              <div>
                <h1 className="font-bold">{flights.filter(f => f.id === e.flightID)[0].flightClass}</h1>
                <p className="mt-3">{passengers.filter(p => p.id === e.passengerID)[0]?.email.slice(0,passengers.filter(p => p.id === e.passengerID)[0].email.lastIndexOf('@')).replace('.','/')} </p>
                <p className="text-xs">{e.passengerID}</p>
                <div className="flex justify-between mt-3">
                <div>
                  <h1 className="font-bold text-sm">Flight</h1>
                  <h1 className="text-xs">{e.flightID}</h1>
                </div>
                <div>
                  <h1 className="font-bold text-sm">Boarding Time</h1>
                  <h1 className="text-xs text-right">{getHour(flights.filter(f => f.id === e.flightID)[0].date.getHours())}:{getHour(flights.filter(f => f.id === e.flightID)[0].date.getMinutes())}</h1>
                </div>
                </div>
                <div className="flex justify-between gap-x-10">
                <div>
                  <h1 className="font-bold">Gate</h1>
                  <h1 className="text-xs">{flights.filter(f => f.id === e.flightID)[0].gate}</h1>
                </div>
                <div>
                  <h1 className="font-bold">Seat</h1>
                  <h1 className="text-xs">
                  {passengers.filter(f => f.id === e.passengerID)[0]?.seat}
                  </h1>
                </div>
                </div>
                <div className="flex justify-between">
                <div>
                  <h1 className="font-bold">Route</h1>
                  <h4 className="text-xs">{flights.filter(f => f.id === e.flightID)[0].srcCode} - {flights.filter(f => f.id === e.flightID)[0].destCode}</h4>
                </div>
                <div>
                  <h1 className="font-bold text-right">Date</h1>
                     <h1 className="text-xs">{getHour(flights.filter(f => f.id === e.flightID)[0].date.getDate())} - {getHour(flights.filter(f => f.id === e.flightID)[0].date.getMonth() + 1)} {flights.filter(f => f.id === e.flightID)[0].date.getFullYear()}</h1>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>)}
      </div>
    </>}
  </div>
  }else{
    return <Error value = 'youre not authorized'></Error>
  }
}

export default CheckInHome
