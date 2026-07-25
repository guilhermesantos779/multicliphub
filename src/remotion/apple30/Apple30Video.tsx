import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { SCENES, C } from './constants'
import { SceneA_Atmosphere } from './scenes/SceneA_Atmosphere'
import { SceneB_ProductHero } from './scenes/SceneB_ProductHero'
import { SceneC_MetricsLive } from './scenes/SceneC_MetricsLive'
import { SceneD_Analytics3D } from './scenes/SceneD_Analytics3D'
import { SceneE_BrandClose }  from './scenes/SceneE_BrandClose'

export function Apple30Video() {
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Sequence
        from={SCENES.atmosphere}
        durationInFrames={SCENES.product - SCENES.atmosphere + 15}
      >
        <SceneA_Atmosphere />
      </Sequence>

      <Sequence
        from={SCENES.product}
        durationInFrames={SCENES.metrics - SCENES.product + 15}
      >
        <SceneB_ProductHero />
      </Sequence>

      <Sequence
        from={SCENES.metrics}
        durationInFrames={SCENES.analytics - SCENES.metrics + 15}
      >
        <SceneC_MetricsLive />
      </Sequence>

      <Sequence
        from={SCENES.analytics}
        durationInFrames={SCENES.brand - SCENES.analytics + 15}
      >
        <SceneD_Analytics3D />
      </Sequence>

      <Sequence
        from={SCENES.brand}
        durationInFrames={SCENES.end - SCENES.brand}
      >
        <SceneE_BrandClose />
      </Sequence>
    </AbsoluteFill>
  )
}
