import { checkUser } from "@renderer/middleware/Middleware"
import Error from "./error"
import { useParams } from "react-router-dom"
import { getDatabase } from "@renderer/database/database"
import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"

function EmployeeDetail():JSX.Element{

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


  const emp = useParams()

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

  const [e, setEmployees] = useState([employee])
  const [training,setTrainng] = useState([''])

  useEffect(()=> {
    const q = query(collection(getDatabase(),'employee'),where('__name__','==',emp.id))

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


  }, [e])

  useEffect(() => {
    const q = query(collection(getDatabase(),'Training'))
    onSnapshot(q, (snapshot) =>{
      setTrainng(snapshot.docs.map(e => e.data().name))
    })
  },[training])

  const remove = async (id:string) => {
    await deleteDoc(doc(getDatabase(),'employee',id)).then(
      () => {window.location.href = '/view_employee'
  })
  }


  const [dob,setDob] = useState(new Date())
  const [skill,setSkill] = useState<string[]>(e[0].skill)
  const [exp,setExp] = useState<string[]>(e[0].experiences)
  const [role,setRole] = useState('')
  const [isUpdate,setUpdate] = useState(false)


  const hideUpdateForm=() => {
    setField([])
    setField1([])
    setSkill([])
    setExp([])
    setUpdate(false)
  }
  const update = async (p:any) => {
    p.preventDefault()
    setExp([])
    setSkill([])
    //5-6
    for (let i = 0;i < skillFields.length;i++){
      if (p.target[i+5].value != '')
        skill.push(p.target[i+5].value)
      else{
        skill.push(e[0].skill[i])
        // setSkill((prev) => [...prev,e[0].skill[i]])
      }

  }

  console.log(expFields.length)
  for(let i = 0;i < expFields.length;i++){
    if (p.target[i+ 7 + skillFields.length].value != ''){
      exp.push(p.target[i+7+skillFields.length].value)
      console.log(exp)
    }
    else
      exp.push(e[0].experiences[i])
  }
    // setSkill([...skill,p.target[6].value])
    //9-10
    // console.log(exp)
    console.log(skill)


    const ref = getDatabase()
        await updateDoc(doc(ref,"employee",e[0].id), {
          dob:dob,
          skill:skill,
          role:role,
          experiences:exp
    }).then(() => hideUpdateForm())

  }


  const field  = (
    <input type="text" />
    )
  const field2 = (
    <input type="text" />
    )

  const [skillFields,setField] = useState<JSX.Element[]>([])
  const [expFields,setField1] = useState<JSX.Element[]>([])

  const fillSkill = () => {

    setField(e[0].skill.map((s) => (<input type="text" placeholder = {s} />)))
  }

  const fillExp = () => {
    setField1(e[0].experiences.map((s) => (<input type="text" placeholder = {s} />)))
  }


  const deleteField = (e:any) => {
    e.preventDefault()
    setField(skillFields.slice(0,skillFields.length - 1))
  }

  const addField = (e:any) => {
    e.preventDefault()
    if (skillFields.length < 2)
    setField([...skillFields,field])
  }
  const deleteField2 = (e:any) => {
    e.preventDefault()
    setField1(expFields.slice(0,expFields.length - 1))
  }

  const addField2 = (e:any) => {
    e.preventDefault()
    if (expFields.length < 2)
    setField1([...expFields,field2])
  }


  const updateModal = <form onSubmit={update} style={{position:'fixed',backgroundColor:'gray',zIndex:99, color:'black',width:'60%',height:'60%',padding:40}}>
    <button onClick={hideUpdateForm}>Close</button>
    <br />
    <label htmlFor="">Update {e[0].name}</label>
    <br />
    <label htmlFor="dob">DOB</label> <br />
    <input type="date" name="" id="dob" placeholder={`${e[0].dob.getFullYear()}-${e[0].dob.getMonth()}-${e[0].dob.getDate()}`} onChange={e => setDob(new Date(e.target.value))}/> <br />
    <label htmlFor="role">Role</label> <br />
    <select name="" id="role" onChange={e => {setRole(e.target.value)}}>
      {list.map(
        (e) => (<option value ={e} key = {e}>{e}</option>)
      )}
    </select>
    <br></br>
    <button onClick={addField}>Add Skill</button>
    <button onClick={deleteField}>Remove Skill</button>
    {skillFields.map((val,idx) => <div key = {idx}>{val}<br></br></div>)}
    <br />
    <button onClick={addField2}>Add Experiences</button>
    <button onClick={deleteField2}>Remove Experiences</button>
    {expFields.map((val,idx) => <div key = {idx}>{val}<br></br></div>)}
    <button>Submit</button>
  </form>

  const showUpdateForm = () => {
    setField([])
    setField1([])
    setSkill([])
    setExp([])
    if (e[0].skill.length > 0)
    fillSkill()
    else
    setField([field])

    if (e[0].experiences.length >0)
    fillExp()
    else
    setField1([field2])

    setUpdate(true)
  }

  if (checkUser('Human Resources Director')){
    return (<div>
      {isUpdate && updateModal}
      <button onClick={() => window.location.href = '/view_employee'}>Back</button>
      <h1>{e[0].name}</h1>
      <h2>{e[0].dob.toString()}</h2>
      <p>{e[0].role}</p>
      <p>Skill</p>
      {e[0].skill.map((s) => (
        <div key = {s}>
          {s}
        </div>
      ))}
      <p>Experiences</p>
      {e[0].experiences.map((s) => (
        <div key = {s}>
          {s}
        </div>
      ))}
      <h4>Trainings</h4>
      {training.map(e => <div key = {e}>{e}</div>)}
      <button onClick={showUpdateForm}>Modify</button>
      <button onClick={() => remove(e[0].id)}>Remove</button>
    </div>)
  }else{
    return (<Error value = "you're not authorized"></Error>)
  }
}


export default EmployeeDetail

