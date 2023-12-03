import { Html, useProgress } from '@react-three/drei'

function Loader() {
  const { progress } = useProgress()
  return <Html >{progress.toFixed(2)} % loaded</Html>
}

export default Loader