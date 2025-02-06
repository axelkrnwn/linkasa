import { checkLogin } from "@renderer/middleware/Middleware"
import Error from "../view/error"
import Home from "./Home"
import { useEffect, useState } from "react"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { getDatabase, insert } from "@renderer/database/database"
import { getAuth } from "firebase/auth"
import ChatRoomForm from "./ChatRoomForm"

export function ChatHome():JSX.Element{

  interface Chat{
    chatRoomID:string,
    id:string,
    employeeEmail:string
    message:string,
    sentDate:Date,
  }

  interface Chatroom {
    id:string,
    createdAt:Date,
    members:string[],
    name:string
  }



  const [chatRooms, setChatRooms] = useState<Chatroom[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [curr, setCurr] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatRoomDocs = collection(getDatabase(), 'Chatroom')
        onSnapshot(chatRoomDocs, async (snapshot) => {
          setChatRooms( snapshot.docs.map(
            (chatroomDoc) => {
                    return {
                      id: chatroomDoc.id,
                      createdAt: chatroomDoc.data().createdAt.toDate(),
                      name: chatroomDoc.data().name,
                      members: chatroomDoc.data().members,
                    }
            }
          ))

        })


      } catch (error) {
      }
    };

    fetchData();

  }, [chatRooms])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatDocs = collection(getDatabase(), 'Chat')
        const q =query(chatDocs, orderBy('sentDate'))
        onSnapshot(q, async (snapshot) => {

          setChats( snapshot.docs.map(
            (chatroomDoc) => {
                    return {
                      chatRoomID: chatroomDoc.data().chatRoomID,
                      id: chatroomDoc.id,
                      employeeEmail:chatroomDoc.data().employeeEmail,
                      message: chatroomDoc.data().message,
                      sentDate: chatroomDoc.data().sentDate.toDate(),
                    }
            }
          ))
        })

      } catch (error) {
      }
    };

    fetchData();

  }, [chats])

  const openChat = (id:string) => {
    // console.log(id)
    setCurr(id)
  }


  const [inpChat, setInp] = useState('')

  const [user, setUser] = useState('')

  useEffect(() => {
    if (checkLogin()){
      const auth = getAuth()
    try{
      console.log(auth.currentUser?.email)
      const col = collection(getDatabase(),'employee')
      onSnapshot(col, (snapshot) => {
        setUser(snapshot.docs.filter(e => e.data().email === auth.currentUser?.email)[0].data().email)
      })
    }catch(error){

    }
    }
  }, [user])

  const sendChat = (e) => {
    e.preventDefault()
    try{
        if (curr !== ''){
          insert('Chat',{message:inpChat,chatRoomID:curr,sentDate:new Date(),employeeEmail:user})
          setInp('')
        }
    }catch(error){
    }
  }

  const [isAddRoom, setAddRoom] = useState(false)

  if (checkLogin()){
  return (<div className="text-neutral-950 h-screen">
    {(isAddRoom) && <div className="h-full w-full blur-3xl bg-slate-100 opacity-95 fixed z-40 t-0 l-0"></div>}
    {isAddRoom && <ChatRoomForm email = {getAuth().currentUser?.email} func = {() => setAddRoom(false)}></ChatRoomForm>}
    <div>
      <Home></Home>
      <button onClick={() => setAddRoom(true)}>Add Room</button>
    </div>
    <div className="flex h-full">
      <div className="bg-neutral-100 w-2/5 h-full px-5">
        {chatRooms.filter(e => e.members.includes(getAuth().currentUser?.email)).map(chatRoom => (<div key = {chatRoom.id}>
          <button onClick={() => openChat(chatRoom.id)}  className="my-4">
            {chatRoom.name}
          </button>
        </div>))}
      </div>
      <div className= {(!isAddRoom)?'bg-neutral-400 w-3/5 overflow-scroll':'bg-neutral-400 w-3/5 '} id = "chats" style={{height:'96%'}}>
        {chats.filter(e => e.chatRoomID === curr).map(e =>
        <div className={user === e.employeeEmail? 'translate-x-full w-1/2 mt-2':'w-1/2 mt-2'} key = {e.id}>
          <div className={user === e.employeeEmail? "bg-green-400 text-right":'bg-slate-500'}>
            <h1 >{user === e.employeeEmail?'you':e.employeeEmail}</h1>
            <h1 className={user === e.employeeEmail? "font-bold":''}>{e.message}</h1>
          </div>
        </div>
        )}

          <div style={{height:'4%',backgroundColor:'white',width:'60%', bottom:0,right:0}} className="fixed z-10">
            <input id = "sendInput" type="text" className="w-4/5 border-solid border-2 border-slate-900" onChange={(e) => setInp(e.target.value)}/>
            <button onClick={sendChat} className="w-1/5">Send</button>
          </div>
      </div>
    </div>
  </div>)
  }else{
    return (<Error value = "you're not authenticated"></Error>)
  }
}

export default ChatHome
