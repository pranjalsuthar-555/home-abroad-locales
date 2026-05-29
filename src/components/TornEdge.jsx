export default function TornEdge({ color = '#EDE0D4', flip = false }) {
  return (
    <div style={{ transform: flip ? 'scaleY(-1)' : 'none', lineHeight: 0, overflow: 'hidden', height: '32px' }}>
      <svg viewBox="0 0 1440 32" preserveAspectRatio="none" style={{ width: '100%', height: '32px', display: 'block' }}>
        <path
          d="M0,0
            C30,18 60,4 90,14 C120,24 150,8 180,16
            C210,24 240,6 270,12 C300,18 330,28 360,14
            C390,0 420,20 450,10 C480,0 510,22 540,16
            C570,10 600,26 630,14 C660,2 690,18 720,12
            C750,6 780,24 810,16 C840,8 870,20 900,10
            C930,0 960,18 990,14 C1020,10 1050,22 1080,12
            C1110,2 1140,20 1170,16 C1200,12 1230,6 1260,14
            C1290,22 1320,8 1350,18 C1380,28 1410,6 1440,14
            L1440,32 L0,32 Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
