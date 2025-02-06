import { insert } from "@renderer/database/database"
import { useState } from "react"

function CreateProject():JSX.Element{


  // const field = (<div>

  //   </div>)

  // const [resourceFields,setField] = useState([
  //   field
  // ])


  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date())
  const [desc,setDesc] = useState('')

  const handleSubmit = (e:any) => {
    e.preventDefault()

    insert('ProjectPlan',{name:name,startDate:date,description:desc,status:'unbudgetted'}).then(
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
    <form onSubmit={handleSubmit}>
      <button onClick={back}>back</button><br />
      <label htmlFor="name">Project Name</label><br />
      <input type="text" id = "name"  onChange={(e) => {setName(e.target.value)}}/> <br />
      <label htmlFor="startDate">Start Date</label> <br />
      <input type="date" id = "startDate" onChange={(e) => {setDate(new Date(e.target.value))}} /> <br />
      <label htmlFor="desc">Description</label> <br />
      <textarea name="" id="desc" rows={10} cols={30} onChange={(e) => {setDesc(e.target.value)}}></textarea> <br />
      <button type="submit">Submit Project Plan</button>
    </form>
  </>)
}

export default CreateProject
