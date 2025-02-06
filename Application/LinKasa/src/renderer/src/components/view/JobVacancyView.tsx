import { useParams } from "react-router-dom"
import Home from "../home/Home"
import { getDatabase } from "@renderer/database/database"
import { useEffect, useState } from "react"
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"

export function JobVacancyView():JSX.Element{

  const param = useParams()

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

  interface JobVacancy{
    id:string,
    name:string,
    openFrom:Date,
    openTo:Date,
    role:string,
    applicants:string[],
    description:string
  }

  const [jobVacancies, setJobVacancies] = useState<JobVacancy[]>([])
  const [isCreate, setCreate] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [name,setName] = useState('')
  const [openFrom, setOpenFrom] = useState<Date>()
  const [openTo, setOpenTo] = useState<Date>()
  const [description, setDescription] = useState('')
  const [role, setRole] = useState('')

  const openCreateForm = () =>{
    setCreate(true)
  }

  const hideCreateForm = () => {
    setCreate(false)
  }


  useEffect(() => {
    const q= query(collection(getDatabase(),'JobVacancy'), where('__name__', '==', param.id))
    onSnapshot(q, (snapshot) => {
      setJobVacancies(snapshot.docs.map(doc => ({
        id:doc.id,
        name:doc.data().name,
        openFrom:doc.data().openFrom.toDate(),
        openTo:doc.data().openTo.toDate(),
        role:doc.data().role,
        applicants:doc.data().applicants,
        description:doc.data().description
      })))
    })
  }, [jobVacancies])

  const updateJobVacancy = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    hideCreateForm()
    await updateDoc(doc(getDatabase(),'JobVacancy',jobVacancies[0].id), {
      ...jobVacancies[0],
      name:name,
      openFrom:openFrom,
      openTo:openTo,
      description:description,
      role:role,
    })
    setLoading(false)
  }

  const loading = <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white'}}><h1>Loading</h1></div>

  const jobVacancyForm =<form onSubmit={updateJobVacancy} style={{position:"fixed",zIndex:99,backgroundColor:'gray',color:'black'}}>
  <button onClick={hideCreateForm}>Close</button>
  <p>Name</p> <br />
  <input required type="text" onChange={e => setName(e.target.value)}/> <br />
  <p>Start Date</p> <br />
  <input required type="date" name="" id="" onChange={e => setOpenFrom(new Date(e.target.value))}/> <br />
  <p>End Date</p> <br />
  <input required type="date" name="" id="" onChange={e => setOpenTo(new Date(e.target.value))}/> <br />
  <p>Description</p> <br />
  <textarea required onChange={e => setDescription(e.target.value)}/> <br />
  <br />
  <label htmlFor="role">Role</label> <br />
  <select name="" id="role" onChange={e => {setRole(e.target.value)}}>
    {list.map(
      (e) => (<option value ={e} key = {e}>{e}</option>)
    )}
  </select>
  <button type="submit">Submit</button>
</form>


  return (
  <div>
    <Home></Home>
    {isCreate && jobVacancyForm}
    {isLoading && loading}
    {jobVacancies.map(e => <div>
      <h1>{e.name}</h1>
      <h4>starts from {e.openFrom.getDate()}-{e.openFrom.getMonth() + 1} {e.openFrom.getFullYear()} to {e.openTo.getDate()}-{e.openTo.getMonth() + 1} {e.openTo.getFullYear()}</h4>
      <h4>{e.role}</h4>
      <p>{e.description}</p>
      <h1>Applicants</h1>
      {e.applicants.map(e => <h4>{e}</h4>)}
    <button onClick={openCreateForm} className="p-2 border-2 border-solid bg-blue-600 text-slate-100">Update</button>
    </div>)}
  </div>
  )
}

export default JobVacancyView
