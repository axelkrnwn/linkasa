import { initializeApp } from 'firebase/app';
import {getFirestore,collection, addDoc, getDocs, Firestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg7jJ8VVngLFCnv9KNYtQDjHYLasi59Hk",
  authDomain: "testing-8c6a5.firebaseapp.com",
  projectId: "testing-8c6a5",
  storageBucket: "testing-8c6a5.appspot.com",
  messagingSenderId: "1017892938594",
  appId: "1:1017892938594:web:1dcf801718dcb08a68823b",
  measurementId: "G-4VEHFZREPW"
};

export let app = initializeApp(firebaseConfig)

export let storage = getStorage(app)

export let instance:Firestore;

export const getDatabase = ():Firestore => {
      if (instance == null){
        instance = getFirestore(initializeApp(firebaseConfig))
      }
      return instance;
};

export const insert = async (col:string, data:object) =>{
  const p = getFirestore(initializeApp(firebaseConfig))
  const c = collection(p,col)
  try {
    await addDoc(c,data)
  } catch (error) {
    console.error(error)
  }
}

export const readDB = async (coll : string) =>{
  const p = getDatabase()
  const snapshot = await getDocs(collection(p,coll))

  const datas = snapshot.docs.map((a) => ({
    ...a.data(), id : a.id
  }))
  return datas

}

