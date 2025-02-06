import { useEffect, useState } from "react";
import Home from "./Home";
import { collection, onSnapshot, query } from "firebase/firestore";
import { getDatabase, insert } from "@renderer/database/database";
import { NavLink } from "react-router-dom";

function LandsideHome():JSX.Element{

  interface Transportation{
    id:string,
    codename:string,
    type:string
  }

  const [transports,setTransports] = useState<Transportation[]>([])

  useEffect(() => {
    const q = query(collection(getDatabase(),'Transportation'))
    onSnapshot(q, snapshot => {
      setTransports(snapshot.docs.map(doc => {setT(doc.id); return ({
        id:doc.id,
        codename:doc.data().codename,
        type:doc.data().type
      })}))
    })
  }, [transports])

  // interface Schedule{
  //   start:Date,
  //   end:Date,
  //   transportationID:string
  // }

  const [createScheduleForm, setScheduleForm] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const openScheduleForm = () => {
    setScheduleForm(true)
  }
  const closeScheduleForm = () => {
    setScheduleForm(false)
  }


  const [t, setT] = useState<string>()
  const [startDate,setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const insertSchedule = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    closeScheduleForm()
    await insert('TransportationSchedule', {transportationID:t, start:startDate, end:endDate})
    setLoading(false)
  }

  const scheduleForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
    <button onClick={closeScheduleForm}>Close</button>
    <h1 className="text-center font-bold my-2">Create Transportation Schedule</h1>
    <label htmlFor="t">Transportation</label><br />
    <select name="" className="border-2 border-solid border-blue-100 rounded-lg my-3" id="t" onChange={e => setT(e.target.value)}>
      {transports.map(e => <option value = {e.id} key = {e.id}>{e.codename}</option>)}
    </select><br />
    <label htmlFor="dates">Start</label><br />
    <input type="date" className="border-2 border-solid border-blue-100 rounded-lg my-3" name="" id="dates" onChange={e => setStartDate(new Date(e.target.value))}/><br />
    <label htmlFor="datee">End</label><br />
    <input type="date" className="border-2 border-solid border-blue-100 rounded-lg my-3" name="" id="datee" onChange={e => setEndDate(new Date(e.target.value))}/><br />

    <button onClick={insertSchedule} className="bg-green-400 w-full rounded-lg text-slate-100 font-bold py-2 my-2">Submit</button>
  </div>

const loading =
<div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>


  return (<div>

    {(createScheduleForm) && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-90 t-0 l-0"></div>}
    {createScheduleForm && scheduleForm}
    {isLoading && loading}
    <Home></Home>
    <div className="w-9/10 px-5 flex gap-x-5 my-3">
      <button onClick={openScheduleForm}>Create Transportation Schedule</button>
    </div>
    <div className="w-9/10 px-5">
      Transportations
      {transports.map(e =>
      <NavLink to = {`/transportation/${e.id}`} key = {e.id}>
      <div className="flex w-full p-3 bg-slate-100 justify-between font-bold">
        <h1>{e.codename}</h1>
        <h1>{e.type}</h1>
      </div>
      </NavLink>)}
    </div>

  </div>)
}

export default LandsideHome
