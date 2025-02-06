import { getDatabase, storage } from "@renderer/database/database"
import { addDoc, collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import Home from "./Home"
import { checkUser } from "@renderer/middleware/Middleware"
import Error from "../view/error"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

function LostAndFoundHome ():JSX.Element{

  interface lostAndFound{
    id:string,
    name:string,
    description:string,
    place:string,
    status:string,
    time:Date,
    weight:number,
    photo:string
  }

  const [log,setLog] = useState<lostAndFound[]>([])

  useEffect(() => {

    const q = query(collection(getDatabase(),'LostAndFoundLog'),
    )
      onSnapshot(q, (snapshot) =>{
          setLog(snapshot.docs.map((doc) => ({
            id:doc.id,
            name:doc.data().name,
            description:doc.data().description,
            place:doc.data().place,
            status:doc.data().status,
            time:doc.data().time.toDate(),
            weight:doc.data().weight,
            photo:doc.data().photo
          })))
      })
  }, [log])

  const [id,setID] = useState('')
  const [isShowCreate,setShowCreate] = useState(false)
  const [isLoading,setLoading] = useState(false)
  const [isShowUpdate,setShowUpdate] = useState(false)
  const [name,setName] = useState('')
  const [weight,setWeight] = useState(0)
  const [desc, setDesc] = useState('')
  const [place, setPlace] = useState('')
  const [time,setTime] = useState(new Date())
  const [status,setStatus] = useState('')
  const [file, setFile] = useState<File|null>(null)
  const [photo,setPhoto] = useState('')


  const createLog = async (e:any) => {
    e.preventDefault()
    setShowCreate(false)
    setLoading(true)
    if (file === null){
      return
    }else{
      const imageRef = ref(storage, `lost_and_found/${name}_${time}`)
      await uploadBytes(imageRef, file)
      getDownloadURL(imageRef).then(e => setPhoto(e))
    }

    await addDoc(collection(getDatabase(),'LostAndFoundLog'),{
      name:name,
      weight:weight,
      description:desc,
      place:place,
      time:time,
      status:'unclaimed',
      photo:photo
    })
    setLoading(false)
  }

  const loading = <div style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',backgroundColor:'white',zIndex:98}}><h1>Loading</h1></div>

  //6 image


  const lostAndFoundForm =
  <form onSubmit={createLog} style={{position:'fixed',zIndex:99,backgroundColor:'white'}} className="p-3">
    <button onClick={()=>setShowCreate(false)}>Back</button> <br />
    <h1 className="text-center font-bold">Create Lost And Found Log</h1>
    <input type="text" className="border-2 border-solid border-blue-100 rounded-lg my-1" onChange={e => setName(e.target.value)} />
    <br />
    <input type="number" className="border-2 border-solid border-blue-100 rounded-lg my-1" name="" id="" onChange={e => setWeight(Number(e.target.value))}/>
    <br />
    <textarea name="" className="border-2 border-solid border-blue-100 rounded-lg my-1" id="" cols={50} rows={5} onChange={e => setDesc(e.target.value)}></textarea>
    <br />
    <input type="text" className="border-2 border-solid border-blue-100 rounded-lg my-1" onChange={e => setPlace(e.target.value)}/>
    <br />
    <input type="date" className="border-2 border-solid border-blue-100 rounded-lg my-1" name="" id="" onChange={e => setTime(new Date(e.target.value))}/>
    <br />
    <input type="file" required onChange={e => setFile(e.target.files[0])} className="border-2 border-solid border-blue-100 rounded-lg my-1" name="" id="" />
    <br />
    <button type="submit" className="bg-green-400 rounded-lg text-slate-100 w-full">Submit</button>
  </form>


  const update = async (e:any) => {
    e.preventDefault()

    setShowUpdate(false)
    setLoading(true)

    await updateDoc(doc(getDatabase(),'LostAndFoundLog',id),{
      name:name,
      weight:weight,
      description:desc,
      place:place,
      time:time,
      status:status
    })

    setLoading(false)
  }

  const updateForm = <form onSubmit={update} style={{position:'fixed',zIndex:99,backgroundColor:'white'}}>
    <button onClick={()=>setShowUpdate(false)}>Back</button> <br />
    <input type="text" onChange={e => setName(e.target.value)} />
    <br />
    <input type="number" className="border-2 border-solid border-blue-100 rounded-lg my-3" name="" id="" onChange={e => setWeight(Number(e.target.value))}/>
    <br />
    <textarea name="" id="" className="border-2 border-solid border-blue-100 rounded-lg my-3" cols={30} rows={10} onChange={e => setDesc(e.target.value)}></textarea>
    <br />
    <input type="text" className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setPlace(e.target.value)}/>
    <br />
    <input type="date" className="border-2 border-solid border-blue-100 rounded-lg my-3" name="" id="" onChange={e => setTime(new Date(e.target.value))}/>
    <br />
    <select name="" id="" className="border-2 border-solid border-blue-100 rounded-lg my-3" onChange={e => setStatus(e.target.value)}>
      <option  value="unclaimed">unclaimed</option>
      <option value="returned to owner">Returned to owner</option>
    </select>
    <button type="submit">Submit</button>
  </form>

  if (checkUser('Lost And Found Staff'))
  return (<>
    <Home></Home>
    {isShowCreate && lostAndFoundForm}
    {isLoading && loading}
    {isShowUpdate && updateForm}
    <button onClick={() => setShowCreate(true)}>Create Lost and Found Log</button>
    <div style={{display:'flex', columnGap:10}}>
      <p>no.</p>
      <p>name</p>
      <p>weight</p>
      <p>description</p>
      <div style={{display:'flex',columnGap:150}}>
      <p>place</p>
      <p>time</p>
      <p>status</p>
      </div>
    </div>

    {log.map((p,idx) => <div className="bg-slate-100 my-3" style={{display:'flex', columnGap:30}} key = {p.id}>
      <p>{idx + 1 + '. '}</p>
      <p>{p.name}</p>
      <p>{p.weight}</p>
      <p>{p.description}</p>
      <p>{p.place}</p>
      <p>{p.time.toString()}</p>
      <p>{p.status}</p>
      <img className = "w-20 h-20" src={p.photo} alt="" />
      <button onClick={() => {setID(p.id);setName(p.name);setDesc(p.description);setPlace(p.place);setTime(p.time);setStatus(p.status);setWeight(p.weight);setShowUpdate(true)}}>Update</button>
    </div>)}
  </>)
  else
  return (<Error value = "You're not authorized"></Error>)
}

export default LostAndFoundHome
