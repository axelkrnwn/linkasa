import { getDatabase, insert } from "@renderer/database/database"
import { collection, onSnapshot, query } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function ChatRoomForm (props:any):JSX.Element{

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
    const q = query(collection(getDatabase(),'employee'))
    onSnapshot(q, snapshot => {
      setEmployees(snapshot.docs.map(e => ({
        email:e.data().email,
        role:e.data().role
      })))
    })
  },[employees])

  const [name,setName] = useState('')
  const [members, setMembers] = useState<string[]>([])

  const addRoom = (e:any) => {
    e.preventDefault()
    props.func()
    console.log(members)
    if (byRole){
      console.log(employees)
      console.log(employees.filter(e => e.role === role && e.email !== props.email).map(e => e.email))
      employees.filter(e => e.role === role).map(e => members.push(e.email))
    }
    insert('Chatroom',{
      name:name,
      createdAt:new Date(),
      members:[...members, props.email]
    })
  }

  const [byRole,setByRole] = useState(false)
  const [role,setRole] = useState('')


  return (<>
    <div style={{position:"fixed",backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg  overflow-scroll drop-shadow-xl h-3/4 z-50 overflow-y-auto">
      <button onClick={() => {setMembers([]);props.func()}}>Back</button>
      <h1 className="font-bold text-center">Create Chat Room</h1>
      <button onClick={addRoom} className="my-4 px-4 bg-green-400 font-bold text-white rounded-lg py-1 w-full">Submit</button> <br />
      <label className = "my-3" htmlFor="n">Chat Room Name</label>
      <br />
      <input type="text" id = "n" className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setName(e.target.value)} required/> <br />

      <div>
        <input type="checkbox" name="" id="r" onChange={e => {setMembers([]);setRole(list[0]);setByRole(e.target.checked)}} checked = {byRole}/><label htmlFor="r">Choose By Role</label>
      </div>
      <h1>Members</h1>

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
