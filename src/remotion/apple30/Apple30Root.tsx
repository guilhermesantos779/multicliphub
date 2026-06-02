import React from 'react'
import { Composition } from 'remotion'
import { Apple30Video } from './Apple30Video'

export function Apple30Root() {
  return (
    <>
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
