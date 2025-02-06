import { getDatabase } from "@renderer/database/database"
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function UpdateProjectPlan():JSX.Element{

  const param = useParams()

  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date())
  const [desc,setDesc] = useState('')
  const [status,setStatus] = useState('')

  const project:{id:string,name:string, description:string, startDate:Date, status:string} = {
    id:"",
    name:"",
    description:"",
    startDate:new Date(),
    status:"",
  }
  const [projectPlans, setProjectPlans] = useState([project])


  useEffect(() => {
    const q = query(collection
      (getDatabase(),'ProjectPlan'), where('__name__','==',param.id))
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

  }, [])

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    if (name.length < 1){
      setName(projectPlans[0].name)
    }
    if (desc.length < 1){
      setDesc(projectPlans[0].description)
    }
    if (status.length < 1){
      setStatus(projectPlans[0].status)
    }
    if (!date){
      setDate(projectPlans[0].startDate)
    }
    const ref = getDatabase()
    await updateDoc(doc(ref,"ProjectPlan",projectPlans[0].id), {
      name:name,
      date:date,
      description:desc,
      status:status
    }).then(
      () => {
        window.location.href = '/CivilEngineer_Home'
      }
    )
  }

  const back = () => {
    window.location.href = '/CivilEngineer_Home'
  }



  return (
  <>
  <h1>Update Project Plan</h1>
    <form onSubmit={handleSubmit}>
      <button onClick={back}></button>
      <label htmlFor="name">Project Name</label><br />
      <input type="text" id = "name"  onChange={(e) => {setName(e.target.value)}} placeholder={projectPlans[0].name}/> <br />
      <label htmlFor="startDate">Start Date</label> <br />
      <input type="date" id = "startDate" placeholder={projectPlans[0].startDate.toString()} onChange={(e) => {setDate(new Date(e.target.value))}} /> <br />
      <label htmlFor="desc">Description</label> <br />
      <textarea name="" id="desc" placeholder={projectPlans[0].description} rows={10} cols={30} onChange={(e) => {setDesc(e.target.value)}}></textarea> <br />
      <label htmlFor="status">Project Status</label><br />
      <input type="text" id = "status" placeholder={projectPlans[0].status}  onChange={(e) => {setStatus(e.target.value)}}/> <br />
      <button type="submit">Submit Project Plan</button>
    </form>
  </>)
}

export default UpdateProjectPlan
