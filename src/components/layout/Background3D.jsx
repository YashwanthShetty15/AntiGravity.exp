import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'

function Stars(props) {
    const ref = useRef()

    // Custom random generation to avoid 'maath' dependency issues
    const [sphere] = useState(() => {
        const positions = new Float32Array(5000 * 3)
        for (let i = 0; i < 5000 * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 3
        }
        return positions
    })

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10
        ref.current.rotation.y -= delta / 15
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00f3ff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

export function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 bg-background">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
        </div>
    )
}
