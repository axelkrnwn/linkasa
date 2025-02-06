import { useEffect, useState } from "react";
import Home from "./Home";
import { collection, onSnapshot, query } from "firebase/firestore";
import { getDatabase } from "@renderer/database/database";

export default function FuelHome():JSX.Element{

  interface Fuel{
    id:string,
    name:string,
    quantity:number,
  }

  interface Supplier{
    id:string,
    name:string,
    phone:string,
    address:string,
  }

  interface Delivery{
    id:string,
    fuelID:string,
    quantity:number,
    quality:string,
    supplierID:string
  }

  const [fuels, setFuel] = useState<Fuel[]>([])
  const [supplier, setSupplier] = useState<Supplier[]>([])
  const [delivery, setDelivery] = useState<Delivery[]>([])
  const [showFuel, setShowFuel] = useState(true)
  const [showDelivery, setShowDelivery] = useState(false)
  const [showConsumption, setShowConsumption] = useState(false)

  const openFuel = () => {
    setShowFuel(true)
    setShowDelivery(false)
    setShowConsumption(false)
  }
  const openDelivery = () => {
    setShowFuel(false)
    setShowDelivery(true)
    setShowConsumption(false)
  }
  const openConsumption = () => {
    setShowFuel(false)
    setShowDelivery(false)
    setShowConsumption(true)
  }

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Fuel'))
    onSnapshot(q, snapshot =>{
      setFuel(snapshot.docs.map(e => { return ({
        id:e.id,
        name:e.data().name,
        quantity:e.data().quantity
      })}))
    })
  }, [fuels])

  useEffect(() => {
    const q = query(collection(getDatabase(), 'Supplier'))
    onSnapshot(q, snapshot =>{
      setSupplier(snapshot.docs.map(e => { return ({
        id:e.id,
        name:e.data().name,
        phone:e.data().phone,
        address:e.data().address,
      })}))
    })
  }, [supplier])
  useEffect(() => {
    const q = query(collection(getDatabase(), 'FuelDelivery'))
    onSnapshot(q, snapshot =>{
      setDelivery(snapshot.docs.map(e => { return ({
        id:e.id,
        quality:e.data().quality,
        quantity:e.data().quantity,
        supplierID:e.data().supplierID,
        fuelID:e.data().fuelID,
      })}))
    })
  }, [delivery])

  return <>
  <Home></Home>
    <div className ='flex gap-x-5 px-10 border-y-2 border-solid border-blue-200 py-2'>
      <button onClick={openFuel} className={showFuel?'font-bold':''}>Fuel Inventory</button>
      <button onClick={openDelivery} className={showDelivery?'font-bold':''}>Fuel Delivery</button>
      <button onClick={openConsumption} className={showConsumption?'font-bold':''}>Fuel Consumption Pattern</button>
    </div>
    <div className="px-10">
      {showFuel && fuels.map(e => <>
        <div className="bg-white w-full my-3 p-2 shadow-xl">
          <h1 className="font-bold">{e.id}</h1>
          <h1>{e.name}</h1>
          <h1>{e.quantity} Left</h1>
        </div>
      </>)}
      {showDelivery && delivery.map(e => <>
        <div className="bg-white w-full my-3 p-2 shadow-xl">
          <h1 className="font-bold">{e.id}</h1>
          <h1>Fuel : {fuels.filter(f => f.id === e.fuelID)[0].name}</h1>
          <h1>Amount : {e.quantity} Left</h1>
          <h1>Quality : {e.quality}</h1>
          <h1>Delivered By : {supplier.filter(f => f.id === e.supplierID)[0].name} {'[' + supplier.filter(f => f.id === e.supplierID)[0].phone+ ']'}</h1>
        </div>
      </>)}
    </div>
  </>
}
