import { checkUser } from "@renderer/middleware/Middleware"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import Home from "../home/Home"
import Error from "./error"
import { addDoc, collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore"
import { getDatabase } from "@renderer/database/database"

function ViewTraining():JSX.Element{
  const training = {
    id:'',
    name:'',
    createdBy:'',
    startDate:new Date(),
    endDate:new Date(),
    trainees : [
      ''
    ],
    trainers :[''],
    topic:'',
  }

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

  const [name,setName] = useState('')
  const [startDate,setStartDate] = useState(new Date())
  const [endDate,setEndDate] = useState(new Date())
  const [topic,setTopic] = useState('')
  const [trainer,setTrainer] = useState<string[]>([])
  const [trainees,setTrainees] = useState<string[]>([])
  const [trainings, setTrainings] = useState([training])
  const [isCreate, setCreate] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([''])

  useEffect(()=> {
    const q = query(collection(getDatabase(),'employee'),
    )
      onSnapshot(q, (snapshot) =>{
        setEmployees(snapshot.docs.map((doc) => doc.data().email))

      })

  }, [employees])



  const field  = (
    <select name="" id="" onChange={e => setTrainees([...trainees,e.target.value])}>
      {employees.map(e => (<option key = {e} value = {e}>{e}</option>))}
    </select>
    )
  const field2 = (
    <input type="text" onChange={e => setTrainer([...trainer,e.target.value])}/>
    )

  const [skillFields,setField] = useState<JSX.Element[]>([])
  const [expFields,setField1] = useState<JSX.Element[]>([])

  const addTrainees = (e:any) => {
    e.preventDefault()
    if (skillFields.length < employees.length){
      console.log(skillFields.length)
      console.log(employees)
      trainees.push(employees[skillFields.length])
      console.log(trainees)
      setField([...skillFields,field])
    }

  }

  const addTrainer = (e:any) => {
    e.preventDefault()
    setField1([...expFields,field2])

  }

  const deleteTrainee = (e:any) => {

    e.preventDefault()
    setField(skillFields.slice(0,skillFields.length - 1))
  }
  const deleteTrainer = (e:any) => {
    e.preventDefault()
    setField1(expFields.slice(0,expFields.length - 1))
  }



  const openCreateForm = () =>{
    setField([])
    setTrainees([])
    setField1([])
    setTrainer([])
    setCreate(true)
  }

  const hideCreateForm = () => {
    setField([])
    setField1([])
    setTrainees([])
    setTrainer([])
    setCreate(false)
  }

  const insertTraining = async (e:any) => {
    e.preventDefault()

    console.log(trainees)
    console.log(trainer)
    if (trainees.length > 0 && trainer.length > 0){
      // insert('Training',{
      //   name:name,
      //   createdBy:'Human Resources Director',
      //   startDate:startDate,
      //   endDate:endDate,
      //   trainees:trainees,
      //   trainer:trainer,
      //   topic:topic
      // }).then(
      //   () => hideCreateForm
      // )

      hideCreateForm()
      //show loading
      setLoading(true)
      await addDoc(collection(getDatabase(),'Training'), {
          name:name,
          createdBy:'Human Resources Director',
          startDate:startDate,
          endDate:endDate,
          trainees:trainees,
          trainers:trainer,
          topic:topic
      })
        //hide loading
        setLoading(false)

    }else{
      console.log('a')
    }
  }

  const loading = <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white'}}><h1>Loading</h1></div>

  const createForm = <form onSubmit={insertTraining} style={{position:"fixed",zIndex:99,backgroundColor:'gray',color:'black'}}>
    <button onClick={hideCreateForm}>Close</button>
    <p>Name</p> <br />
    <input required type="text" onChange={e => setName(e.target.value)}/> <br />
    <p>Start Date</p> <br />
    <input required type="date" name="" id="" onChange={e => setStartDate(new Date(e.target.value))}/> <br />
    <p>End Date</p> <br />
    <input required type="date" name="" id="" onChange={e => setEndDate(new Date(e.target.value))}/> <br />
    <p>Topic</p> <br />
    <input required type="text" onChange={e => setTopic(e.target.value)}/> <br />
    <button onClick={addTrainees}>add trainee</button><button onClick={deleteTrainee}>remove trainee</button><br></br>
    <div style={{display:"flex",flexWrap:"wrap"}}>
      {skillFields.map(e => e)} <br />
    </div>
    <button onClick={addTrainer}>add trainer</button><button onClick={deleteTrainer}>remove trainer</button> <br />
    <div>
    {expFields.map(e => e)}
    </div>
    <br />
    <button type="submit">Submit</button>
  </form>




  useEffect(() => {
    const q = query(collection(getDatabase(),'Training'),
    )
      onSnapshot(q, (snapshot) =>{
        setTrainings(snapshot.docs.map(doc => ({
          id: doc.id,
          createdBy: doc.data().createdBy,
          name: doc.data().name,
          startDate:doc.data().startDate.toDate(),
          endDate:doc.data().endDate.toDate(),
          topic:doc.data().topic,
          trainees:doc.data().trainees,
          trainers:doc.data().trainers
        })))
      })
  },[trainings])

  const removeTraining = async(id:string) => {
    await deleteDoc(doc(getDatabase(),'Training',id)).then(
      () => {window.location.href = '/training_employee'})
  }


  if (checkUser('Human Resources Director'))
  return (<div>
    {isCreate && createForm}
    {isLoading && loading}
    <NavLink to = '/HRD_Home'>
    <Home></Home>
    </NavLink>
    {navbar}
    <button onClick={openCreateForm}>Create Training</button>
  {trainings.filter(e => (e.createdBy == 'Human Resources Director')).map((e) => (
    <div key = {e.id} style = {{margin:20, display:'flex'}}>
    <NavLink  to = {`/training_employee/${e.id}`}>
        <div>
          <h4>{e.name}</h4>
          <h4>{e.startDate.toString()}</h4>
        </div>
    </NavLink>
        <button onClick={() => (removeTraining(e.id))}>Remove</button>
    </div>
  ))}
  </div>)
  else
  return (
    <Error value = "you're not authorized"></Error>
  )
}

export default ViewTraining

