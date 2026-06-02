import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { SCENES } from './constants'
import { Scene0Intro }      from './scenes/Scene0Intro'
import { Scene1Problem }    from './scenes/Scene1Problem'
import { Scene2Solution }   from './scenes/Scene2Solution'
import { Scene3Metrics }    from './scenes/Scene3Metrics'
import { Scene4Ranking }    from './scenes/Scene4Ranking'
import { Scene5Comparison } from './scenes/Scene5Comparison'
import { Scene6SocialMedia } from './scenes/Scene6SocialMedia'
import { Scene7CTA }        from './scenes/Scene7CTA'

export function PresentationVideo() {
  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <Sequence from={SCENES.intro}      durationInFrames={SCENES.problem     - SCENES.intro}>
        <Scene0Intro />
      </Sequence>
      <Sequence from={SCENES.problem}    durationInFrames={SCENES.solution    - SCENES.problem}>
        <Scene1Problem />
      </Sequence>
      <Sequence from={SCENES.solution}   durationInFrames={SCENES.metrics     - SCENES.solution}>
        <Scene2Solution />
      </Sequence>
      <Sequence from={SCENES.metrics}    durationInFrames={SCENES.ranking     - SCENES.metrics}>
        <Scene3Metrics />
      </Sequence>
      <Sequence from={SCENES.ranking}    durationInFrames={SCENES.comparison  - SCENES.ranking}>
        <Scene4Ranking />
      </Sequence>
      <Sequence from={SCENES.comparison} durationInFrames={SCENES.social      - SCENES.comparison}>
        <Scene5Comparison />
      </Sequence>
      <Sequence from={SCENES.social}     durationInFrames={SCENES.cta         - SCENES.social}>
        <Scene6SocialMedia />
      </Sequence>
      <Sequence from={SCENES.cta}        durationInFrames={SCENES.end         - SCENES.cta}>
        <Scene7CTA />
      </Sequence>
    </AbsoluteFill>
  )
}
