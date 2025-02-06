import { useEffect, useState } from "react"
import Home from "./Home"
import { NavLink } from "react-router-dom"
import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore"
import { getDatabase } from "@renderer/database/database"

export function CivilEngineerHome():JSX.Element{

  const project:{id:string,name:string, description:string, startDate:Date, status:string} = {
    id:"",
    name:"",
    description:"",
    startDate:new Date(),
    status:"",
  }

  const [projectPlans, setProjectPlans] = useState([project])

  useEffect(() => {
    const q = query(collection(getDatabase(),'ProjectPlan'))
    onSnapshot(q, (snapshot) =>{
      setProjectPlans(snapshot.docs.map((p) => (
          {
            id:p.id,
            name:p.data().name,
            description:p.data().description,
            startDate:p.data().startDate.toDate(),
            status:p.data().status,
          }
      )))
    })

  }, [projectPlans])

  const handleUpdate = (id:string) => {
    window.location.href = `/update_project_plan/${id}`
  }

  const createProjectPlan = () => {
    window.location.href = '/create_project_plan'
  }

  const removeProject = async (id:string) => {
    await deleteDoc(doc(getDatabase(), 'ProjectPlan',id))
  }

  return (<div>
    <Home></Home>
    <div>
      <button onClick={createProjectPlan}>Create new Project</button>
    </div>
    <h1>OnGoing Projects</h1>
    {projectPlans.filter(e => e.startDate.getTime() < new Date().getTime()).map((e) => <div key = {e.id}>
      <NavLink  to = {`/project_detail/${e.id}`}>
        <div className="my-5">
          <h3>{e.name}</h3>
          <h4>{e.startDate.toString()}</h4>
        </div>
      </NavLink>
      <button onClick={() => handleUpdate(e.id)}>Update Project Plan</button>
       <button onClick={() => removeProject(e.id)}>Remove</button>
    </div>
    )}
    <h1>Upcoming Project</h1>
    {projectPlans.filter(e => e.startDate.getTime() > new Date().getTime()).map((e) =>
    <NavLink key = {e.id} to = {`/project_detail/${e.id}`}>
      <div className="my-5">
        <h3>{e.name}</h3>
        <h4>{e.startDate.toString()}</h4>
        <button onClick={() => handleUpdate(e.id)}>Update Project Plan</button>
      </div>
    </NavLink>
    )}
  </div>)
}

export default CivilEngineerHome
