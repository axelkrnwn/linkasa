import { getDatabase, insert } from "@renderer/database/database"
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function IncidentForm(props:any):JSX.Element{

  const [nature, setNature] = useState('')
  const [place, setPlace] = useState('')
  const [date,setDate] = useState<Date>(new Date())
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (props.isUpdate){
      setNature(props.nature)
      setPlace(props.place)
      setDate(props.date)
    }
  }, [])

  const addIncident = (e:any) => {
    e.preventDefault()
    props.func()
    insert('IncidentLog', {
      nature:nature,
      place:place,
      date:date,
      status:'unresolved'
    })
  }

  const updateIncident = async (e:any) => {
    e.preventDefault()
    props.func()
    await updateDoc(doc(getDatabase(),'IncidentLog',props.id), {
      nature:nature,
      place:place,
      date:date,
      status:status
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
      <h1>Security Incident Log Form</h1>
      <input type="text" onChange={e => setNature(e.target.value)} defaultValue={nature} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />
      <input type="text" onChange={e => setPlace(e.target.value)} defaultValue={place} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />
      <input type="datetime-local" name="" id="" defaultValue={createDate(props.date)} onChange={e => setDate(new Date(e.target.value))}/> <br />
      {props.isUpdate && <input type="text" onChange={e => setStatus(e.target.value)} defaultValue={props.status}/>}
      <button className="my-4 px-4 bg-green-400 font-bold text-white rounded-lg py-1 w-full" onClick={props.isUpdate? updateIncident:addIncident}>Submit</button>
    </div>
  </>
}
