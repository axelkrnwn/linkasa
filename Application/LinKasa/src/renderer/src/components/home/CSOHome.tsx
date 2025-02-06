import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import Home from "./Home";
import { getDatabase } from "@renderer/database/database";
import { useEffect, useState } from "react";
import IncidentForm from "../view/IncidentForm";
import SecurityForm from "../view/SecurityForm";

export default function CSOHome():JSX.Element{

  interface Security{
    id:string,
    email:string,
    DOB:Date
  }

  interface Incident{
    id:string,
    nature:string,
    date:Date,
    place:string
    status:string
  }

  const [securities,setSecurities] = useState<Security[]>([])
  const [incidents,setIncidents] = useState<Incident[]>([])



  useEffect(() => {
    const q = query(collection(getDatabase(), 'IncidentLog'))
    onSnapshot(q, snapshot => {
      setIncidents(snapshot.docs.map(doc => {return ({
        id:doc.id,
        nature:doc.data().nature,
        date:doc.data().date.toDate(),
        place:doc.data().place,
        status:doc.data().status
      })}))
    })
  }, [incidents])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'User'), where
    ('type','==','security'))
    onSnapshot(q, snapshot => {
      setSecurities(snapshot.docs.map(doc => {return ({
        id:doc.id,
        email:doc.data().email,
        DOB:doc.data().DOB.toDate()
      })}))
    })
  }, [securities])

  const [showSecurity, setShowSecurity] = useState(true)
  const [showIncidentLog, setShowIncidentLog] = useState(false)
  const [isCreateIncident, setCreateIncident] = useState(false)
  const [isUpdateIncident, setUpdateIncident] = useState(false)

  const [incident,setIncident] = useState<Incident>({id:'',place:'',date:new Date(), nature:'',status:''})

  const openSecurity = () => {
    setShowSecurity(true)
    setShowIncidentLog(false)
  }
  const openIncident = () => {
    setShowSecurity(false)
    setShowIncidentLog(true)
  }

  const [staffID,setStaffID] = useState('')
  return <>
  {isCreateIncident && <IncidentForm func = {() => setCreateIncident(false)}></IncidentForm>}
  {isUpdateIncident && <IncidentForm func = {() => setUpdateIncident(false)} id = {incident.id} place = {incident.place} date = {incident.date} nature = {incident.nature} isUpdate = {true} status = {incident.status}></IncidentForm>}
  {(staffID !== '') && <SecurityForm func = {() => {setStaffID('')}} id = {staffID}></SecurityForm>}
  <Home></Home>
  <div>
    <button className={showSecurity?'font-bold':''} onClick={openSecurity}>Security</button>
    <button className={showIncidentLog?'font-bold':''} onClick={openIncident}>Incident Log</button>
    <button>Security Report</button>
  </div>
  <div className="px-5">
    {showSecurity && <>
    {securities.map(e =>
    <>
      <div className="w-full bg-white p-3 my-3">
        <h1>{e.id}</h1>
        <h1>{e.email}</h1>
        <h1>{e.DOB.toString()}</h1>
        <div className="flex gap-x-5">
        <button className="my-4 px-6 bg-green-400 font-bold text-white rounded-lg py-1" onClick={() => {
          setStaffID(e.id)
        }}>Create Schedule</button>
        <button className="my-4 px-6 bg-red-400 font-bold text-white rounded-lg py-1" onClick={async () => {
          await deleteDoc(doc(getDatabase(),'User', e.id))
        }}>Remove</button>
        </div>
      </div>
    </>)}
    </>}
    {showIncidentLog && <>
    <button  onClick={() => setCreateIncident(true)}>Create Incident Log</button>
    <div>
      {incidents.map(e => <>
        <div className="bg-white p-4 w-full my-3">
          <h1>{e.id}</h1>
          <h1>{e.nature}</h1>
          <h1>{e.place}</h1>
          <h1>{e.date.toString()}</h1>
          <h1>{e.status}</h1>
          <button className="my-4 px-6 bg-blue-400 font-bold text-white rounded-lg py-1" onClick={() => {
            setUpdateIncident(true)
            setIncident(e)
          }}>Update</button>
          <button className="my-4 px-6 bg-red-400 font-bold text-white rounded-lg py-1" onClick={async () => {await deleteDoc(doc(getDatabase(), 'IncidentLog',e.id))}}>Remove</button>
        </div>
      </>)}
    </div>
    </>}
  </div>
  </>
}
