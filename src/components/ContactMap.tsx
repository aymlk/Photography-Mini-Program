import { MapPin, Navigation } from 'lucide-react'
import type { ContactLocation } from '../content/contact'

type Props = {
  /** sm = 区块内的小地图；lg = modal 里的大地图 */
  size?: 'sm' | 'lg'
  loc: ContactLocation
  onClick?: () => void
}

/**
 * 风格化地图（纯 SVG，无外部地图 SDK / 无 key 依赖）。
 *
 * 暗色基调 + 暖白主色，与站点视觉一致。
 * 水系参考富春江走向（桐庐段），但为示意性绘制，不用于导航用途。
 *
 * 点击后由父组件决定行为（展开 modal）。
 */
export default function ContactMap({ size = 'sm', loc, onClick }: Props) {
  const large = size === 'lg'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`查看 ${loc.label} 的位置`}
      className="group relative block w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0d] text-left transition-colors duration-500 hover:border-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <div className={`relative w-full ${large ? 'aspect-[16/10]' : 'aspect-[16/11]'}`}>
        <svg
          viewBox="0 0 480 320"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {/* 底图网格 */}
          <g stroke="rgba(255,255,255,0.035)" strokeWidth="1">
            {[40, 80, 120, 160, 200, 240, 280].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="480" y2={y} />
            ))}
            {[60, 120, 180, 240, 300, 360, 420].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="320" />
            ))}
          </g>

          {/* 建成区色块 —— 桐庐县城一带 */}
          <path
            d="M163,152 L236,137 L270,176 L241,224 L171,206 Z"
            fill="#DEDBC8"
            fillOpacity="0.05"
          />

          {/* 富春江（主干水系） */}
          <path
            d="M-20,215 C70,190 130,246 205,206 C276,168 341,206 500,180"
            fill="none"
            stroke="#DEDBC8"
            strokeOpacity="0.22"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* 分水江（支流） */}
          <path
            d="M332,52 C310,110 274,156 207,201"
            fill="none"
            stroke="#DEDBC8"
            strokeOpacity="0.13"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* 主干道 */}
          <g fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" strokeLinecap="round">
            <path d="M-10,95 L95,120 L175,88 L265,125 L355,95 L490,112" />
            <path d="M150,-10 L168,95 L158,190 L178,330" />
          </g>
          {/* 次干道 */}
          <g fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M-10,270 L120,255 L230,286 L340,255 L490,272" />
            <path d="M-10,45 L110,60 L220,32 L330,58 L490,38" />
            <path d="M60,-10 L75,120 L58,240 L70,330" />
            <path d="M400,-10 L388,130 L404,250 L396,330" />
          </g>

          {/* 定位图钉 */}
          <g transform="translate(212,178)">
            {/* 脉冲圈 */}
            <circle className="map-pin-pulse" r="30" fill="#DEDBC8" fillOpacity="0.10" />
            <circle r="19" fill="#DEDBC8" fillOpacity="0.14" />
            {/* 图钉本体 */}
            <path
              d="M0,-27 C-10.5,-27 -17.5,-19.5 -17.5,-9 C-17.5,3.5 0,23 0,23 C0,23 17.5,3.5 17.5,-9 C17.5,-19.5 10.5,-27 0,-27 Z"
              fill="#DEDBC8"
            />
            <circle cy="-9" r="6" fill="#0d0d0d" />
          </g>

          {/* 地名标注 */}
          <text
            x="242"
            y="160"
            fill="#E1E0CC"
            fillOpacity="0.9"
            fontSize={large ? '18' : '16'}
            fontWeight="500"
          >
            桐庐
          </text>
          <text
            x="242"
            y={large ? '182' : '180'}
            fill="#E1E0CC"
            fillOpacity="0.45"
            fontSize={large ? '13' : '12'}
          >
            富春江畔
          </text>

          {/* 指北针 */}
          <g transform="translate(444,270)" opacity="0.5">
            <circle r="17" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)" />
            <path d="M0,-11 L4.5,4 L0,1.2 L-4.5,4 Z" fill="#DEDBC8" />
            <text
              x="0"
              y="-13"
              textAnchor="middle"
              fill="#E1E0CC"
              fontSize="9"
              fillOpacity="0.7"
            >
              N
            </text>
          </g>
        </svg>

        {/* 噪点叠加，与全站质感统一 */}
        <div
          className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
          aria-hidden
        />

        {/* 暗角，让角标文字更易读 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.6) 100%)',
          }}
          aria-hidden
        />
      </div>

      {/* 底部信息条 */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" strokeWidth={2} />
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-[#E1E0CC] sm:text-[13px]">
              {loc.label}
            </p>
            <p className="truncate text-[10px] text-gray-500 sm:text-[11px]">{loc.detail}</p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-[10px] text-primary/80 transition-opacity duration-300 group-hover:opacity-100 sm:text-[11px]">
          {large ? '在地图中打开' : '点击定位'}
          <Navigation
            className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-3.5 sm:w-3.5"
            strokeWidth={2}
          />
        </span>
      </div>
    </button>
  )
}
