import { getDatabase, insert, storage } from "@renderer/database/database"
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Home from "../home/Home"
import { checkUser } from "@renderer/middleware/Middleware"
import { ref, uploadBytes } from "firebase/storage"

export function FlightDetail():JSX.Element{

  const param = useParams()

  interface Flight{
    id:string,
    src:string,
    srcCode:string,
    dest:string,
    destCode:string,
    gate:string,
    date:Date,
    flightClass:string,

  }

  interface Passenger{
    id:string,
    email:string,
    DOB:string
  }

  const [flights, setFlights] = useState<Flight[]>([])
  const [passengers, setPassenger] =useState<Passenger[]>([])

  const [showList, setShowList] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [update, setUpdate] = useState(false)

  const [seats,setSeats] = useState<JSX.Element[]>([])
  const [isLoading, setLoading] = useState(false)

  const [destCity, setDest] = useState('')
  const [destCode, setCode] = useState('')
  const [flightDate, setFlightDate] = useState(new Date())
  const [flightClass, setClass] = useState('Business')
  const [gate, setGate] = useState('1A')
  const [crew, setCrew] = useState<string[]>([])
  const [ac, setAc] = useState('')
  const [flightUsers, setFlightUsers] = useState<User[]>([])
  const [plane,setPlane] = useState<Plane[]>([])
  const [openAssign, setOpenAssign] = useState(false)
  const [assigned, setAssign] = useState(false)
  const [crews, setCrews] = useState<string[]>([])
  const [crewList,setCrewList] = useState(false)
  const [crewID,setCrewID] = useState('')

  interface Plane{
    id:string,
    code:string,
    seats:number
  }

  interface User{
    id:string,
    email:string,
    DOB:Date
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
    plane:string
  }

  useEffect(() => {
    const q = query(collection(getDatabase(), 'User'), where('type','==','flight'))
    onSnapshot(q, snapshot => {
      setFlightUsers(snapshot.docs.map(doc => {return ({
        id:doc.id,
        email:doc.data().email,
        DOB:doc.data().DOB.toDate()
      })}))
    })
  }, [flightUsers])


  useEffect(() => {
    const q = query(collection(getDatabase(), 'Flight'),where('__name__','==',param.id))

    onSnapshot(q, snapshot => {

      setFlights(snapshot.docs.map(
        doc =>
        {if (doc.data().plane.length > 0){setAssign(true)}; return(
          {
            id:doc.id,
            src:doc.data().source,
            srcCode:doc.data().sourceAirportCode,
            dest:doc.data().destination,
            destCode:doc.data().destAirportCode,
            flightClass:doc.data().class,
            gate:doc.data().gateNumber,
            date:doc.data().flightDate.toDate(),
            plane:doc.data().plane
          }
        )}
      ))
    })

  }, [flights])

  useEffect(() => {

    const q = query(collection(getDatabase(),'Crew'),where('flightID','==',param.id))

    onSnapshot(q, snapshot => {
      // setCrews(snapshot.docs.map(e => (e.data().crew)))
      if (checkUser('Flight Operation Manager')){
        setCrews(snapshot.docs[0].data().crew)
        setCrewID(snapshot.docs[0].id)
      }
    })
  }, [crews])

  useEffect(() => {
    const q = query(collection(getDatabase(),'Passenger'), where('flightID','==',param.id))

    onSnapshot(q, snapshot => {
      setPassenger(snapshot.docs.map(e =>{setPassenger1(e.id);return ({
        id:e.id,
        email:e.data().passengerEmail,
        DOB:e.data().passengerDOB.toDate()
      })}))
    })
  }, [passengers])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Transportation'), where('type', '==', 'Plane'))
    onSnapshot(q, snapshot => {
      const newSeats:JSX.Element[] = [];

      setPlane(snapshot.docs.map(e => {
        setAc(e.data().codename);
        const passengersCopy = [...passengers];

        for (let i = 0; i < 30; i++) {
          if (passengersCopy.length > i)
            newSeats.push(<div className="w-10 h-10 bg-slate-800 m-2 text-slate-100 p-2">{i + 1}</div>);
          else
            newSeats.push(<div className="w-10 h-10 bg-slate-100 m-2 text-slate-800 p-2">{i + 1}</div>);
        }

        return {
          id: e.id,
          code: e.data().codename,
          seats: e.data().capacity
        };
      }));

      setSeats(newSeats);
    });
  }, [plane, passengers]);


  const updateFlight = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    setUpdate(false)
    await updateDoc(doc(getDatabase(),'Flight',flights[0].id), {
      class:flightClass,
      destAirportCode:destCode,
      destination:destCity,
      gateNumber:gate,
      flightDate:flightDate,
      source:'Jakarta',
      sourceAirportCode:'CGK'
    })


    setLoading(false)
  }

  const chart = <div className="border-2 border-black border-solid w-full flex flex-wrap bg-slate-400 h-220">
    {seats.map(e => e)}
  </div>

 const updateForm = <form onSubmit={updateFlight} style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
 <button onClick={() => setUpdate(false)}>Close</button>
 <h1 className="text-center font-bold">Update Flight</h1> <br />
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




  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>

  const hideAssign = () => {
    setCrew([])
    setFields([])
    setOpenAssign(false)
  }

  const assignCrew = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    setAssign(true)
    hideAssign()
    // console.log(crew)
    await updateDoc(doc(getDatabase(),'Flight',flights[0].id), {
      class:flights[0].flightClass,
      destAirportCode:flights[0].destCode,
      destination:flights[0].dest,
      gateNumber:flights[0].gate,
      flightDate:flights[0].date,
      source:'Jakarta',
      sourceAirportCode:'CGK',
      plane:ac,
    })
    await insert('Crew', {
      flightID:flights[0].id,
      crew:crew,
    })
    setLoading(false)
  }

  const field =
  <select className="border-2 border-solid border-blue-100 rounded-lg my-7" onChange={(e) => setCrew([...crew,e.target.value])}>
    {flightUsers.map(e =>{return <option key = {e.id} value = {e.email}>{e.email}</option>})}
  </select>

