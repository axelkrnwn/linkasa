export function checkUser(prop:string){

  if (window.localStorage.getItem('login') != prop){
    return false
  }
  return true

}

export function checkLogin(){
  if (window.localStorage.getItem('login') != null){
    return true;
  }
  return false;
}
