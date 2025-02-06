import { useEffect, useState } from "react"
import Home from "./Home"
import { getDatabase, insert } from "@renderer/database/database"
import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore"
import { checkUser } from "@renderer/middleware/Middleware"
import Error from "../view/error"
import { NavLink } from "react-router-dom"
import Terminal from '../../assets/terminal.png'

export function FlightOperationHome():JSX.Element{

  const [isCreate, setCreate] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [destCity, setDest] = useState('')
  const [destCode, setCode] = useState('')
  const [flightDate, setFlightDate] = useState(new Date())
  const [flightClass, setClass] = useState('Business')
  const [gate, setGate] = useState('1A')

  interface Flight{
    id:string,
    src:string,
    srcCode:string,
    dest:string,
    destCode:string,
    gate:string,
    date:Date,
    flightClass:string
  }

  const [flights, setFlights] = useState<Flight[]>([])

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
            date:doc.data().flightDate.toDate()
          }
        )
      ))

    })
  }, [flights])


  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>

  const [flight, showFlight] = useState(true)
  const [terminal, showTerminal] = useState(false)

  const openFlight = () => {
    showFlight(true)
    showTerminal(false)
  }
  const openTerminal = () => {
    showFlight(false)
    showTerminal(true)
  }

  const openCreateForm = () => {
    setCreate(true)
  }

  const hideCreateForm = () => {
    setCreate(false)
  }

  const insertNewFlight = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    hideCreateForm()

    await insert('Flight', {
      class:flightClass,
      destAirportCode:destCode,
      destination:destCity,
      gateNumber:gate,
      flightDate:flightDate,
      source:'Jakarta',
      sourceAirportCode:'CGK',
      plane:'',
      terminal:'1'
    })

    setLoading(false)
  }

  const createForm = <form onSubmit={insertNewFlight} style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
    <button onClick={hideCreateForm}>Close</button>
    <h1 className="text-center font-bold">Add a New Flight</h1> <br />
    <label htmlFor="destCity">Destination</label><br />
    <input type="text" name="" id="destCity" className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setDest(e.target.value)} /><br />
    <label htmlFor="destAirportCode">Destination Airport Code</label><br />
    <input onChange={e => setCode(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3" type="text" name="" id="destAirportCode" /><br />

    <label htmlFor="class" >Class</label><br />
    <select name="" id="class" className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setClass(e.target.value)}>
      <option value="Business">Business</option>
      <option value="Economy">Economy</option>
      <option value="First Class">First Class</option>
    </select><br />

    <label htmlFor="date">Flight Date</label><br />
    <input required onChange={e => setFlightDate(new Date(e.target.value))} type="date" name="" id="date" className="border-2 border-solid border-blue-100 rounded-lg my-3"/><br />

    <label htmlFor="gate">Gate Number</label><br />
    <select name="" id="gate" className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setGate(e.target.value)}>
      <option value="1A">1A</option>
      <option value="1B">1B</option>
      <option value="1C">1C</option>
    </select><br />

    <button type="submit" className="bg-green-400 px-2 my-5 text-slate-100 font-bold rounded-lg my-3 w-full">Submit</button>
  </form>

  const removeFlight = async (id:string) => {
    setLoading(true)
    await deleteDoc(doc(getDatabase(),'Flight',id))
    setLoading(false)
  }
  if (checkUser('Flight Operation Manager') || checkUser('Gate Agent') || checkUser('Information Desk Staff') || checkUser('Check-in Staff')){

  return <div>
    {isCreate && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-90 t-0 l-0"></div>}
    <Home></Home>
    <div className="flex gap-x-5 px-10 border-y-2 border-solid border-blue-200 py-2">
      {checkUser('Flight Operation Manager') && <button onClick={openCreateForm}>Create Flight</button>}
      {checkUser('Information Desk Staff') && <button onClick={openFlight} className={flight?'font-bold':''}>Flight</button>}
      {checkUser('Information Desk Staff') && <button onClick={openTerminal} className={terminal?'font-bold':''}>Terminal Maps</button>}
    </div>
    {isLoading && loading}
    {isCreate && createForm}
    {flight && flights.map(e => <NavLink to = {`/flight/${e.id}`} key={e.id}>
      <div className="bg-slate-100 m-5 p-3">
        <h1>{e.date.getDate()} - {e.date.getMonth() + 1} {e.date.getFullYear()}</h1>
        <h4>{e.srcCode} - {e.destCode}</h4>
        <h4>{e.src} - {e.dest}</h4>
        <p>Gate Number : {e.gate}</p>
        <p>Class : {e.flightClass}</p>
        {checkUser('Flight Operation Manager') && <button onClick={() => removeFlight(e.id)} className="border-solid border-2 p-2 bg-red-400 text-slate-100">Remove</button>}
      </div>
    </NavLink>)}
    {terminal && <>
    <div>
      <img src={Terminal} className="w-full h-auto" alt="" />
    </div>
    </>}
  </div>
  }else{
    return <Error value = 'youre not authorized'></Error>
  }
}

export default FlightOperationHome
