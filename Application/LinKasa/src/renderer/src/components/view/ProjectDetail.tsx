import { getDatabase } from "@renderer/database/database"
import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SuccessMsg from "../message/successMsg"

export function ProjectDetail():JSX.Element{

  const param = useParams()

  const project:{id:string,name:string, description:string, startDate:Date, status:string} = {
    id:"",
    name:"",
    description:"",
    startDate:new Date(),
    status:"",
  }
  const [projectPlans, setProjectPlans] = useState([project])


  useEffect(() => {
    const q = query(collection(getDatabase(),'ProjectPlan'), where('__name__','==',param.id))
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

  const removeBudgetPlan = async (id:string) => {

    const q = query(collection(getDatabase(),'BudgetPlan'))
    onSnapshot(q, (snapshot) => {

      snapshot.docs.forEach(async (p) => {
        if (p.data().ProjectID === id){
          await deleteDoc(doc(getDatabase(),'BudgetPlan',p.id)).then( async () => {
            await updateDoc(doc(getDatabase(),"ProjectPlan",id), {
              status:'unbudgetted'
            })
          })
        }
      })
    })
  }

  return (
  <>
  {
    projectPlans.map((e) => (
      <div key = {e.id}>
        <h3>{e.name}</h3>
        <h4>{e.startDate.toString()}</h4>
        <p>{e.description}</p>
        {e.status === 'unbudgetted' && <button onClick={() => {window.location.href = '/create_budget_plan/' + e.id}}>Create Budget Plan</button>}
        {e.status === 'budget on review' && <button onClick={() => {window.location.href = '/create_budget_plan/' + e.id}}>Update Budget Plan</button>}
        {e.status === 'budget rejected' && <button onClick={() => {window.location.href = '/create_budget_plan/' + e.id}}>Create New Budget Plan</button>}
        {(e.status !== 'unbudgetted' && e.status !== 'budgetted') && <button onClick={() => removeBudgetPlan(e.id)}>Remove Budget Plan</button>}
        {param.success  && <SuccessMsg msg = "budget plan successfully created"></SuccessMsg>}
      </div>
    ))
  }
  </>)
}


export default ProjectDetail
