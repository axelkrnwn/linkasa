import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { getDatabase, insert } from "@renderer/database/database"

export function CreateBudgetPlan():JSX.Element{

  const proj = useParams()

  const project:{id:string,name:string, description:string, startDate:Date, status:string} = {
    id:"",
    name:"",
    description:"",
    startDate:new Date(),
    status:"",
  }
  const [projectPlans, setProjectPlans] = useState([project])


  const field = (<div>
    <div style={{display:'flex', columnGap:211}}>
      <label htmlFor="res-name">Name</label>
      <label htmlFor="res-quantity">Quantity</label>
      <label htmlFor="res-price">Price</label>
    </div>
      <div style = {{display:'flex', columnGap:69}}>
      <input type = "text" id = "res-name" style={{width:190}}></input>
      <input type = "number" id = "res-quantity" style={{width:190}}></input>
      <input type="number" id = "res-price" style={{width:190}}/>
      </div>
    </div>)

  const [resourceFields,setField] = useState([
    field
  ])

  useEffect(() => {
    const q = query(collection(getDatabase(),'ProjectPlan'), where('__name__','==',proj.id))
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

  const deleteField = (e:any) => {
    e.preventDefault()
    setField(resourceFields.slice(0,resourceFields.length - 1))
  }

  const addField = (e:any) => {
    e.preventDefault()
    setField([...resourceFields,field])
  }

  interface Budget {
    name:string,
    quantity:number,
    price:number
  }

  const [budgets] = useState<Budget[]>([])
//2 3 4
//5 6 7
  const handleSubmit = (e:any) => {
    e.preventDefault()
    // console.log(resourceFields.length)
    for (let i = 0;i < resourceFields.length;i++){
      const obj:Budget = {name:e.target[i*3+2].value,quantity:e.target[i*3+3].value,price:e.target[i*3+4].value}
      budgets.push(obj)
    }
    insert('BudgetPlan',{ProjectID:`${projectPlans[0].id}`, budgets:budgets,status:'pending review'}).then(
      async () => {
        const ref = getDatabase()
        await updateDoc(doc(ref,"ProjectPlan",projectPlans[0].id), {
          status:'budget on review'
        }).then(() => {window.location.href = `/project_detail/${projectPlans[0].id}/1`})
      }
    )
  }

  return (<div>
    <h3>Create Budget Plan for {projectPlans.map((e) =>
        e.name
    )}</h3>
    <form action="" onSubmit={handleSubmit}>
      <div style = {{marginTop:30, display:'flex',columnGap:20}}>
      <button onClick={addField}>add Resource</button>
      <button onClick={deleteField}>delete Resource</button>
      </div>
      <div style = {{marginBottom:30}}>
        {resourceFields.map((idx,val) => (<div key = {val}><br></br>{idx}</div>))}
      </div>
      <button type="submit">Submit Budget Plan</button>
    </form>
  </div>)
}

export default CreateBudgetPlan
