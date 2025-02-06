import { getDatabase } from "@renderer/database/database"
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Home from "../home/Home"

export function Transportation():JSX.Element{

  const param = useParams()


  interface Transportation{
    id:string,
    codename:string,
    type:string
  }

  interface Schedule{
    id:string,
    start:Date,
    end:Date,
    transportationID:string
  }

  const [transports,setTransports] = useState<Transportation[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])

  useEffect(() => {
    const q = query(collection(getDatabase(),'Transportation'), where('__name__','==',param.id))
    onSnapshot(q, snapshot => {
      setTransports(snapshot.docs.map(doc => {return ({
        id:doc.id,
        codename:doc.data().codename,
        type:doc.data().type
      })}))
    })
  }, [transports])


  useEffect(() => {
    const q = query(collection(getDatabase(),'TransportationSchedule'), where('transportationID','==',param.id))
    onSnapshot(q, snapshot => {
      setSchedules(snapshot.docs.map(doc => {return ({
        id:doc.id,
        start:doc.data().start.toDate(),
        end:doc.data().end.toDate(),
        transportationID:doc.data().transportationID
      })}))
    })
  }, [schedules])
  const [isLoading, setLoading] = useState(false)

  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>


  const removeSchedule =async (id:string) => {

    setLoading(true)
    await deleteDoc(doc(getDatabase(),'TransportationSchedule',id))
    setLoading(false)
  }

  const [id,setID] = useState('')

  const [isUpdateSchedule,setUpdateSchedule] = useState(false)
  const [startDate,setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const closeScheduleForm = () => {
    setUpdateSchedule(false)
  }

  const insertSchedule = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    closeScheduleForm()
    await updateDoc(doc(getDatabase(),'TransportationSchedule',id), {start:startDate,end:endDate})
    setLoading(false)
  }

  const scheduleForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
    <button onClick={closeScheduleForm}>Close</button>
    <h1 className="text-center font-bold my-2">Create Transportation Schedule</h1>
    <label htmlFor="dates">Start</label><br />
    <input type="date" className="border-2 border-solid border-blue-100 rounded-lg my-3" name="" id="dates" onChange={e => setStartDate(new Date(e.target.value))}/><br />
    <label htmlFor="datee">End</label><br />
    <input type="date" className="border-2 border-solid border-blue-100 rounded-lg my-3" name="" id="datee" onChange={e => setEndDate(new Date(e.target.value))}/><br />

    <button onClick={insertSchedule} className="bg-green-400 w-full rounded-lg text-slate-100 font-bold py-2 my-2">Submit</button>
  </div>



  const openUpdateForm = (id:string) => {
    setID(id)
    setUpdateSchedule(true)
  }

  return (<div className="px-5">
    {(isUpdateSchedule) && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-90 t-0 l-0"></div>}
    {isLoading && loading}
    {isUpdateSchedule && scheduleForm}
    <Home></Home>
    Transportation Schedules
    {schedules.map(e => <div key = {e.id} className="flex justify-between bg-slate-100 p-2">
      <h1>from {e.start.getDate()}-{e.start.getMonth() + 1} {e.start.getFullYear()} to {e.end.getDate()}-{e.end.getMonth() + 1} {e.end.getFullYear()}</h1>
      <div className="gap-x-3 flex">
        <button className="bg-blue-600 text-slate-100 px-2 py-1 rounded-lg" onClick={() => openUpdateForm(e.id)}>Update</button>
        <button className="bg-red-600 text-slate-100 px-2 py-1 rounded-lg" onClick={() => removeSchedule(e.id)}>Remove</button>
      </div>
      </div>)}
  </div>)
}

export default Transportation
