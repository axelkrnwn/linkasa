import { useEffect, useState } from "react"
import Home from "./Home"
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { getDatabase, insert } from "@renderer/database/database"

export function MaintenanceHome():JSX.Element{


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
    schedule:Date,
    type:string
  }

  const [showEquipment, setShow] = useState(true)

  const [eq, setE] = useState('')

  const [maintenances, setmaintenances] = useState<Maintenance[]>([])

  const [equipments, setEquipments] = useState<Equipment[]>([])

  const [isCreate, setCreate] = useState(false)

  const [date,setDate] = useState<Date>()

  const [staffs, setStaffs] = useState<Staff[]>([])

  const [staff, setStaff] = useState<string>()

  const [type,setType] = useState('')

  const [task, setTask] = useState('')

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
        status:e.data().status,
        type:e.data().type
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
    setUpdate(false)
  }

  const [isLoading, setLoading] = useState(false)
  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>


  const insertRequest =() => {
    console.log('asdafsdgf')
    setLoading(true)
    closeCreateForm()
    insert('MaintenanceRequest', {
      equipmentID:eq,
      schedule:date,
      staff:staff,
      status:'pending',
      type:type,
      task:task
    })
    setLoading(false)
  }

  const [eStatus, setEStatus] = useState('Fully Operational')
  const [eID, setEID] = useState<string>('')


  const [statusOpen, setStatusForm] = useState(false)

  const updateStatus = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    setStatusForm(false)
    await updateDoc(doc(getDatabase(), 'Equipment', eID), {status:eStatus})
    setLoading(false)
  }

  const updateStatusForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
    <button onClick={() => setStatusForm(false)}>Close</button> <br />
    <select name="" id="" onChange={e => setEStatus(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3">
      <option value="Fully Operational">Fully Operational</option>
      <option value="Scheduled Maintenance">Scheduled Maintenance</option>
      <option value="Under Maintenance">Under Maintenance</option>
      <option value="Need Reparation">Need Reparation</option>
      <option value="Need Upgrade">Need Upgrade</option>
    </select> <br />
    <button onClick={updateStatus} className="w-full bg-green-400 rounded-lg my-3 text-slate-100 font-bold py-2">Submit</button>
  </div>

  const createForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
  <button onClick={closeCreateForm}>Close</button>
  <h1 className="text-center font-bold my-2">{isCreate? 'Create':'Update'} Maintenannce Request</h1>
  <label htmlFor="t">Equipment</label><br />
  <select name="" className="border-2 border-solid border-blue-100 rounded-lg my-3" id="t" onChange={e => setE(e.target.value)}>
    {equipments.map(e => <option value = {e.id} key = {e.id}>{e.name}</option>)}
  </select><br />
  <h1>Maintenance Date</h1>
  <input type="datetime-local" name="" id="" onChange={e => setDate(new Date(e.target.value))} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />

  <h1>Maintenance Type</h1>
  <input type="text" name="" id="" onChange={e => setType(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3"/> <br />
  <h1>Maintenance Tasks</h1>
  <textarea name="" id="" onChange={e => setTask(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3" cols={50} rows={10}/> <br />

  <h1>Staff</h1>
  <select name="" id="" onChange={e => setStaff(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3">
    {staffs.map(e => <option value={e.id}>{e.email}</option>)}
  </select>
  <button onClick={(e:any) => {e.preventDefault();isUpdate?updateRequest():insertRequest()}} className="bg-green-400 w-full rounded-lg text-slate-100 font-bold py-2 my-2">Submit</button>
</div>

const [isUpdate,setUpdate] = useState(false)
const [id,setID] = useState('')


const removeMaintenance = async (id:string) => {
  setLoading(true)
  await deleteDoc(doc(getDatabase(),'MaintenanceRequest',id))
  setLoading(false)
}

const updateRequest = async () => {
  setLoading(true)
  console.log('asdasda')
  closeCreateForm()
  await updateDoc(doc(getDatabase(),'MaintenanceRequest',id),{
    equipmentID:eq,
    schedule:date,
    staff:staff,
    status:'pending'
  })

  setLoading(false)
}

  return (
  <div>
    {(isCreate || isUpdate || statusOpen) && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-90 t-0 l-0"></div>}
    {isLoading && loading}
    {(isCreate || isUpdate) && createForm}
    {statusOpen && updateStatusForm}
    <Home></Home>
    <div className="px-10">
      <div>
        <button onClick={openCreateForm} className="border-2 bg-blue-600 text-slate-100 p-2 rounded-lg font-bold px-6">Create new maintenance Request</button>
      </div>
      <div className="flex mt-5 gap-x-10 border-y-2 border-slate-400 py-4">
        <button onClick={() => setShow(true)} className={showEquipment? 'font-bold':''}>Equipments</button>
        <button onClick={() => setShow(false)} className={!showEquipment? 'font-bold':''}>Maintenances</button>
      </div>
        {(showEquipment)?
        <div>{equipments.map(e => <div key = {e.id} className="bg-slate-100 w-full px-4 py-2 mt-5 shadow-xl">
          <div className="flex justify-between ">
            <div>
              <h1 className="font-bold">{e.name}</h1>
              <h1>{e.status}</h1>
            </div>
            <h1>{e.type}</h1>
          </div>
          <div className="flex justify-end">
            <button className="px-4 bg-blue-600 text-slate-100 rounded-lg py-1" onClick={() => {setEID(e.id);setStatusForm(true)}}>Update</button>
          </div>
        </div>)}</div> :
        <div>{
          maintenances.map(e => <div key = {e.id} className="bg-slate-100 w-full px-4 py-2 mt-5 shadow-xl font-bold">
            <div className="flex justify-between ">
              {equipments.filter(eq=> eq.id == e.equipmentID).map(p => <h1 key = {p.id}>{p.name}</h1>)}
              {staffs.filter(s => s.id == e.staff).map(s => <h1>Handled by {s.email}</h1>)}
              <h1>Scheduled at {e.schedule.getDate()} - {e.schedule.getMonth() + 1} {e.schedule.getFullYear()}</h1>
              Status : {e.status}
            </div>
            <div className="flex gap-x-5 mt-5">
              <button className="px-4 bg-red-600 text-slate-100 rounded-lg py-1" onClick={() => removeMaintenance(e.id)}>Remove</button>
              {<button className="px-4 bg-blue-600 text-slate-100 rounded-lg py-1" onClick={() => {
                setID(e.id)
                setE(e.equipmentID)
                setDate(e.schedule)
                setStaff(e.staff)
                setUpdate(true)
              }}>Update</button>
            }</div>
          </div>)
          }</div>
        }
    </div>

  </div>
  )
}

export default MaintenanceHome
