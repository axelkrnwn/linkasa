import { useEffect, useState } from "react";

export function SuccessMsg(props:{msg:string}):JSX.Element
{

  const [isShow, setShow] = useState(true)
useEffect(() => {
  setTimeout(() => {
    setShow(false)
  }, 3000);

}, [])

  return (<div style = {{position:"fixed",display:"block",right:0,bottom:0,backgroundColor:'green',color:'white'}}>
    {isShow && <h1>{props.msg}</h1>}
  </div>)
}

export default SuccessMsg
