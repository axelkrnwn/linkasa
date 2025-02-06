import { getDatabase } from "@renderer/database/database"
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function CargoForm (props:any):JSX.Element{

  const [status,setStatus] = useState('')

  useEffect(() => {
    setStatus(props.cargo.movementStatus)
  }, [])

  const addRoom = async (e:any) => {
    e.preventDefault()
    props.func()
    await updateDoc(doc(getDatabase(), 'CargoShipment', props.cargo.id), {
      movementStatus:status
    })
  }



  return (<>
    <div style={{position:"fixed",backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg  overflow-scroll drop-shadow-xl h-3/4 z-50 overflow-y-auto">
      <button onClick={() => {props.func()}}>Back</button>
      <h1 className="font-bold text-center">Input Movement Status To Cargo Shipment</h1>
      <select name="" id="" onChange={e => setStatus(e.target.value)}>
        <option value="Loading">loading</option>
        <option value="Unloading">unloading</option>
        <option value="Storing">storing</option>
        <option value="Transiting">transiting</option>
      </select>

      <button onClick={addRoom} className="my-4 px-4 bg-green-400 font-bold text-white rounded-lg py-1 w-full">Submit</button> <br />

    </div>
  </>)
}
