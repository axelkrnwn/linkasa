import { getDatabase, insert } from "@renderer/database/database"
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function BroadcastForm (props:any):JSX.Element{

  const list =
  [
    "Human Resources Director",
    "Maintenance Manager",
    "CFO",
    "Cargo Manager",
    "Flight Operation Manager",
    "Airport Operation Manager",
    "Cargo Handler",
    "Gate Agent",
    "Check-in Staff",
    "Baggage Security Supervisor",
    "Lost and Found Staff",
    "Information Desk Staff",
    "Customer Service Manager",
    "Landside Operations Manager",
    "CEO",
    "Customs And Border Control Officer",
    "Logistic Manager",
    "Fuel Manager",
    "Ground Handling Manager",
    "Ground Handling Staff",
    "Maintenance Staff"
  ]


  interface Employee{
    email:string,
    role:string,
  }
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    if (props.isUpdate){
      setName(props.broadcast.message)
      setByRole(true)
      setPriority(props.broadcast.priority)
      setMembers(props.broadcast.recipients)
    }
  },[])

  useEffect(() => {
    const q = query(collection(getDatabase(),'employee'))
    onSnapshot(q, snapshot => {
      setEmployees(snapshot.docs.map(e => ({
        email:e.data().email,
        role:e.data().role
      })))
    })
  },[employees])

  const [name,setName] = useState('')
  const [priority, setPriority] = useState(1)
  const [members, setMembers] = useState<string[]>([])
  const [role,setRole] = useState('')

  const addBroadcast = (e:any) => {
    e.preventDefault()
    props.func()
    if (byRole){
      console.log(employees)
      console.log(employees.filter(e => e.role === role).map(e => e.email))
      employees.filter(e => e.role === role).map(e => members.push(e.email))
    }

    insert('Broadcast',{
      name:name,
      createdAt:new Date(),
      priority:priority,
      recipients:members
    })
  }

  const [isLoading,setLoading] = useState(false)

  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0,zIndex:99}}><h1>Loading</h1></div>

  const updateBroadcast = async (e:any)=> {
    e.preventDefault()
    setLoading(true)
    console.log(name,priority,members)
    await updateDoc(doc(getDatabase(), 'Broadcast', props.broadcast.id), {
      name:name,
      priority:priority,
      recipients:members
    })
    setLoading(false)
    props.func()
  }


  const [byRole,setByRole] = useState(false)

  return (<>
    {isLoading && loading}
    <div style={{position:"fixed",backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg  overflow-scroll drop-shadow-xl h-3/4 z-50 overflow-y-auto">
      <button onClick={() => {setMembers([]);props.func()}}>Back</button>
      <h1 className="font-bold text-center">Broadcast Form</h1>
      <button onClick={props.isUpdate?updateBroadcast:addBroadcast} className="my-4 px-4 bg-green-400 font-bold text-white rounded-lg py-1 w-full">Submit</button> <br />
      <label className = "my-3" htmlFor="n">Message</label>
      <br />
      <input type="text" id = "n" className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setName(e.target.value)} required defaultValue={props.isUpdate && name}/> <br />
      <input type="range" name="" id="" onChange={e => setPriority(parseInt(e.target.value))} min={1} max={3} value={priority}/>
      <h1>Recipients</h1>
      <div>
        <input type="checkbox" name="" id="r" onChange={e => {setMembers([]);setRole(list[0]);setByRole(e.target.checked)}} checked = {byRole}/><label htmlFor="r">Choose By Role</label>
      </div>
      {byRole?
      <select name="" id="" onChange={e => setRole(e.target.value)}>
        {list.map(e => <option key = {e} value = {e}>{e}</option>)}
      </select>
      :
      employees.filter(e => e.email !== props.email).map(e => <>
        <div className="flex gap-x-3 my-5">
          <input type="checkbox" name="" id={e.email} value = {e.email} onChange={e => {setMembers(pre => [...pre, e.target.value]); console.log(members)}}/>
          <label htmlFor={e.email}>{e.email}</label>
          <br />
        </div>
        </>
        )
      }


    </div>
  </>)
}
