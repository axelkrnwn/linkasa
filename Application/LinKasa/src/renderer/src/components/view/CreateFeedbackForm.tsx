import { getDatabase, insert } from "@renderer/database/database"
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function CreateFeedbackForm(props:any):JSX.Element{

  const [questions, setQuestions] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])

  useEffect(() => {
    if (props.isUpdate){
      setFields(props.prevForm.question.map((p,idx) => <>
      <div className="flex gap-x-10 items-center">
          <input type="text" className="border-2 border-solid border-blue-100 rounded-lg my-3" defaultValue={p}/>
          <h1>Type</h1>
          <select name="" id="s" className="border-2 border-solid border-blue-100 rounded-lg my-3" defaultValue={props.prevForm.type[idx]}>
            <option value="Text">Text</option>
            <option value="Rating">Rating</option>
          </select>
      </div>
      </>))
    }
  }, [])

  const field = <>
  <div className="flex gap-x-10 items-center">
      <input type="text" className="border-2 border-solid border-blue-100 rounded-lg my-3"/>
      <h1>Type</h1>
      <select name="" id="s" className="border-2 border-solid border-blue-100 rounded-lg my-3">
        <option value="Text">Text</option>
        <option value="Rating">Rating</option>
      </select>
  </div>
  </>
  const [err,setErr] = useState(false)

  const addForm = (e:any) =>{
    e.preventDefault()
    if (fields.length < 1){
      setErr(true)
      return
    }
    for (let i = 0;i < fields.length*2;i++){
      if (i%2 === 1){
        types.push(e.target[3 + i].value)
      }else{
        questions.push(e.target[3 + i].value)
      }
    }
    props.func()
    insert('FeedbackForm', {
      questions:questions,
      types:types
    })

  }

  const updateForm = async (e:any) => {
    e.preventDefault()
    props.func()
    if (fields.length < 1){
      setErr(true)
      return
    }
    for (let i = 0;i < fields.length*2;i++){
      if (i%2 === 1){
        types.push(e.target[3 + i].value)
      }else{
        questions.push(e.target[3 + i].value)
      }
    }
    await updateDoc(doc(getDatabase(),'FeedbackForm',props.prevForm.id), {questions:questions, types:types})
  }

  const [fields, setFields] = useState<JSX.Element[]>([])



  const addField = () => setFields(prev => [...prev, field])

  const removeField = () => {
    setFields(prev => prev.slice(0,prev.length-1))
    setQuestions(prev => prev.slice(0, fields.length - 1))
    setTypes(prev => prev.slice(0, fields.length - 1))
  }

  return (<>
    <form onSubmit={props.isUpdate?updateForm:addForm} style={{position:"fixed",backgroundColor:'white',color:'black', padding:20, top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'50%'}} className="border-2 border-solid border-blue-100 rounded-lg  overflow-scroll drop-shadow-xl h-3/4 z-50 overflow-y-auto">
      <button onClick={() => {setFields([]);props.func()}}>Back</button>
      <h1 className="text-center font-bold">{props.isUpdate?'Update':'Create'} Feedback Form</h1>
      <div className="flex gap-x-10">
        <button type="button" className="my-4 px-4 bg-blue-400 font-bold text-white rounded-lg py-1 w-3/5" onClick={addField}>Add Question</button>
        <button type="button" className="my-4 px-4 bg-red-400 font-bold text-white rounded-lg py-1 w-3/5" onClick={removeField}>Remove Question</button>
      </div>
      <br />
      {fields.map((e,idx) => <>
      <label>Question {idx+1}</label> <br />
      {e} <br />
      </>)}
      {err && <><h1 className="text-red-500 text-center">you must add a question</h1></>}
      <button type="submit" className="my-4 px-4 bg-green-400 font-bold text-white rounded-lg py-1 w-full" >Submit</button>
    </form>
  </>)
}
