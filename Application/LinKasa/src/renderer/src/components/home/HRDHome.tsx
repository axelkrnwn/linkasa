import { NavLink, useParams } from "react-router-dom";
import Home from "./Home";
import SuccessMsg from '../message/successMsg';
import { checkUser } from "@renderer/middleware/Middleware";
import Error from "../view/error";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { getDatabase, insert } from "@renderer/database/database";
import InterviewForm from "../view/InterviewForm";


export function HRDHome():JSX.Element{



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

  const msg = useParams()
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

  const insertJobVacancy = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    hideCreateForm()
    await insert('JobVacancy',{
      name:name,
      openFrom:openFrom,
      openTo:openTo,
      description:description,
      role:role,
      applicants:[]
    })
    setJobVacancies([])
    setLoading(false)
  }

  const [showInterview,setShowInterview] = useState(false)
  const [showVacancy,setShowVacancy] = useState(true)
  const [isCreateInterview, setCreateInterview] = useState(false)

  const openVacancy = () => {
    setShowInterview(false)
    setShowVacancy(true)
  }
  const openInterview = () => {
    setShowInterview(true)
    setShowVacancy(false)
  }
  const navbar = <div style={{display:'flex'}} className="gap-x-5 mt-5">
    <button onClick={openVacancy}>
      Job Vacancy
    </button>
    <button onClick={()=>{
      window.location.href = '/job_registrants'
    }}>Add Employee</button>
    <button onClick={() => {window.location.href = '/view_employee'}}>
      Employees
    </button>
    <button onClick={openCreateForm}>
      Add Job Vacancies
    </button>
    <button onClick={() => {window.location.href = '/training_employee'}}>
      Training
    </button>
    <button onClick={openInterview} className={showInterview?'font-bold':''}>Interview
    </button>
  </div>

  const jobVacancyForm =<form onSubmit={insertJobVacancy} style={{position:"fixed",zIndex:99,backgroundColor:'gray',color:'black'}}>
    <button onClick={hideCreateForm}>Close</button>
    <p>Name</p> <br />
    <input required type="text" onChange={e => setName(e.target.value)}/> <br />
    <p>Start Date</p> <br />
    <input required type="date" name="" id="" onChange={e => setOpenFrom(new Date(e.target.value))}/> <br />
    <p>End Date</p> <br />
    <input required type="date" name="" id="" onChange={e => setOpenTo(new Date(e.target.value))}/> <br />
    <p>Topic</p> <br />
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



  interface JobVacancy{
    id:string,
    name:string,
    openFrom:Date,
    openTo:Date,
    role:string,
  }



  const loading = <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white'}}><h1>Loading</h1></div>


  const [jobVacancies, setJobVacancies] = useState<JobVacancy[]>([])

  useEffect(() => {
    const q= query(collection(getDatabase(),'JobVacancy'))
    onSnapshot(q, (snapshot) => {
      setJobVacancies(snapshot.docs.map(doc => ({
        id:doc.id,
        name:doc.data().name,
        openFrom:doc.data().openFrom.toDate(),
        openTo:doc.data().openTo.toDate(),
        role:doc.data().role
      })))
    })
  }, [jobVacancies])

  const removeJobVacancy = async (id:string) => {
    setLoading(true)

    await deleteDoc(doc(getDatabase(),'JobVacancy',id))

    setLoading(false)
  }


  interface Interview{
    id:string,
    jobRegistrantID:string,
    schedule:Date,
  }
  const [interviews,setInterviews] = useState<Interview[]>([])
  useEffect(() => {
    const q = query(collection(getDatabase(), 'Interview'))
    onSnapshot(q, snapshot => {
      setInterviews(snapshot.docs.map(e => ({
        id:e.id,
        jobRegistrantID:e.data().jobRegistrantID,
        schedule:e.data().schedule.toDate()
      })))
    })
  }, [interviews])

  interface JobRegistrant{
    id:string,
    name:string,
  }
  const [jobRegistrants,setJobRegistrants] = useState<JobRegistrant[]>([])
  useEffect(() => {
    const q = query(collection(getDatabase(), 'JobRegistrant'))
    onSnapshot(q, snapshot => {
      setJobRegistrants(snapshot.docs.map(e => ({
        id:e.id,
        name:e.data().name
      })))
    })
  }, [jobRegistrants])

  const removeInterview = async (id:string) => {
    setLoading(true)
    await deleteDoc(doc(getDatabase(), 'Interview',id))
    setLoading(false)
  }

  const [id,setID] = useState('')
  const [schedule, setSchedule] = useState<Date>(new Date())
  const [isUpdate, setUpdate] = useState(false)
  const [name2, setName2] = useState('')

  if (checkUser('Human Resources Director')){
    return (
    <div>
      <Home></Home>
      {navbar}
      {isCreate && jobVacancyForm}
      {isLoading && loading}
      {(isCreateInterview || isUpdate) &&
      <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-40 t-0 l-0"></div>}
      {isCreateInterview && <InterviewForm func = {() => setCreateInterview(false)}></InterviewForm>}
      {isUpdate && <InterviewForm func = {() => setUpdate(false)} isUpdate={true} name = {name2} id = {id} schedule = {schedule}></InterviewForm>}
      {showVacancy && jobVacancies.map(e => {
        return <NavLink to = {`/job_vacancies/${e.id}`} key = {e.id}  >
          <div className="bg-slate-100 m-5 p-3">
          <h1>{e.name}</h1>

          <h4>{e.openFrom.toString()} to {e.openTo.toString()}</h4>
          <h4>Required Role : {e.role}</h4>
          <button onClick={() => {removeJobVacancy(e.id)}} className="border-solid border-2 p-2 bg-red-400 text-slate-100">Remove</button>
          </div>
        </NavLink>
      })}
      {showInterview && <>
      <div>
        <button onClick={() => setCreateInterview(true)}>Schedule Interview</button>
      </div>
      <div className="px-5">
        {interviews.map(e => <>
        <div className="bg-white w-full p-3 my-3">
          <h1>{e.id}</h1>
          <h1>{jobRegistrants.filter(p => p.id === e.jobRegistrantID).map(p => p.name)}</h1>
          <h1>{e.schedule.toString()}</h1>
          <button onClick={() => {
            setID(e.id)
            setSchedule(e.schedule)
            setUpdate(true)
            setName2(jobRegistrants.filter(p => p.id === e.jobRegistrantID).map(p => p.name)[0])
          }} className="border-solid border-2 p-2 bg-blue-400 text-slate-100">Update</button>
          <button onClick={() => removeInterview(e.id)} className="border-solid border-2 p-2 bg-red-400 text-slate-100">Remove</button>
        </div>
        </>)}
      </div>
      </>}
      {msg.success && <SuccessMsg msg = "employee successfully created!"></SuccessMsg>}
    </div>
    );
  }else{
    return (
      <Error value = "You're Not Authorized"></Error>
    )
  }
}

export default HRDHome;
