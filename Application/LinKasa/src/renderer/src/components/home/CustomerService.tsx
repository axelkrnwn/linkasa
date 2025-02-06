import { checkUser } from "@renderer/middleware/Middleware"
import Home from "./Home"
import Error from "../view/error"
import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore"
import { getDatabase } from "@renderer/database/database"
import CreateFeedbackForm from "../view/CreateFeedbackForm"
import BroadcastForm from "../view/BroadcastForm"

function CustomerService():JSX.Element{

  interface CustomerFeedbackForm {
    id:string,
    question:string[],
    type:string[],
  }

  interface Broadcast {
    id:string,
    message:string,
    recipients:string[],
    createdAt:Date,
    priority:number
  }

  interface Feedback{
    answer:string[]
  }

  const [form,setForm] = useState<CustomerFeedbackForm[]>([])
  const [broadcasts,setBroadcasts] = useState<Broadcast[]>([])
  const [answers, setAnswers] = useState<Feedback[]>([])

  useEffect(() => {
    const q = query(collection(getDatabase(),'Feedback'))
    onSnapshot(q, (snapshot) => {
      setAnswers(snapshot.docs.map(doc => (
        {
          answer:doc.data().answer
        }
      )))
    })

  }, [answers])

  useEffect(() => {
    const q = query(collection(getDatabase(),'Broadcast'))
    onSnapshot(q, (snapshot) => {
      setBroadcasts(snapshot.docs.map(doc => (
        {
          id:doc.id,
          message:doc.data().name,
          recipients:doc.data().recipients,
          createdAt:doc.data().createdAt.toDate(),
          priority:doc.data().priority
        }
      )))
    })
  }, [broadcasts])



  useEffect(() => {
    const q = query(collection(getDatabase(),'FeedbackForm'))
    onSnapshot(q, (snapshot) => {
      setForm(snapshot.docs.map(doc => (
        {
          id:doc.id,
          question:doc.data().questions,
          type:doc.data().types
        }
      )))
    })
  }, [form])

  const [viewForm,setViewForm] = useState(true)
  const [viewBroad,setViewBroad] = useState(false)
  const [createForm, setCreateForm] = useState(false)
  const [updateForm, setUpdateForm] = useState(false)
  const [createBroadcast, setCreateBroadcast] = useState(false)
  const [updateBroadcast, setUpdateBroadcast] = useState(false)
  const [broadcast, setBroadcast] = useState<Broadcast>()
  const [showAnswer, setShowAnswer] = useState(false)

  const openForm = () => {
    setViewForm(true)
    setViewBroad(false)
  }
  const openBroad = () => {
    setViewForm(false)
    setViewBroad(true)
  }




  if (checkUser('Customer Service Manager'))
  return (<>
  <div>
    {createForm &&
    <>
      <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-40 t-0 l-0"></div>
      <CreateFeedbackForm func = {() => setCreateForm(false)} isUpdate={false}></CreateFeedbackForm>
    </>
    }
    {updateForm &&
    <>
      <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-40 t-0 l-0"></div>
      <CreateFeedbackForm func = {() => setUpdateForm(false)} isUpdate={true} prevForm = {form[0]}></CreateFeedbackForm>
    </>
    }
    {createBroadcast &&
    <>
      <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-40 t-0 l-0"></div>
      <BroadcastForm func = {() => setCreateBroadcast(false)} isUpdate={false}></BroadcastForm>
    </>
    }
    {updateBroadcast &&
    <>
      <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-40 t-0 l-0"></div>
      <BroadcastForm func = {() => setUpdateBroadcast(false)} isUpdate={true} broadcast = {broadcast}></BroadcastForm>
    </>
    }
    <Home></Home>
    <div className="flex gap-x-5 px-10 border-y-2 border-solid border-blue-200 py-2">
      <button onClick={openForm} className={viewForm?'font-bold':''}>Feedback Form</button>
      <button onClick={openBroad} className={viewBroad?'font-bold':''}>Broadcast</button>
    </div>
    {viewForm && <>
    <div className="flex gap-x-10 my-5 px-10">
      {(form.length == 0) && <button className="my-4 px-6 bg-green-400 font-bold text-white rounded-lg py-1" onClick={() => setCreateForm(true)}>Create Feedback Form</button>}
      <button className="my-4 px-6 bg-blue-400 font-bold text-white rounded-lg py-1" onClick={() => setUpdateForm(true)}>Update Feedback Form</button>

      <button className="my-4 px-6 bg-red-400 font-bold text-white rounded-lg py-1" onClick={showAnswer?() => setShowAnswer(false):() => setShowAnswer(true)}>Show Feedback</button>
    </div>
    <div className="px-10">
      Feedback Form
      <h1 className="text-center font-bold"></h1>
      {form.map((e) => <>
          <div>
            <div>{e.question.map((q,idx) => <><h1 className="my-3 font-bold">{idx+1}. {q} {'[ ' + e.type[idx] + ' ]'}</h1>
              {showAnswer && answers.map(a => a.answer.filter((a,id) => idx === id).map(
                a => <><h1 className="my-5">{a}</h1></>
              ))}
            </>)}</div>

          </div>
        </>)}
    </div>
    </>}
    {viewBroad  && <>
    <div className="flex gap-x-10 my-5 px-10">
      <button className="my-4 px-6 bg-green-400 font-bold text-white rounded-lg py-1" onClick={() => setCreateBroadcast(true)}>Create Broadcast</button>
    </div>
    <div className="px-10">
      {
        broadcasts.map(e => <>
          <div className="bg-white w-full my-3 p-4 shadow-xl">
            <div className="flex justify-between">
            <h1 className="font-bold">{e.id}</h1>
            <h1>Created At {e.createdAt.getDate()} - {e.createdAt.getMonth() + 1} {e.createdAt.getFullYear()}</h1>
            </div>
            <h1>{e.message}</h1>
            <div className="mt-5">
              <h1>Settings</h1>
              <h1>Priority Level : {e.priority}</h1>
              <h1>Recipients : </h1>
              <div className="flex flex-wrap gap-x-4">
                {e.recipients.map(p => <h4 key = {p}>{p}</h4>)}
              </div>
              <div className="flex justify-between">
                <button className="border-solid border-2 p-2 bg-blue-400 font-bold text-slate-100" onClick={() => {
                  setBroadcast(e)
                  setUpdateBroadcast(true)
                }}>Update</button>
                <button className="font-bold border-solid border-2 p-2 bg-red-400 text-slate-100" onClick={async () => {
                  await deleteDoc(doc(getDatabase(),'Broadcast',e.id))
                }}>Remove</button>
              </div>
            </div>
          </div>
        </>)
      }

    </div>
    </>}
  </div>
  </>)
  else
  return (<Error></Error>)
}

export default CustomerService
