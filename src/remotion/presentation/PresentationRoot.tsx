import React from 'react'
import { Composition } from 'remotion'
import { PresentationVideo } from './PresentationVideo'

export function PresentationRoot() {
  return (
    <>
      <Composition
        id="MultiClipPresentation_16x9"
        component={PresentationVideo}
        durationInFrames={5400}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="MultiClipPresentation_9x16"
        component={PresentationVideo}
        durationInFrames={5400}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  )
}
