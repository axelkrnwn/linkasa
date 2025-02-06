import { useEffect, useState } from "react"
import Home from "./Home"
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { getDatabase, insert } from "@renderer/database/database"

export function AirportOperationHome():JSX.Element{


  interface Equipment{
    id:string,
    name:string,
    status:string,
    type:string
  }
  interface Staff{
    id:string,
    email:string
  }

  interface Maintenance{
    id:string,
    equipmentID:string,
    status:string,
    staff:string,
    schedule:Date
  }

  interface Weather{
    date:Date,
    time:Date[],
    weather_code:number[],
  }

  const [showEquipment, setShow] = useState(true)
  const [showMaintenance, setShowMaintenance] = useState(false)
  const [showFlight, setShowFlight] = useState(false)
  const [showBaggage, setShowBaggage] = useState(false)
  const [showWeather, setShowWeather] = useState(false)

  const openEquipment = () => {
    setShow(true)
    setShowMaintenance(false)
    setShowFlight(false)
    setShowBaggage(false)
    setShowWeather(false)
  }
  const openMaintenance = () => {
    setShow(false)
    setShowMaintenance(true)
    setShowFlight(false)
    setShowBaggage(false)
    setShowWeather(false)
  }
  const openFlight = () => {
    setShow(false)
    setShowMaintenance(false)
    setShowFlight(true)
    setShowBaggage(false)
    setShowWeather(false)
  }
  const openBaggage = () => {
    setShow(false)
    setShowMaintenance(false)
    setShowFlight(false)
    setShowBaggage(true)
    setShowWeather(false)
  }

  const openWeather = () => {
    setShow(false)
    setShowMaintenance(false)
    setShowFlight(false)
    setShowBaggage(false)
    setShowWeather(true)
  }

  const [eq, setE] = useState('')

  const [maintenances, setmaintenances] = useState<Maintenance[]>([])

  const [equipments, setEquipments] = useState<Equipment[]>([])

  const [isCreate, setCreate] = useState(false)

  const [date,setDate] = useState<Date>()

  const [staffs, setStaffs] = useState<Staff[]>([])

  const [staff, setStaff] = useState<string>()

  const [weathers, setWeathers] = useState<Weather>({date:new Date(), time:[], weather_code:[]})

const createP = (date:number)=>{
  return date < 10 ? '0' + date:date
}
  useEffect(() => {
    const fetchData = async () => {

      const date = new Date()
      const day = date.getDate()
      const month = date.getMonth()+1
      const year = date.getFullYear()

      const url = `https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.816&hourly=weather_code&daily=weather_code&timezone=Asia%2FSingapore&start_date=${year}-${createP(month)}-${createP(day)}&end_date=${year}-${createP(month)}-${createP(day)}`
      const response = await fetch(url)
      const p = await response.json()
      console.log(p.hourly)
      setWeathers({date:date,time:p.hourly.time,weather_code:p.hourly.weather_code})
      // await insert('Weather',{...p.hourly,date:new Date()})

    }
    fetchData()
  }, [])

  useEffect(() => {
    const q = query(collection(getDatabase(),'employee'),where('role','==','Maintenance Staff'))

    onSnapshot(q , snapshot => {
      setStaffs(
        snapshot.docs.map(doc => {
          setStaff(doc.id)
          return {
            id:doc.id,
            email:doc.data().email
          }
        })
      )
    })
  }, [staffs])

  useEffect(() => {
    const q = query(collection(getDatabase(),'MaintenanceRequest'))
    onSnapshot(q, snapshot => {
      setmaintenances(snapshot.docs.map(e => ({
        id:e.id,
        schedule:e.data().schedule.toDate(),
        equipmentID:e.data().equipmentID,
        staff:e.data().staff,
        status:e.data().status
      })))
    })
  }, [maintenances])


  useEffect(() => {
    const q = query(collection(getDatabase(),'Equipment'))
    onSnapshot(q , snapshot => {
      setEquipments(snapshot.docs.map(doc => {setE(doc.id);return ({
        id:doc.id,
        name:doc.data().name,
        type:doc.data().type,
        status:doc.data().status,
      })}))
    })
  }, [equipments])


  const openCreateForm = () => {
    setCreate(true)
  }
  const closeCreateForm = () => {
    setCreate(false)
  }

  const [isLoading, setLoading] = useState(false)
  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>


  const insertRequest =(e:any) => {
    e.preventDefault()
    setLoading(true)
    closeCreateForm()
    insert('MaintenanceRequest', {
      equipmentID:eq,
      schedule:date,
      staff:staff,
      status:'pending'
    })
    setLoading(false)
  }

  const createForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
  <button onClick={closeCreateForm}>Close</button>
  <h1 className="text-center font-bold my-2">Create Maintenannce Request</h1>
  <label htmlFor="t">Equipment</label><br />
  <select name="" className="border-2 border-solid border-blue-100 rounded-lg my-3" id="t" onChange={e => setE(e.target.value)}>
    {equipments.map(e => <option value = {e.id} key = {e.id}>{e.name}</option>)}
  </select><br />
  <h1>Maintenance Date</h1>
  <input type="date" name="" id="" onChange={e => setDate(new Date(e.target.value))} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />
  <h1>Staff</h1>
  <select name="" id="" onChange={e => setStaff(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3">
    {staffs.map(e => <option value={e.id}>{e.email}</option>)}
  </select>

  <button onClick={insertRequest} className="bg-green-400 w-full rounded-lg text-slate-100 font-bold py-2 my-2">Submit</button>
</div>

const updateStatus = async (id:string, equipmentID:string,status:string) => {
  setLoading(true)
  await updateDoc(doc(getDatabase(), 'MaintenanceRequest', id),{status:status})
  await updateDoc(doc(getDatabase(),'Equipment',equipmentID), {status:'scheduled maintenance'})
  setLoading(false)
}

const reject = async (id:string,status:string) => {
  setLoading(true)
  await updateDoc(doc(getDatabase(), 'MaintenanceRequest', id),{status:status})
  setLoading(false)
}


interface Flight{
  id:string,
  src:string,
  srcCode:string,
  dest:string,
  destCode:string,
  gate:string,
  date:Date,
  flightClass:string,
  status:string
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
          date:doc.data().flightDate.toDate(),
          status:(new Date().getTime() >= doc.data().flightDate.toDate().getTime())?'Already flight':'Not Flight'
        }
      )
    ))

  })
}, [flights])

