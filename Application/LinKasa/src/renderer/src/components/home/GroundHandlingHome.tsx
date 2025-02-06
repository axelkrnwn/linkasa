import Home from "./Home"
import { useEffect, useState } from "react"
import { getDatabase, insert } from "@renderer/database/database"
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"

export function GroundHandlingHome():JSX.Element{


interface Baggage{
  id:string,
  content:string,
  status:string,
}

  const [bagggages, setBaggages] = useState<Baggage[]>([])
  const [showBaggage, setShowBaggage] = useState(true)
  const [showRefueling, setShowRefueling] = useState(false)
  const[showStaffs, setShowStaffs] =useState(false)

  useEffect(() => {
    const q = query(collection(getDatabase(),'Baggage'))
    onSnapshot(q, snapshot => {
      setBaggages(snapshot.docs.map(doc => {return {
        id:doc.id,
        content:doc.data().content,
        status:doc.data().claimStatus,
      }

      }))
    })

  }, [bagggages])

  const openBaggage = () => {
    setShowBaggage(true)
    setShowRefueling(false)
    setShowStaffs(false)
  }
  const openShowRefueling = () => {
    setShowBaggage(false)
    setShowRefueling(true)
    setShowStaffs(false)
  }
  const openShowStaffs = () => {
    setShowBaggage(false)
    setShowRefueling(false)
    setShowStaffs(true)
  }

  const [isUpdate, setUpdate] = useState(false)
  const [id, setID] = useState('')
  const [status, setStatus] = useState('Checked')

  const [isLoading, setLoading] = useState(false)

  const openBaggageForm= (id:string) => {
    setUpdate(true)
    setID(id)
  }
  const closeBaggageForm= () => {
    setUpdate(false)
  }
  const updateBaggage = async (e:any) => {
    e.preventDefault()
    closeBaggageForm()
    setLoading(true)
    await updateDoc(doc(getDatabase(),'Baggage', id), {
      claimStatus:status,
    })
    setLoading(false)
  }

  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>


  const updateBaggageForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
    <button onClick={closeBaggageForm}>Close</button>
    <h1 className="font-bold text-center">Update Baggage</h1>
    <label htmlFor="s">Status</label> <br />
    <select name="" id="s" onChange={e => setStatus(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3">
      <option value="In Transit">In Transit</option>
      <option value="Ready For Pick-up">Ready For Pick-up</option>
      <option value="Received For Transport">Received For Transport</option>
      <option value="Claimed By Passenger">Claimed By Passenger</option>
    </select><br />
  <button onClick={updateBaggage} className="bg-green-400 px-2 my-5 text-slate-100 font-bold rounded-lg my-3 w-full">Submit</button>
  </div>

  interface Transport{
    id:string,
    name:string,
    capacity:number,
    amount:number
  }

  interface Fuel{
    id:string,
    name:string,
    quantity:number
  }

  interface Refueling{
    transportID:string,
    id:string,
    fuelID:string,
    staffID:string,
    amount:number,
    date:Date
  }

  interface Schedule{
    id:string,
    staffID:string,
    date:Date,
    task:string,
    taskID:string,
  }

  interface Staff{
   id:string,
   email:string,
  }

  const [openRefueling, setOpenRefueling] = useState(false)
  const [t, setT] = useState<Transport[]>([])
  const [transport, setTransport] = useState('')
  const [refuelID, setRefuelID] = useState('')
  const [amount, setAmount] = useState(1)
  const [fuel, setFuel] = useState<Fuel[]>([])
  const [f, setF] = useState('')
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [staffID, setStaffID] = useState('')
  const [refuelSchedule, setRefuelSchedule] = useState<Date>()
  const [refuelings, setRefuelings] = useState<Refueling[]>([])
  const [staffSchedules,setStaffSchedule] = useState<Schedule[]>([])

  useEffect(() => {
    const q = query(collection(getDatabase(),'StaffSchedule'))
    onSnapshot(q, snapshot => {
      setStaffSchedule(snapshot.docs.map(doc => ({
        id:doc.id,
        staffID:doc.data().staffID,
        date:doc.data().date.toDate(),
        taskID:doc.data().taskID,
        task:doc.data().type
      })))
    })
  },[staffSchedules])

  useEffect(() => {
    const q = query(collection(getDatabase(),'employee'), where('role','==','Ground Handling Staff'))
    onSnapshot(q, snapshot => {
      setStaffs(snapshot.docs.map(e => ({
        id:e.id,
        email:e.data().email
      })))
    })
  }, [staffs])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Refueling'))
    onSnapshot(q, snapshot => {
      //setTaskID(e.id);setDate(e.data().date.toDate());
      setRefuelings(snapshot.docs.map(e => {return ({
        id:e.id,
        transportID:e.data().transportationID,
        fuelID:e.data().fuelID,
        staffID:e.data().staffID,
        amount:e.data().amount,
        date:e.data().date.toDate()
      })}))
    })
  }, [refuelings])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Transportation'))
    onSnapshot(q, snapshot =>{
      setT(snapshot.docs.map(e => {setTransport(e.id);return ({
        id:e.id,
        name:e.data().codename,
        amount:e.data().fuelAmount,
        capacity:e.data().fuelCapacity
      })}))
    })
  }, [t])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Fuel'), where('quantity', '>=' ,amount))
    onSnapshot(q, snapshot =>{
      setFuel(snapshot.docs.map(e => {setF(e.id); return ({
        id:e.id,
        name:e.data().name,
        quantity:e.data().quantity
      })}))
    })
  }, [amount])

  const openRefuelingForm = () => {
    setOpenRefueling(true)
  }
  const closeRefuelingForm = () => {
    setOpenRefueling(false)
    setUpdateRefueling(false)
  }

  const insertRefueling = (e:any) => {
    e.preventDefault()
    setLoading(true)
    closeRefuelingForm()
    insert('Refueling',{
      amount:amount,
      fuelID:f,
      staffID:'',
      transportationID:transport,
      date:refuelSchedule
    })
    setLoading(false)

  }

  const [isUpdateRefueling, setUpdateRefueling] = useState(false)

  const updateRefueling = async (e:any) =>{
    e.preventDefault()
    setLoading(true)
    setUpdateRefueling(false)
    closeRefuelingForm()
    await updateDoc(doc(getDatabase(),'Refueling',refuelID), {
      amount:amount,
      fuelID:f,
      transportationID:transport,
      date:refuelSchedule
    })
    setLoading(false)
  }

  const refuelingForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
  <button onClick={closeRefuelingForm}>Close</button>
  <h1 className="font-bold text-center">{isUpdateRefueling?'Update':'Create'} Refueling Schedule</h1>
  <label htmlFor="d">Schedule</label>
  <input type="datetime-local" name="" id="d" onChange={e => setRefuelSchedule(new Date(e.target.value))}/> <br />
  <label htmlFor="t">Transportation to be refueled</label> <br />
  <select required name="" id="t" onChange={e => setTransport(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3">
  {t.filter(e => e.amount < e.capacity/5).map(e => <option key = {e.id} value={e.id}>{e.name}</option>)}
  </select><br />
  <label htmlFor="a">Amount</label>
  <input type="number" id = 'a' min={1} className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setAmount(parseInt(e.target.value))}/> <br />
  <label htmlFor="s">Fuel</label> <br />

  <select required name="" id="s" onChange={e => setF(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3">
  {fuel.map(e => <option key = {e.id} value={e.id}>{e.name}</option>)}
  </select><br />
<button onClick={isUpdateRefueling? updateRefueling:insertRefueling} className="bg-green-400 px-2 my-5 text-slate-100 font-bold rounded-lg my-3 w-full">Submit</button>
</div>



  const removeRefueling = async (id:string) => {
    setLoading(true)
    await deleteDoc(doc(getDatabase(), 'Refueling', id))
    setLoading(false)
  }

  const [createSchedule, setCreateSchedule] = useState(false)

  const openStaffScheduleForm = () => {
    setCreateSchedule(true)
    setTaskID(refuelings[0].id)
    setType('Refueling')
    setDate(refuelings[0].date)
  }

  const closeStaffScheduleForm = () => {
    setCreateSchedule(false)
    setID('')
  }
  const insertSchedule = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    closeStaffScheduleForm()
    console.log(taskID)
    if (type === 'Refueling'){
      await updateDoc(doc(getDatabase(),'Refueling',taskID),{staffID:staffID})
    }

    insert('StaffSchedule', {
      staffID:staffID,
      date:date,
      taskID:taskID,
      type:type
    })
    setLoading(false)
  }

  const updateSchedule = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    closeStaffScheduleForm()
    // console.log(id)
    // console.log(staffSchedules)

    if (staffSchedules.filter(p => p.id === id)[0].task === 'Refueling'){
      await updateDoc(doc(getDatabase(),'Refueling',staffSchedules.filter(p => p.id === id)[0].taskID),{staffID:''})
    }
    if (type === 'Refueling'){
      setDate(refuelings.filter(p => taskID === p.id)[0].date)
      await updateDoc(doc(getDatabase(),'Refueling',taskID),{staffID:staffID})
    }
    console.log(type, taskID, id, date)
    await updateDoc(doc(getDatabase(), 'StaffSchedule',id),{
      date:date,
      taskID:taskID,
      type:type
    })

    setLoading(false)
  }

  const [date, setDate]= useState<Date>()
  const [taskID, setTaskID] = useState('')
  const [type, setType] = useState('Refueling')

  const handleType = (e:any) => {
    setType(e.target.value)

    console.log(e.target.value)
    if (e.target.value === 'Refueling'){
      setTaskID(refuelings[0].id)
    }
    else if (e.target.value === 'Baggage'){
      setTaskID(bagggages[0].id)
    }
    else if (e.target.value === 'Cleaning'){
      setTaskID(t[0].id)
    }
    console.log(taskID)
    // console.log(taskID)
  }

  const scheduleForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
  <button onClick={closeStaffScheduleForm}>Close</button>
  <h1 className="font-bold text-center">{id === ''?'Create':'Update'} Staff Schedule</h1>
  <h1>Type of Schedule</h1>
  <select name="" id="" onChange={e => {handleType(e)}}  className="border-2 border-solid border-blue-100 rounded-lg my-3">
    <option value="Refueling">Refueling</option>
    <option value="Baggage">Baggage</option>
    <option value="Cleaning">Cleaning</option>
  </select>
  {type === 'Refueling' && <h1>Choose Refueling Date</h1>}
  {type === 'Baggage' && <h1>Choose Baggage to be Handled</h1>}
  {type === 'Cleaning' && <h1>Choose Transportation to be Cleaned</h1>}

  <select onChange={e => {
    console.log(e.target.value);
    if (type === 'Refueling'){
      setDate(refuelings.filter(p => e.target.value === p.id)[0].date)
    };
    setTaskID(e.target.value)}}
    className="border-2 border-solid border-blue-100 rounded-lg my-3">
  {type === 'Refueling' && refuelings.map(e => <option value = {e.id}>{e.date.getDate()} - {e.date.getMonth() + 1} {e.date.getFullYear()}</option>)}
  {type === 'Baggage' && bagggages.map(e => <option value = {e.id}>{e.content}</option>)}
  {type === 'Cleaning' && t.map(e => <option value = {e.id}>{e.name}</option>)}
  </select>


  <br />
  {(type === 'Cleaning' || type === 'Baggage') && <input type="date" onChange={e => setDate(new Date(e.target.value))}/>}
  <button onClick={id !== ''?updateSchedule:insertSchedule} className="bg-green-400 px-2 my-5 text-slate-100 font-bold rounded-lg my-3 w-full">Submit</button>
</div>

  const removeSchedule = async (id:string) => {
    setLoading(true)
    if (staffSchedules.filter(e => e.id == id)[0].task === 'Refueling'){
      await updateDoc(doc(getDatabase(),'Refueling',staffSchedules.filter(e => e.id == id)[0].taskID),{staffID:''})
    }
    await deleteDoc(doc(getDatabase(),'StaffSchedule', id))


    setLoading(false)
  }

  return (<>
    {(isUpdate || openRefueling || createSchedule) && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-90 t-0 l-0"></div>}
    {isLoading && loading}
    {openRefueling && refuelingForm}
    {isUpdate && updateBaggageForm}
    {createSchedule && scheduleForm}
    <Home></Home>
    <div style={{display:"flex",columnGap:20}}>
      <button onClick={openBaggage} className={showBaggage ? 'font-bold':''}>Bagggages</button>
      <button onClick={openShowRefueling} className={showRefueling ? 'font-bold':''}>Refueling Schedules</button>
      <button onClick={openShowStaffs} className={showStaffs ? 'font-bold':''}>Staffs</button>
      <button onClick={openRefuelingForm} className={openRefueling ? 'font-bold':''}>Create Refueling Schedule</button>
    </div>
    <div className="flex flex-wrap mt-2">
            {
              showBaggage && bagggages.map(e => <div className="w-2/5 p-4 bg-slate-100 shadow-2xl mx-4" key = {e.id}>
                <h1 className="font-bold">{e.content}</h1>
                <h1>status : {e.status}</h1>
                <button onClick={() => openBaggageForm(e.id)} className="px-4 py-1 bg-blue-400 rounded-lg text-slate-100 font-bold">Update</button>
              </div>)
            }
            {
              showRefueling && refuelings.map(e => <div className="w-2/5 p-4 bg-slate-100 shadow-2xl mx-4" key = {e.id}>
                <h1>{e.date.getDate()} - {e.date.getMonth() +1} {e.date.getFullYear()}</h1>
                <p>refueling for {t.filter(t => t.id === e.transportID)[0].name}</p>
                <p>amount : {e.amount}</p>
                <p>{e.staffID === ''?'unassigned': `handled by ${e.staffID}`}</p>
                <div className="flex">
                  <button className="font-bold bg-red-400 px-2 py-1 text-slate-100" onClick={() => removeRefueling(e.id)}>Remove</button>
                  <button className="font-bold bg-blue-400 px-2 py-1 text-slate-100" onClick={() => {
                    setRefuelID(e.id)
                    setUpdateRefueling(true)
                    openRefuelingForm()
                  }}>Update</button>
                </div>
              </div>)
            }
            {
              showStaffs && staffs.map(e => <div key = {e.id} className="w-2/5 p-2 bg-slate-100 shadow-2xl mx-4">
                <div className="flex gap-x-10 justify-between border-b-2 items-center border-blue-200 py-2">
                  <h1 className="font-bold">{e.email}</h1>
                    <button className="font-bold bg-green-400 px-2 py-1 text-slate-100" onClick={() =>{
                      setStaffID(e.id)
                      openStaffScheduleForm()
                    }}>Create Schedule</button>
                </div>
                <h1 className="">Schedules</h1>
                {staffSchedules.filter(p => p.staffID === e.id).map(p => <div key = {p.id} className="flex justify-between my-2 gap-x-5">
                  <h1>{p.task} at {p.date.getDate()}-{p.date.getMonth() + 1} {p.date.getFullYear()}</h1>
                  <button className="font-bold bg-red-400 px-2 py-1 text-slate-100" onClick={() => removeSchedule(p.id)}>Remove</button>
                  <button className="font-bold bg-blue-400 px-2 py-1 text-slate-100" onClick={() => {
                    setID(p.id)
                    setStaffID(p.staffID)
                    openStaffScheduleForm()
                  }}>Update</button>
                </div>)}
              </div>)
            }
      </div>


  </>)
}

export default GroundHandlingHome
