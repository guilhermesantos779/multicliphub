import { Composition } from 'remotion'
import { MultiClipDemo } from './Video'

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MultiClipDemo"
        component={MultiClipDemo}
        durationInFrames={990} // 33s a 30fps
        fps={30}
        width={1280}
        height={720}
      />
    </>
  )
}
