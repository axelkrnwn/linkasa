import { getDatabase, insert } from "@renderer/database/database"
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function SecurityForm(props:any):JSX.Element{

  const [place, setPlace] = useState('')
  const [date,setDate] = useState<Date>(new Date())
  const [endDate,setEndDate] = useState<Date>(new Date())

  useEffect(() => {
    if (props.isUpdate){
      setPlace(props.place)
      setDate(props.date)
    }
  }, [])

  const addIncident = (e:any) => {
    e.preventDefault()
    props.func()
    insert('StaffSchedule', {
      place:place,
      startDate:date,
      endDate:endDate,
      staffID:props.id
    })
  }

  const updateIncident = async (e:any) => {
    e.preventDefault()
    props.func()
    await updateDoc(doc(getDatabase(),'IncidentLog',props.id), {
      place:place,
      date:date,
    })
  }
  const createP = (p:number) => {
    return p < 10 ? '0' + p : p
  }


  const createDate = (date:Date) => {
    // console.log(date)
    return `${date.getFullYear()}-${createP(date.getMonth()+1)}-${createP(date.getDate())}T${createP(date.getHours())}:${createP(date.getMinutes())}`
  }


  return <>
    <div style={{position:"fixed",backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg  drop-shadow-xl z-50">
      <button onClick={() => {props.func()}}>Back</button>
      <h1>Security Schedule Form</h1>
      <h1>Start</h1>
      <input type="datetime-local" name="" id="" defaultValue={props.isUpdate && createDate(props.date)} onChange={e => setDate(new Date(e.target.value))}/> <br />
      <h1>End</h1>
      <input type="datetime-local" name="" id="" defaultValue={props.isUpdate && createDate(props.date)} onChange={e => setEndDate(new Date(e.target.value))}/> <br />
      <input type="text" name="" id="" defaultValue={props.place} onChange={e => setPlace(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />
      <button className="my-4 px-4 bg-green-400 font-bold text-white rounded-lg py-1 w-full" onClick={props.isUpdate? updateIncident:addIncident}>Submit</button>
    </div>
  </>

}
