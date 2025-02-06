import { getDatabase } from "@renderer/database/database"
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Home from "../home/Home"
import { checkUser } from "@renderer/middleware/Middleware"
import Error from "./error"

export function TrainingDetail():JSX.Element{

  const tr = useParams()

  interface Training {
    id:string,
    name:string,
    createdBy:string,
    startDate:Date,
    endDate:Date,
    trainees : string[],
    trainers :string[],
    topic:string,
  }

  const [name,setName] = useState('')
  const [startDate,setStartDate] = useState(new Date())
  const [endDate,setEndDate] = useState(new Date())
  const [topic,setTopic] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([''])
  const [update,setUpdate] = useState(false)
  const [trainer,setTrainer] = useState<string[]>([])
  const [trainees,setTrainees] = useState<string[]>([])

  useEffect(()=> {
    const q = query(collection(getDatabase(),'employee'),
    )
      onSnapshot(q, (snapshot) =>{
        setEmployees(snapshot.docs.map((doc) => doc.data().email))

      })

  }, [employees])


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



  const loading = <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white'}}><h1>Loading</h1></div>
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
  const [trainings, setTrainings] = useState<Training[]>([])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Training'),where('__name__','==',tr.id))
    onSnapshot(q, (snapshot) => {
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
  }, [trainings])


  const openUpdateForm = () =>{
    setField([])
    setField1([])
    setTrainees([])
    setTrainer([])
    setUpdate(true)
  }

  const hideUpdateForm = () => {
    setField([])
    setField1([])
    setTrainees([])
    setTrainer([])
    setUpdate(false)
  }

  const updateTraining= async (w:any) => {
    w.preventDefault()
    hideUpdateForm()
      setLoading(true)
      await updateDoc(doc(getDatabase(),'Training', trainings[0].id), {
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
  }


const updateForm = <form onSubmit={updateTraining} style={{position:"fixed",zIndex:99,backgroundColor:'gray',color:'black'}}>
<button onClick={hideUpdateForm}>Close</button>
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

if (checkUser('Human Resources Director'))
  return (<div>
    <Home></Home>
    {update && updateForm}
    {isLoading && loading}
    <button onClick={openUpdateForm}>Update Training</button>
  {trainings.filter(e => (e.createdBy == 'Human Resources Director')).map((e) => (
    <div key = {e.id} style = {{margin:20, display:'flex'}}>
    <div>
        <div>
          <h4>{e.name}</h4>
          <h4>{e.startDate.toString()} to {e.endDate.toString()}</h4>
          <h4>{e.topic}</h4>
          <h1>Trainers</h1>
          {e.trainers.map(e2 => <p>{e2}<br></br></p>)}
          <h1>Trainees</h1>
          {e.trainees.map(e2 => <p>{e2}<br></br></p>)}
        </div>
    </div>
    </div>
  ))}
  </div>)
  else
  return (
    <Error value = "you're not authorized"></Error>
  )
}
