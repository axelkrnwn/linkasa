import { getDatabase, insert } from "@renderer/database/database"
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function InterviewForm (props:any):JSX.Element{


    interface JobRegistrant{
      id:string,
      name:string,
    }
    const [jobRegistrants,setJobRegistrants] = useState<JobRegistrant[]>([])
    useEffect(() => {
      const q = query(collection(getDatabase(), 'JobRegistrant'))
      onSnapshot(q, snapshot => {
        setJobRegistrants(snapshot.docs.map(e => ({
          id:e.id,
          name:e.data().name
        })))
      })
    }, [jobRegistrants])
    const [jobRegis,setjobRegis] = useState('')
    const [schedule,setSchedule] = useState<Date>()

  useEffect(() => {
    if (props.isUpdate){
      setSchedule(props.schedule)
    }else{
    const q = query(collection(getDatabase(), 'JobRegistrant'))
    onSnapshot(q, snapshot => {
      setjobRegis(snapshot.docs[0].id)
    })
    }
    // setStatus(props.cargo.movementStatus)
  }, [])

  const updateInterview = async (e:any) => {
    e.preventDefault()
    props.func()

    await updateDoc(doc(getDatabase(),'Interview',props.id),{
      schedule:schedule
    })
  }


  const addRoom = async (e:any) => {
    e.preventDefault()
    props.func()


    insert('Interview', {
      jobRegistrantID:jobRegis,
      schedule:schedule
    })
  }

  const createP = (p:number) => {
    return p < 10 ? '0' + p : p
  }


  const createDate = (date:Date) => {
    console.log(date)
    return `${date.getFullYear()}-${createP(date.getMonth()+1)}-${createP(date.getDate())}T${createP(date.getHours())}:${createP(date.getMinutes())}`
  }


  return (<>
    <div style={{position:"fixed",backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg  drop-shadow-xl z-50">
      <button onClick={() => {props.func()}}>Back</button>
      <h1 className="font-bold text-center">{!props.isUpdate?'Add Interview':`Update ${props.name}'s Interview`}</h1>
      {!props.isUpdate && <select name="" id="" onChange={e => setjobRegis(e.target.value)}>
        {jobRegistrants.map(e => <option key = {e.id} value = {e.id}>{e.name}</option>)}
      </select>}
      <input type="datetime-local" className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setSchedule(new Date(e.target.value))} defaultValue={createDate(props.schedule)}/>

      <button onClick={props.isUpdate?updateInterview:addRoom} className="my-4 px-4 bg-green-400 font-bold text-white rounded-lg py-1 w-full">Submit</button> <br />

    </div>
  </>)
}
