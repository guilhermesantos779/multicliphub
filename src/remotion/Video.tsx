import { AbsoluteFill, Sequence } from 'remotion'
import { Scene0Intro } from './scenes/Scene0Intro'
import { Scene1Login } from './scenes/Scene1Login'
import { Scene2Dashboard } from './scenes/Scene2Dashboard'
import { Scene3Upload } from './scenes/Scene3Upload'
import { Scene4Publishing } from './scenes/Scene4Publishing'
import { Scene5Analytics } from './scenes/Scene5Analytics'
import { Scene6Ranking } from './scenes/Scene6Ranking'

// Cada cena recebe frame local 0..N via <Sequence from={start} durationInFrames={duração}>
const SCENES = [
  { from: 0,   duration: 90,  Component: Scene0Intro     }, // 3s
  { from: 90,  duration: 90,  Component: Scene1Login     }, // 3s
  { from: 180, duration: 120, Component: Scene2Dashboard }, // 4s
  { from: 300, duration: 210, Component: Scene3Upload    }, // 7s
  { from: 510, duration: 150, Component: Scene4Publishing}, // 5s
  { from: 660, duration: 150, Component: Scene5Analytics }, // 5s
  { from: 810, duration: 180, Component: Scene6Ranking   }, // 6s
]

export const MultiClipDemo = () => {
  return (
    <AbsoluteFill style={{ background: '#080808' }}>
      {SCENES.map(({ from, duration, Component }) => (
        <Sequence key={from} from={from} durationInFrames={duration}>
          <Component />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}