interface Baggage{
  id:string,
  content:string,
  status:string,
  description:string
}

  const [bagggages, setBaggages] = useState<Baggage[]>([])

  useEffect(() => {
    const q = query(collection(getDatabase(),'Baggage'))
    onSnapshot(q, snapshot => {
      setBaggages(snapshot.docs.map(doc => {return {
        id:doc.id,
        content:doc.data().content,
        status:doc.data().status,
        description:doc.data().statusDescription
      }

      }))
    })

  }, [bagggages])

  return (
  <div>
    {isCreate && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-90 t-0 l-0"></div>}
    {isLoading && loading}
    {isCreate && createForm}
    <Home></Home>
    <div className="px-10">
      <div>
        <button onClick={openCreateForm} className="border-2 bg-blue-600 text-slate-100 p-2 rounded-lg font-bold px-6">Create new maintenance Request</button>
      </div>
      <div className="flex mt-5 gap-x-10 border-y-2 border-slate-400 py-4">
        <button onClick={openEquipment} className={showEquipment? 'font-bold':''}>Equipments</button>
        <button onClick={openMaintenance} className={showMaintenance? 'font-bold':''}>Maintenances</button>
        <button onClick={openFlight} className={showFlight? 'font-bold':''}>Flight</button>
        <button onClick={openBaggage} className={showBaggage? 'font-bold':''}>Baggage</button>
        <button onClick={openWeather} className={showWeather?'font-bold':''}>Weather</button>
      </div>
        <div>
          {showWeather && <h1>Live Weather for {new Date().getDate()}-{new Date().getMonth() + 1} {new Date().getFullYear()}</h1>}
          {showWeather && <div className="flex gap-x-10">
            <div>
              <h1>Time</h1>
              {weathers.time.map(e => <h1>{e.toString()}</h1>)}
            </div>
            <div>
              <h1>Weather</h1>
              {weathers.weather_code.map(e => {
                if (e == 0){
                  return <h1>Clear Sky</h1>
                }
                if ([1,2,3].includes(e)){
                  return <h1>Overcast</h1>
                }
                if ([45,48].includes(e)){
                  return <h1>Fog</h1>
                }
                if ([51,52,53].includes(e)){
                  return <h1>Drizzle</h1>
                }
                if ([56,57].includes(e)){
                  return <h1>Freezing Drizzle</h1>
                }
                if ([61,65,63].includes(e)){
                  return <h1>Rain</h1>
                }
                if ([66,67].includes(e)){
                  return <h1>Freezing Rain</h1>
                }
                if ([71,75,73].includes(e)){
                  return <h1>Snow fall</h1>
                }
                if ([77].includes(e)){
                  return <h1>Snow grains</h1>
                }
                if ([80,81,82].includes(e)){
                  return <h1>Rain showers</h1>
                }
                if ([85,86].includes(e)){
                  return <h1>Snow showers</h1>
                }
                if ([95].includes(e)){
                  return <h1>Thunderstorm</h1>
                }
                if ([96,99].includes(e)){
                  return <h1>Thunderstrom with slight and heavy hail</h1>
                }
                return 'a'
              })}
            </div>
          </div>}
        </div>

        {(showEquipment) &&
        <div>{equipments.map(e => <div key = {e.id} className="flex justify-between bg-slate-100 w-full px-4 py-2 mt-5 shadow-xl">
          <div>
            <h1 className="font-bold">{e.name}</h1>
            <h1>{e.status}</h1>
          </div>
          <h1>{e.type}</h1>
        </div>)}</div>}

        <div>{showMaintenance &&
          maintenances.map(e => <div key = {e.id} className="bg-slate-100 w-full px-4 py-2 mt-5 shadow-xl font-bold">
            <div className="flex justify-between ">
              {equipments.filter(eq=> eq.id == e.equipmentID).map(p => <h1 key = {p.id}>{p.name}</h1>)}
              {staffs.filter(s => s.id == e.staff).map(s => <h1>Handled by {s.email}</h1>)}
              <h1>Scheduled at {e.schedule.getDate()} - {e.schedule.getMonth() + 1} {e.schedule.getFullYear()}</h1>
              Status : {e.status}
            </div>
            <div className="flex gap-x-5 text-slate-100 mt-2">
              {e.status !== 'Accepted' && <button className = 'bg-green-400 p-1 px-4' onClick={() => updateStatus(e.id,e.equipmentID,'Accepted')}>Accept</button>
              }<button className = 'bg-red-400 p-1 px-4' onClick={() => reject(e.id, 'rejected')}>Reject</button>
            </div>
          </div>)
          }</div>

          <div>{
            showFlight && flights.map(e =>
            <div className="bg-slate-100 m-5 p-3" key = {e.id}>
              <h1>{e.date.getDate()} - {e.date.getMonth() + 1} {e.date.getFullYear()}</h1>
              <h4>{e.srcCode} - {e.destCode}</h4>
              <h4>{e.src} - {e.dest}</h4>
              <p>Gate Number : {e.gate}</p>
              <p>Class : {e.flightClass}</p>
              <p>Status : {e.status}</p>
            </div>
          )}</div>
          <div className="flex flex-wrap mt-2">
            {
              showBaggage && bagggages.map(e => <div className="w-2/5 p-4 bg-slate-100 shadow-xl mx-4">
                <h1 className="font-bold">{e.content}</h1>
                <h1>status : {e.status}</h1>
                <p>description : {e.description}</p>
              </div>)
            }
          </div>
    </div>

  </div>
  )
}

export default AirportOperationHome
