import {getDatabase} from '../database/database'
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Home from './home/Home';
import { collection, onSnapshot, query } from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';

function LoginForm():JSX.Element{


  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

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
    "Lost And Found Staff":{
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


  const obj = {
    id:"",
    email:"",
    password:"",
    role:""
  }
  const [users,setUsers] = useState([obj]);
  // users.shift()

  useEffect(() =>{
    const q = query(collection(getDatabase(),'employee'))
    onSnapshot(q, (snapshot) =>{
      setUsers(snapshot.docs.map((p) => (
          {
            id:p.id,
            email:p.data().email,
            password:p.data().password,
            role:p.data().role,
          }
      )))
    })


  }, [users])


  const handleLogin = async (e:any) =>{
    e.preventDefault()

    console.log('asd')
    console.log(users)
    users.forEach(async (user) => {

      if (email == user.email){
        console.log(user)
      }

      if (email == user.email && user.password == password && window.location.pathname == "/login_as_staff"){
          const auth = getAuth();
          await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const login = userCredential.user;
            window.localStorage.setItem('login',user.role);
            window.location.href = links[user.role].link
            console.log(login);
          // ...
        }).catch(async () => {
           const auth = getAuth()
           await signInWithEmailAndPassword(auth,email,password)
           .then((userCred) => {
            const login = userCred.user;
            window.localStorage.setItem('login',user.role);
            console.log(links[user.role])
            window.location.href = links[user.role].link
            console.log(login);
           })
        })
      }
    })


  };

  return (
    <div>
      <label htmlFor="email">Email</label><br />
      <input  type="email" name="email" id="email" onChange={(text) => {setEmail(text.target.value)}} style={{width:200}} /><br />
      <label htmlFor="password">Password</label><br />
      <input type="password" name="password" id="password" onChange={(pass) => {setPassword(pass.target.value)}} style={{width:200}}/><br />
      <button onClick={handleLogin} style={{width:200}}>Submit</button>
      <Navbar></Navbar>
    </div>
  );
}

export default LoginForm
