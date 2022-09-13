import { useConst } from "@hmans/things"
import { composable, modules } from "material-composer-r3f"
import { between, plusMinus, upTo } from "randomish"
import { Layers, useRenderPipeline } from "render-composer"
import {
  Float,
  GlobalTime,
  Input,
  InstanceID,
  Mul,
  Rotation3DZ,
  Time,
  Vec2,
  Vec3
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { DoubleSide, Vector3 } from "three"
import { Emitter, Particles, useParticleAttribute } from "vfx-composer-r3f"
import { PSRDNoise2D } from "shader-composer-toybox"

export const Debris = () => {
  const time = useConst(() => Time())
  const rotationSpeed = useParticleAttribute(() => 0 as number)
  const scale = useParticleAttribute(() => 1 as number)

  const id = Float(InstanceID, { varying: true })
  const getNoise = (offset: Input<"float">) => PSRDNoise2D(Vec2([offset, id]))

  return (
    <group>
      <Particles layers-mask={Layers.TransparentFX}>
        <planeGeometry />

        <composable.meshStandardMaterial
          transparent
          side={DoubleSide}
          color="#888"
        >
          <modules.Rotate rotation={Rotation3DZ(Mul(time, rotationSpeed))} />
          <modules.Velocity
            direction={Mul(Vec3([getNoise(1), getNoise(2), getNoise(3)]), 5)}
            time={GlobalTime}
          />
          <modules.Scale scale={scale} />
        </composable.meshStandardMaterial>

        <Emitter
          limit={1000}
          rate={Infinity}
          setup={({ position, rotation }) => {
            position.set(plusMinus(30), upTo(15), plusMinus(30))
            rotation.random()
            rotationSpeed.value = plusMinus(0.1)
            scale.value = between(0.01, 0.05)
          }}
        />
      </Particles>
    </group>
  )
}