import { getAuth, signOut } from "firebase/auth"
import chatIcon from "../../assets/Chat.png"
import { checkLogin } from "@renderer/middleware/Middleware"
import { useEffect, useState } from "react"
import { collection, onSnapshot, query } from "firebase/firestore"
import { getDatabase } from "@renderer/database/database"

const style = {
  display:'flex',
  alignItems:'center'
}

const logout = async () => {

  signOut(getAuth()).then(() =>{

    window.localStorage.removeItem('login')
    window.location.href = '/'
      }
    )
  }

const chat = () => {
  window.location.href = '/chat'
}

export function Home():JSX.Element{


  const links:{[key:string]:{link:string,view:JSX.Element}} =
  {
    "Human Resources Director":{
      link:"/HRD_Home",
      view:<Home></Home>
    },
    "Civil Engineering Manager":{
      link:"/CivilEngineer_Home",
      view:<Home></Home>
    },
    "Maintenance Manager":{
      link:"/Maintenance_Home",
      view:<Home></Home>
    },
    "CFO":{
      link:"/CFO_Home",
      view:<Home></Home>
    },
    "Cargo Manager":{
      link:"/CargoHandling_Home",
      view:<Home></Home>
    },
    "Flight Operation Manager":{
      link:"/Flight_Operation_Home",
      view:<Home></Home>
    },
    "Airport Operation Manager":{
      link:"/Airport_Operation_Home",
      view:<Home></Home>
    },
    "Cargo Handler":{
      link:"/CargoHandler_Home",
      view:<Home></Home>
    },
    "Gate Agent":{
      link:"/Gate_Agent_Home",
      view:<Home></Home>
    },
    "Check-in Staff":{
      link:"/Check-in_Home",
      view:<Home></Home>
    },
    "Baggage Security Supervisor":{
      link:"/BaggageSecuritySupervisor_Home",
      view:<Home></Home>
    },
    "Lost and Found Staff":{
      link:"/Lost_And_Found_Home",
      view:<Home></Home>
    },
    "Information Desk Staff":{
      link:"/Information_Desk_Home",
      view:<Home></Home>
    },
    "Customer Service Manager":{
      link:"/Customer_Service_Home",
      view:<Home></Home>
    },
    "Landside Operations Manager":{
      link:"/Landside_Home",
      view:<Home></Home>
    },
    "CEO":{
      link:"/CEO_Home",
      view:<Home></Home>
    },
    "CSO":{
      link:"/CSO_Home",
      view:<Home></Home>
    },
    "COO":{
      link:"/COO_Home",
      view:<Home></Home>
    },
    "Customs And Border Control Officer":{
      link:"/Customs_And_Border_Home",
      view:<Home></Home>
    },
    "Logistic Manager":{
      link:"/Logistic_Home",
      view:<Home></Home>
    },
    "Fuel Manager":{
      link:"/Fuel_Home",
      view:<Home></Home>
    },
    "Ground Handling Manager":{
      link:"/GroundHandling_Home",
      view:<Home></Home>
    },
    "Ground Handling Staff":{
      link:"/GroundHandling_Home",
      view:<Home></Home>
    },
    "Maintenance Staff":{
      link:"/Maintenance_Home",
      view:<Home></Home>
    },

  }




  const back = () => {
    try {
      if (checkLogin()){
        const role:string = window.localStorage.getItem('login')
        window.location.href = links[role].link
      }
    } catch (error) {
      console.log('localstorage null')
    }

  }

  interface Broadcast{
    message:string,
    recipients:string[],
    createdAt:Date
  }

  const [show,setShow] = useState(false)
  const [broadcasts,setBroadcasts] = useState<Broadcast[]>([])

  useEffect(() => {
    const q = query(collection(getDatabase(),'Broadcast'))
    onSnapshot(q, snapshot => {
      setBroadcasts(snapshot.docs.map(e => ({
        message:e.data().name,
        recipients:e.data().recipients,
        createdAt:e.data().createdAt.toDate()
      })))
    })
  },[broadcasts])
  return (
    //border-slate-800 border-solid border-2 h-1/6
    <div style={style} className="gap-x-5 text-xl text-bold h-1/6 px-10 py-5">
      {show && <>
      <div className="z-20 fixed bg-white w-1/4 p-4" style={{top:60,left:300}}>
        {broadcasts.filter(e => e.recipients.includes(getAuth().currentUser?.email))
        .map(e => <>
        <div className="flex gap-x-5">
          <h1 className="font-bold">{e.createdAt.getDate()} - {e.createdAt.getMonth() + 1} {e.createdAt.getFullYear()}</h1>
          <h1>{e.message}</h1>
        </div>
        </>)}
      </div>
      </>}
      <button onClick={back}>Welcome to LinKasa</button>
      {window.location.pathname !== 'chat' && <button onClick={chat} style={{border:'none', backgroundColor:'white'}}><img src={chatIcon} alt="" style={{width:30,height:30}}/></button>
      }
      <button onClick={show?() => setShow(false):() => setShow(true)}>Broadcasts</button>
      <button onClick={logout}>Log Out</button>
    </div>
  )
}

export default Home;
