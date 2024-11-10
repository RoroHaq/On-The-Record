import { useState } from 'react';
import { useScroll, useSpring, animated } from '@react-spring/web'
import diskImage from '../assets/DiskFullRes.webp'

/**
 * Displays background disk and allows it's scrolling implementation.
 * The disk can also be used to navigate in the page by clicking or dragging it
 * @returns disk which spins in accordance with scroll
 */
export default function BackgroundDisk() {

  const { scrollYProgress } = useScroll({
    onChange: ({ value: { scrollYProgress } }) => {
      if (scrollYProgress > 0) {
        flipStyle()
      }
      if (scrollYProgress > 0.05){
        setTopDiskPop.start({ right: '-25em'})
      }
      else{
        setTopDiskPop.start({ right: '10em', })
      }
    },
    default: {
      immediate: true,
    },
  })

  const introSpin = useSpring({
    from: { transform: `rotate(${0}deg)` },
    to: { transform: `rotate(${360}deg)`},
  })

  //TODO mobile adjustment of values
  const [topDiskPop, setTopDiskPop] = useSpring(() => ({ right: '10em'}))

  const [diskStyle, setDiskStyle] = useState({
    ...introSpin,
    ...topDiskPop
  })

  const pageHeight = document.body.scrollHeight;

  const diskClickScroll = (e) => {
    let ratio = e.clientY/window.innerHeight
    //Rounds to bottom or top of page if close enough
    if (ratio < 0.1) { ratio = 0}
    if (ratio > 0.9) { ratio = 1}
    const deriveScrollToPos = ratio * pageHeight

    window.scrollTo({ top: deriveScrollToPos, behavior: "smooth" });
  }

  //TODO mobile scroll disable
  const diskDragScroll = (e) => {
    if (e.buttons == 1){
      const deriveScrollToPos = e.movementY / 30 * pageHeight
      window.scrollBy({ top: deriveScrollToPos, behavior: "smooth" });
    }
  }

  const totalDiskRotations = pageHeight/2500;
  const flipStyle = () => {
    setDiskStyle( {
      transform: scrollYProgress.to(val => `rotate(${-val * 360 * totalDiskRotations}deg)`),
      ...topDiskPop
    })
  }
  
  return (
    <animated.div >
      <animated.img src={diskImage} className="disk" alt="Record" style={diskStyle}
        onClick={diskClickScroll} onMouseMove={diskDragScroll}/>
    </animated.div>
  )
}
