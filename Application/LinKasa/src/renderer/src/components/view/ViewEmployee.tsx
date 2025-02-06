import { checkUser } from "@renderer/middleware/Middleware";
import Error from "./error";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { getDatabase } from "@renderer/database/database";
import { NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Home from "../home/Home";

function ViewEmployee():JSX.Element{

  const navbar = <div style={{display:'flex'}} className="gap-x-5 mt-5">
    <button onClick={()=>{
      window.location.href = '/job_registrants'
    }}>Add Employee</button>
    <button onClick={() => {window.location.href = '/view_employee'}}>
      Employees
    </button>
    <button onClick={() => {window.location.href = '/training_employee'}}>
      Training
    </button>
  </div>

  const employee = {
    id:'',
    name:'',
    dob:new Date(),
    role:'',
    skill:[
    ],
    experiences:[
    ]
  }

  const [employees, setEmployees] = useState([employee])

  useEffect(()=> {
    const q = query(collection(getDatabase(),'employee'),
    //  where('email','!=',getAuth().currentUser?.email)
    )
      onSnapshot(q, (snapshot) =>{
        setEmployees(snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().email,
          dob: doc.data().DOB.toDate(),
          role:doc.data().role,
          skill:doc.data().skill,
          experiences:doc.data().experiences
        })))

      })


  }, [])


  if (checkUser('Human Resources Director'))
  return (<div >
    <NavLink to = '/HRD_Home'>
    <Home></Home>
    </NavLink>
    {navbar}
  {employees.filter(e => (e.name !== getAuth().currentUser?.email)).map((e) => (
    <NavLink key = {e.id} to = {`/view_employee/${e.id}`}>
      <div style = {{margin:20}}>
        <h4>{e.name}</h4>
        <p>{e.role}</p>
      </div>
    </NavLink>

  ))}
  </div>)
  else
  return (
    <Error value = "you're not authorized"></Error>
  )
}

export default ViewEmployee
