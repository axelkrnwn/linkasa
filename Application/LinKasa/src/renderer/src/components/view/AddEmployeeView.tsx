import { getDatabase, insert } from "@renderer/database/database"
import { checkUser } from "@renderer/middleware/Middleware"
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Error from "./error"

export function AddEmployeeView():JSX.Element{

  const generateCredential:(obj: { name: string, DOB: Date, appliedJob: string }) => {
    email: string,
    password: string,
    name: string,
    DOB: Date,
    role: string
  } = (obj : { name: string, DOB: Date, appliedJob: string }) => {
      const words = obj.name.split(' ')
      let newEmail = ''
      if (words.length < 2){
        newEmail = `${words[0]}@linkasa.com`
      }else{
        newEmail = `${words[0]}.${words[words.length - 1]}@linkasa.com`
      }
      let newPass = `${words[0]}${obj.DOB.getDate()}${obj.DOB.getMonth() + 1}${obj.DOB.getFullYear()}`

      return ({
        email:newEmail,
        password:newPass,
        name:obj.name,
        DOB:obj.DOB,
        role:obj.appliedJob
      })
  }


  const temp:{
    email: string,
    password: string,
    name: string,
    DOB: Date,
    role: string
  } = {
    email: 'string',
    password: 'string',
    name: 'string',
    DOB: new Date(),
    role: 'string'
  }

  const [error,setError] = useState('')
  const [newEmployee,setNewEmployee] = useState(temp)
  const job = useParams()
  const [obj,setObj] = useState([{
    id:"",
    name:"",
    DOB:new Date(),
    appliedJob:"",
    isAccepted:false
  }])

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const password = e.target[3]
    if (password.value != newEmployee.password){
      setError('wrong confirmation!')
    }else{
      insert('employee',
      {email:newEmployee.email,
       password:newEmployee.password,
       DOB:newEmployee.DOB,
       role:newEmployee.role,
       skill:[],
       experiences:[]
      })
      await deleteDoc(doc(getDatabase(),"JobRegistrant",obj[0].id)).then(
        () => {
          window.location.href = "/HRD_Home/1"
        }
      )
    }

  }

  useEffect(() =>{
    const q = query(collection(getDatabase(),'JobRegistrant'),where('__name__','==',job.id))
    onSnapshot(q, (snapshot) =>{
      setObj(snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        DOB: doc.data().DOB.toDate(),
        appliedJob:doc.data().appliedJob,
        isAccepted:doc.data().isAccepted
      })))
    })
    setNewEmployee(generateCredential({name:obj[0].name, DOB:obj[0].DOB,appliedJob:obj[0].appliedJob}))
  }, [obj])

  if(checkUser('Human Resources Director'))
  return (<div>
    <h1>{obj[0].name}</h1>
    <h2>{obj[0].DOB.toDateString()}</h2>
    <p>{obj[0].appliedJob}</p>
    <br />
    <form action="" onSubmit={handleSubmit}>
    <div>
      <h3>new email : {newEmployee.email}</h3>
      <label htmlFor="generatedPass">new password : </label>
      <input onCopy={(e) => {e.preventDefault()}} id = "generatedPass" value = {newEmployee.password}/>
    </div>
      <label htmlFor="dob">Date of Birth</label><br />
      <input type="date" id = "dob" placeholder={newEmployee.DOB.toISOString().split('T')[0]} value = {newEmployee.DOB.toISOString().split('T')[0]}/>
      <br />
      <label htmlFor="role">Role</label><br />
      <input type="text" placeholder = {newEmployee.role} value = {newEmployee.role} id="role" />
      <br />
      <label htmlFor="password">Confirmation password to add new employee</label><br />
      <input type="password" name="" id="password" />
      <br />
      <button type="submit">Submit New Employee</button>
      <p id = "error_message">{error}</p>
    </form>
  </div>)
  else{
    return (
      <Error value = "You're Not Authorized"></Error>
    )
  }
}

export default AddEmployeeView
