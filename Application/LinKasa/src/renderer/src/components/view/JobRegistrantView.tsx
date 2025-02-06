import { collection, onSnapshot, query } from "firebase/firestore";
import { getDatabase } from "../../database/database";
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { checkUser } from "@renderer/middleware/Middleware";
import Error from "./error";
import Home from "../home/Home";

export function JobRegistrantView():JSX.Element{
  const obj = {
    id:"",
    name:"",
    DOB:new Date(),
    appliedJob:"",
    isAccepted:false
  }

  interface JobRegistrant{
    id:string,
    name:string,
    DOB:Date,
    appliedJob:string
  }

  const [jobRegistrants,s] = useState([obj])
    useEffect(() =>{
      const q = query(collection(getDatabase(),'JobRegistrant'))
      onSnapshot(q, (snapshot) =>{
        s(snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          DOB: doc.data().DOB.toDate(),
          appliedJob:doc.data().appliedJob,
          isAccepted:doc.data().isAccepted
        })))


      })

    }, [])

  if (checkUser('Human Resources Director'))
  return (<div>{
      window.location.pathname == '/job_registrants' &&
      <div>
        <Home></Home>
        <h1>Choose the job registrants</h1>
        {
          jobRegistrants.map(
            (job) => job.isAccepted == true && <Link key = {job.id} to = {`/job_registrants/${job.id}`}>{<h1>{job.name}</h1>}</Link>
          )
        }
      </div>
    }
    {/* <Routes>
    {
      jobRegistrants.map(
        (job) => <Route key = {job.id} path = {`/job_registrants/${job.id}`} element = {<h1>{job.name}</h1>}></Route>
      )
    }
    </Routes> */}
    </div>);
    else{
      return (
        <Error value = "You're Not Authorized"></Error>
      )
    }
}

export default JobRegistrantView
