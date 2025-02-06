import { checkLogin } from "@renderer/middleware/Middleware";
import Error from "../view/error";
import Home from "./Home";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { getDatabase } from "@renderer/database/database";


export function ChatHome(): JSX.Element {

  const links: { [key: string]: { link: string; view: JSX.Element; }; } = {
    "Human Resources Director": {
      link: "/HRD_Home",
      view: <Home></Home>
    },
    "Civil Engineering Manager": {
      link: "/CivilEngineer_Home",
      view: <Home></Home>
    },
    "Maintenance Manager": {
      link: "/Maintenance_Home",
      view: <Home></Home>
    },
    "CFO": {
      link: "/CFO_Home",
      view: <Home></Home>
    },
    "Cargo Manager": {
      link: "/CargoHandling_Home",
      view: <Home></Home>
    },
    "Flight Operations Manager": {
      link: "/Flight_Operation_Home",
      view: <Home></Home>
    },
    "Airport Operations Manager": {
      link: "/Airport_Operation_Home",
      view: <Home></Home>
    },
    "Cargo Handler": {
      link: "/CargoHandler_Home",
      view: <Home></Home>
    },
    "Gate Agent": {
      link: "/Gate_Agent_Home",
      view: <Home></Home>
    },
    "Check-in Staff": {
      link: "/Check-in_Home",
      view: <Home></Home>
    },
    "Baggage Security Supervisor": {
      link: "/BaggageSecuritySupervisor_Home",
      view: <Home></Home>
    },
    "Lost and Found Staff": {
      link: "/Lost_And_Found_Home",
      view: <Home></Home>
    },
    "Information Desk Staff": {
      link: "/Information_Desk_Home",
      view: <Home></Home>
    },
    "Customer Service Manager": {
      link: "/Customer_Service_Home",
      view: <Home></Home>
    },
    "Landside Operations Manager": {
      link: "/Landside_Home",
      view: <Home></Home>
    },
    "CEO": {
      link: "/CEO_Home",
      view: <Home></Home>
    },
    "CSO": {
      link: "/CSO_Home",
      view: <Home></Home>
    },
    "COO": {
      link: "/COO_Home",
      view: <Home></Home>
    },
    "Customs And Border Control Officer": {
      link: "/Customs_And_Border_Home",
      view: <Home></Home>
    },
    "Logistics Manager": {
      link: "/Logistic_Home",
      view: <Home></Home>
    },
    "Fuel Manager": {
      link: "/Fuel_Home",
      view: <Home></Home>
    },
    "Ground Handling Manager": {
      link: "/GroundHandling_Home",
      view: <Home></Home>
    },
    "Ground Handling Staff": {
      link: "/GroundHandling_Home",
      view: <Home></Home>
    },
    "Maintenance Staff": {
      link: "/Maintenance_Home",
      view: <Home></Home>
    },
  };


  const back = () => {
    try {
      if (checkLogin()) {
        const role: string = window.localStorage.getItem('login');
        window.location.href = links[role].link;
      }
    } catch (error) {
      console.log('localstorage null');
    }

  };

  interface Chat {
    id: string;
    employeeID: string;
    message: string;
    sentDate: Date;
  }

  interface Chatroom {
    id: string;
    createdAt: Date;
    members: string[];
    name: string;
    chat: Chat[];
    chatDetail: JSX.Element;
    isShowed: boolean;
  }



  const [chatRooms, setChatRooms] = useState<Chatroom[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    // const q = query(collection(getDatabase(),'Chatroom'))
    // onSnapshot(q, (snapshot) =>{
    //   setChatRooms(snapshot.docs.map((p) => {
    //     let chatTemp:Chat[] = []
    //     const q2 = query(collection(getDatabase(),`Chatroom/${p.id}/Chat`))
    //     onSnapshot(q2,(snapshot) => {
    //       snapshot.forEach(
    //        c => {
    //         chatTemp.push(
    //             {
    //               id:c.id,
    //               employeeID:c.data().employeeID,
    //               message:c.data().message,
    //               sentDate:c.data().sentDate.toDate()
    //             }
    //         )
    //        }
    //       )
    //       // chatTemp = snapshot.docs.map(c => ())
    //     })
    //     // console.log(chatTemp)
    //     return (
    //       {
    //         id:p.id,
    //         createdAt:p.data().createdAt.toDate(),
    //         name:p.data().name,
    //         members:p.data().members,
    //         chat:chatTemp
    //       }
    //     )
    //   }))
    // })
    const fetchData = async () => {
      try {
        const chatRoomDocs = collection(getDatabase(), 'Chatroom');
        onSnapshot(chatRoomDocs, (snapshot) => {

          const chatRoomsData: Chatroom[] = [];

          for (const chatroomDoc of snapshot.docs) {
            const chatTemp: Chat[] = [];
            const chatColl = collection(getDatabase(), `Chatroom/${chatroomDoc.id}/Chat`);
            onSnapshot(chatColl, (e) => {
              e.forEach((c) => {
                chatTemp.push({
                  id: c.id,
                  employeeID: c.data().employeeID,
                  message: c.data().message,
                  sentDate: c.data().sentDate.toDate(),
                });
              });
            });


            if (chatRooms.filter(e => e.id == chatRoomDocs.id).length)
              chatRoomsData.push({
                id: chatroomDoc.id,
                createdAt: chatroomDoc.data().createdAt.toDate(),
                name: chatroomDoc.data().name,
                members: chatroomDoc.data().members,
                chat: chatTemp,
                chatDetail: <div>{chats.map(e => <div key={e.id}>{e.message}</div>)}</div>,
                isShowed: false
              });
          }
          setChatRooms(chatRoomsData);
        });


        // })
      } catch (error) {
      }
    };

    fetchData();

  }, []);

  const openChat = (id: string) => {
    setChatRooms(prevChatRooms => prevChatRooms.map(e => ({
      ...e,
      isShowed: e.id === id
    }))
    );
  };

  if (checkLogin()) {
    return (<div>
      <Home></Home>
      {/* <button onClick = {back}>Back</button> */}
      <div className="flex">
        <div className="bg-neutral-100 w-2/5 h-screen mt-5 px-5">
          {chatRooms.map(chatRoom => (<div key={chatRoom.id}>
            <button onClick={() => openChat(chatRoom.id)} className="my-4">
              {chatRoom.name}
            </button>
          </div>))}
        </div>
        <div className="bg-neutral-400 w-3/5 h-screen mt-5 p-5">
          {chatRooms.filter(chatRoom => { return (chatRoom.isShowed == true); }).map(e => { return e.chat.map(c => { console.log(c.message); return <div key={c.id}><h1 className="text-xl text-bold">{c.message}</h1></div>; }); })}
        </div>
      </div>
    </div>);
  } else {
    return (<Error value="you're not authenticated"></Error>);
  }
}