const [fields, setFields] = useState<JSX.Element[]>([])

const addField = () => {
  console.log(crew)
  // e.preventDefault()
  if (fields.length < flightUsers.length){
    crew.push(flightUsers[fields.length].email)
    setFields([...fields,field])
  }

}

  const crewForm =
  <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">

    <button onClick={() => hideAssign()}>Close</button>

    <h1 className="text-center font-bold">Assign Crew to The Flight</h1> <br />
    <label htmlFor="">Crews</label> <br />
    <button onClick={addField}>Add Crew</button> <button onClick={() =>
    setFields(fields.slice(0,fields.length - 1))}>Remove Crew</button> <br />
    {fields.map(e => e)}
    <br />
    <label htmlFor="plane">Plane</label>
    <select name="" id="plane" className="border-2 border-solid border-blue-100 rounded-lg my-7" onChange={(e) => setAc(e.target.value)}>
      {plane.map(e => <option key = {e.id} value = {e.code}>{e.code}</option>)}
    </select>
    <button onClick={assignCrew} className="bg-green-400 px-2 my-5 text-slate-100 font-bold rounded-lg my-3 w-full">Submit</button>
  </div>

  const removeCrew = async (e:string) => {
    //splice

    await updateDoc(doc(getDatabase(),'Crew',crewID), {crew:crews.filter(p => e != p)})
    setLoading(false)
  }

  const [file,setFile] = useState<File|null>(null)
  const [passenger, setPassenger1] = useState('')
  const [content,setContent] = useState('')
  const [weight,setWeight] = useState(0)
  const [dimension,setDimension] = useState(0)

    const [openBaggage, setOpenBaggage] = useState(false)

    const openBaggageForm = () => {
      setOpenBaggage(true)
    }

    const closeBaggageForm = () => {
      setOpenBaggage(false)
    }

    const insertBaggage = async (e:any) => {
      e.preventDefault()
      setLoading(true)
      closeBaggageForm()
      if (file === null){
        return
      }else{
        const imageRef = ref(storage, `baggage/${param.id}_${passenger}_${content}`)

        await uploadBytes(imageRef, file)
      }
      await insert('Baggage', {
        content:content,
        flightID:param.id,
        weight:weight,
        photo: `baggage/${param.id}_${passenger}_${content}`,
        dimension:dimension,
        passengerID:passenger,
        status:'checked',
        statusDescription:'',
        claimStatus:'received for transport',
      })
      setLoading(false)
    }

  const baggageForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
    <button onClick={closeBaggageForm}>Close</button>
    <h1>Input Baggage</h1>
    <label htmlFor="p">Passenger</label>
    <select id = 'p' onChange={e => setPassenger1(e.target.value)}>
      {passengers.map(p => <option key = {p.id} value ={p.id}>{p.email}</option>)}
    </select><br />
    <label htmlFor="c">Content</label> <br />
    <input type="text" name="" id="c" onChange={e => setContent(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />
    <label htmlFor="w">Weight</label> <br />
    <input type="number" name="" id="w" onChange={e => setWeight(parseInt(e.target.value))} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />
    <label htmlFor="d">Dimension</label> <br />
    <input type="number" name="" id="d" onChange={e => setDimension(parseInt(e.target.value))} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />
    <label htmlFor="f">Photo</label>
    <input type="file" id = 'f' required onChange={e => setFile(e.target.files[0])} className="border-2 border-solid border-blue-100 rounded-lg my-3"/>
    <br />
    <button type="submit" onClick={insertBaggage} className="bg-green-400 rounded-lg text-slate-100 w-full">Submit</button>
  </div>


  return (<div>
    {(update || openAssign || openBaggage) && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-90 t-0 l-0"></div>}
    {isLoading && loading}
    {openAssign && crewForm}
    {openBaggage && baggageForm}
    <Home></Home>
    <div className="py-5 px-10">
    {checkUser('Flight Operation Manager') && <div className="flex gap-x-5 mt-5">
      <button onClick={() => setUpdate(true)}>Update</button>
      <button onClick={() => setOpenAssign(true)}>Assign Crew</button>
      {assigned && <button onClick={() => {}}>Modify Crew</button>}
    </div>}
    {checkUser('Check-in Staff') && <button onClick={openBaggageForm}>Input Baggage</button>}
    {flights.map(e => <div key={e.id} className="border-y-2 border-slate-400 mb-5 py-5">
        <h1>Flight Date : {e.date.getDate()} - {e.date.getMonth() + 1} {e.date.getFullYear()}</h1>
        <h4>{e.srcCode} - {e.destCode}</h4>
        <h4>From {e.src} To {e.dest}</h4>
        <p>Gate Number : {e.gate}</p>
        <p>Class : {e.flightClass}</p>
        <p>Plane : {e.plane !== ''? e.plane:'unassigned'}</p>
        {e.plane.length > 0 && <div className="flex gap-x-2 my-4">
        <h1 className="font-bold">Seating Chart</h1> <button onClick={() => showChart?setShowChart(false) : setShowChart(true)} className="border-2 border-solid border-black px-3 rounded-lg">show</button>
        </div>}
        {showChart && chart}
        {( checkUser('Flight Operation Manager') && e.plane.length > 0) && <div className="flex gap-x-2 my-4">
        <h1 className="font-bold">Crews</h1> <button onClick={() => crewList?setCrewList(false) : setCrewList(true)} className="border-2 border-solid border-black px-3 rounded-lg">show</button>
        </div>}
        {(checkUser('Flight Operation Manager') && crewList) && crews.map(e =>
        <div className="flex gap-x-10">
          {e}
          {<button onClick={() => removeCrew(e)}>remove</button>}
        </div>)}
      </div>
    )}
    <h1>Total Passenger : {passengers.length}</h1>
      <div className="flex gap-x-2 mt-5">
        <h1 className="font-bold">Passengers</h1> <button onClick={() => showList?setShowList(false) : setShowList(true)} className="border-2 border-solid border-black px-3 rounded-lg">show</button>
      </div>
        {showList && passengers.map(e => <div key = {e.id}>
          <h1>{e.email}</h1>
          <p>{e.DOB.toString()}</p>
        </div>)}
        {update && updateForm}
    </div>
  </div>)
}

export default FlightDetail
