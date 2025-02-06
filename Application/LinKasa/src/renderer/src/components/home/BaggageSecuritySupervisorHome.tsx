import Home from "./Home"
import { useEffect, useState } from "react"
import { getDatabase } from "@renderer/database/database"
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore"

export function BaggageSecuritySupervisor_Home():JSX.Element{


interface Baggage{
  id:string,
  content:string,
  status:string,
  description:string
}

  const [bagggages, setBaggages] = useState<Baggage[]>([])
  const [showBaggage, setShowBaggage] = useState(true)


  useEffect(() => {
    const q = query(collection(getDatabase(),'Baggage'))
    onSnapshot(q, snapshot => {
      setBaggages(snapshot.docs.map(doc => {return {
        id:doc.id,
        content:doc.data().content,
        status:doc.data().status,
        description:doc.data().statusDescription
      }

      }))
    })

  }, [bagggages])

  const openBaggage = () => {
    setShowBaggage(true)
  }

  const [isUpdate, setUpdate] = useState(false)
  const [id, setID] = useState('')
  const [status, setStatus] = useState('Checked')
  const [desc, setDesc] = useState('')

  const [isLoading, setLoading] = useState(false)

  const openBaggageForm= (id:string) => {
    setUpdate(true)
    setID(id)
  }
  const closeBaggageForm= () => {
    setUpdate(false)
  }
  const updateBaggage = async (e:any) => {
    e.preventDefault()
    closeBaggageForm()
    setLoading(true)
    await updateDoc(doc(getDatabase(),'Baggage', id), {
      status:status,
      statusDescription:desc
    })
    setLoading(false)
  }

  const loading =
  <div style={{position:'fixed',width:'100%',height:'100%',backgroundColor:'white', left:0, top:0}}><h1>Loading</h1></div>


  const updateBaggageForm = <div style={{position:"fixed",zIndex:99,backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg drop-shadow-xl">
    <button onClick={closeBaggageForm}>Close</button>
    <h1 className="font-bold text-center">Update Baggage</h1>
    <label htmlFor="s">Status</label> <br />
    <select name="" id="s" onChange={e => setStatus(e.target.value)} className="border-2 border-solid border-blue-100 rounded-lg my-3">
      <option value="Checked">Checked</option>
      <option value="Loading">Loading</option>
      <option value="Transfer">Transfer</option>
      <option value="In Transit">In Transit</option>
      <option value="Unloading">Unloading</option>
      <option value="Received">Received</option>
      <option value="Delayed">Delayed</option>
    </select><br />
    <label htmlFor="d">Description</label> <br />
    <textarea id = 'd' onChange={e => setDesc(e.target.value)} rows={30} cols={50} className="border-2 border-solid border-blue-100 rounded-lg my-3"/>
    <br />
  <button onClick={updateBaggage} className="bg-green-400 px-2 my-5 text-slate-100 font-bold rounded-lg my-3 w-full">Submit</button>
  </div>

  return (<>
    {isUpdate && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-90 t-0 l-0"></div>}
    {isLoading && loading}
    {isUpdate && updateBaggageForm}
    <Home></Home>
    <div style={{display:"flex",columnGap:20}}>
      <button onClick={openBaggage} className={showBaggage ? 'font-bold':''}>Bagggages</button>
      <button>Baggage Incident Log</button>
      <button>Staffs Assigment</button>
      <button>Generate Report</button>
    </div>
    <div className="flex flex-wrap mt-2">
            {
              showBaggage && bagggages.map(e => <div className="w-2/5 p-4 bg-slate-100 shadow-2xl mx-4">
                <h1 className="font-bold">{e.content}</h1>
                <h1>status : {e.status}</h1>
                <p>description : {e.description}</p>
                <button onClick={() => openBaggageForm(e.id)} className="px-4 py-1 bg-blue-400 rounded-lg text-slate-100 font-bold">Update</button>
              </div>)
            }
      </div>


  </>)
}

export default BaggageSecuritySupervisor_Home
