import {useEffect, useState} from 'react'

// input is a state object, and keys is a object of key - value,
// When keydown event occurs we set the object by getting all the current values in object(...k)
// Then we find the key which was pressed by user through its code and set only that key to true in object
const useInput = () => {
  const [input, setInput] = useState({
    forward: false,
    back: false,
    left: false,
    right: false,
    shift: false,
  })

  const keys: {[key:string]:string} = {
    KeyW: "forward",
    KeyS: "back",
    KeyA: "left",
    KeyD: "right",
    ShiftLeft: "shift",
  }

  const findKey = (key: string) => keys[key];

  useEffect(()=>{

    const handleKeyDown = (e: { code: string; }) => {
        setInput((k)=>({...k,[findKey(e.code)]:true}));
    }
    const handleKeyUp = (e: { code: string; }) => {
        setInput((k)=>({...k,[findKey(e.code)]:false}));
    }

    document.addEventListener('keydown',handleKeyDown)

    document.addEventListener('keyup',handleKeyUp)

    // Cleanup
    return () => {
        document.removeEventListener("keydown",handleKeyDown)
        document.removeEventListener("keyup",handleKeyUp)
    }

  },[])

  return input

}

export default useInput