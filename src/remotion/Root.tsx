import { Composition } from 'remotion'
import { MultiClipDemo }     from './Video'
import { PresentationVideo } from './presentation/PresentationVideo'
import { Apple30Video }      from './apple30/Apple30Video'

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MultiClipDemo"
        component={MultiClipDemo}
        durationInFrames={990}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{}}
      />
      <Composition
        id="MultiClipPresentation-16x9"
        component={PresentationVideo}
        durationInFrames={5400}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="MultiClipPresentation-9x16"
        component={PresentationVideo}
        durationInFrames={5400}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="MultiClipApple30-16x9"
        component={Apple30Video}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="MultiClipApple30-9x16"
        component={Apple30Video}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  )
}
