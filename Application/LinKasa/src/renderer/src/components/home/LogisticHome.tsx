import { useEffect, useState } from "react"
import Home from "./Home"
import { collection, onSnapshot, query } from "firebase/firestore"
import { getDatabase } from "@renderer/database/database"

function LogisticHome():JSX.Element{

  interface Cargo{
    id:string,
    source:string,
    dest:string,
    schedule:Date,
    status:string,
    movementStatus:string,
    currentLocation:string
  }

  const [cargos, setCargos] = useState<Cargo[]>([])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'CargoShipment'))

    onSnapshot(q, snapshot => {
      setCargos(snapshot.docs.map(doc => ({
        id:doc.id,
        source:doc.data().source,
        dest:doc.data().destination,
        schedule:doc.data().schedule.toDate(),
        status:doc.data().status,
        movementStatus:doc.data().movementStatus,
        currentLocation:doc.data().currentLocation
      })))

    })
  }, [cargos])


  return (<div>

    <Home></Home>
    <div className="mx-5 flex gap-x-5">
      <button>Create Cargo Handling Task</button>
    </div>
    <div className="mx-5">
      {cargos.map(e =>
      <div key = {e.id} className="bg-slate-100 w-full p-3">
        <h1 className="font-bold">{e.source} - {e.dest}</h1>
        <h1>{e.schedule.getDate()} - {e.schedule.getMonth()} {e.schedule.getFullYear()}</h1>

        <h1>Status : {e.status}</h1>
        <div className="flex gap-x-10 justify-between">
          <h1>Movement Status : {e.movementStatus}</h1>
          <h1>Current Location : {e.currentLocation}</h1>
        </div>
      </div>)}
    </div>
  </div>)
}

export default LogisticHome
