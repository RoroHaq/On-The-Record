import { useState } from 'react';
import { useScroll, useSpring, animated } from '@react-spring/web'
import diskImage from '../assets/DiskFullRes.webp'


/**
 * Displays background disk and allows it's scrolling implementation
 * @returns disk which spins in accordance with scroll
 */
export default function BackgroundDisk() {

  const { scrollYProgress } = useScroll({
    onChange: ({ value: { scrollYProgress } }) => {
      if (scrollYProgress > 0) {
        flipStyle()
      }
    },
    default: {
      immediate: true,
    },
  })

  const springs = useSpring({
    from: { transform: `rotate(${0}deg)` },
    to: { transform: `rotate(${360}deg)`},
  })

  const [diskStyle, setDiskStyle] = useState({
    ...springs
  })

  const flipStyle = () => {
    setDiskStyle( {
      transform: scrollYProgress.to(val => `rotate(${val * 360 * 2}deg)`)
    })
  }
  
  return (
    <animated.div >
      <animated.img src={diskImage} className="disk" alt="Record" style={diskStyle}/>
    </animated.div>
  )
}
