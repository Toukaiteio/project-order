<template>
  <div ref="wrapEl" class="map-canvas-wrap">
    <canvas ref="canvasEl" class="map-canvas-el"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { MapNode } from '../stores/game'

const props = defineProps<{
  nodes: MapNode[]
  compact?: boolean
}>()

const wrapEl  = ref<HTMLDivElement  | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

let animId  = 0
let logW    = 0
let logH    = 0
let startTs = 0

// ─── Canvas setup ──────────────────────────────────────────────

const setupCanvas = () => {
  const wrap   = wrapEl.value
  const canvas = canvasEl.value
  if (!wrap || !canvas) return

  const rect = wrap.getBoundingClientRect()
  const dpr  = window.devicePixelRatio || 1

  logW = rect.width
  logH = rect.height

  if (logW <= 0 || logH <= 0) return

  canvas.width  = Math.round(logW * dpr)
  canvas.height = Math.round(logH * dpr)
  canvas.style.width  = logW + 'px'
  canvas.style.height = logH + 'px'

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

// ─── Rendering ────────────────────────────────────────────────

const COLORS = {
  bg:          '#0c1319',
  gridLine:    'rgba(44, 110, 168, 0.07)',
  edgeLocked:  '#182330',
  edgeOpen:    '#243a52',
  nodeCurrent: '#2c6ea8',
  nodeCurrentGlow: 'rgba(44, 110, 168, 0.25)',
  nodeVisited: '#237554',
  nodeLocked:  '#131920',
  nodeLockedBorder: '#1a2534',
  labelCurrent: '#4a9fd4',
  labelVisited: '#4ea880',
  labelLocked:  '#3d5060',
  textMuted:    '#3d5060',
}

const NODE_R      = (compact: boolean) => compact ? 8  : 12
const LABEL_FONT  = (compact: boolean) => compact ? '500 9px "IBM Plex Mono", monospace'
                                                  : '500 10px "IBM Plex Mono", monospace'

const drawFrame = (ts: number) => {
  const canvas = canvasEl.value
  if (!canvas || logW <= 0 || logH <= 0) {
    animId = requestAnimationFrame(drawFrame)
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (!startTs) startTs = ts
  const elapsed = (ts - startTs) / 1000  // seconds

  const W = logW
  const H = logH

  // ── Background ──────────────────────────────────
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, W, H)

  // Subtle dot grid
  const DOT_SPACING = props.compact ? 18 : 24
  ctx.fillStyle = COLORS.gridLine
  for (let x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
    for (let y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
      ctx.beginPath()
      ctx.arc(x, y, 0.8, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const nodes = props.nodes
  if (!nodes.length) {
    animId = requestAnimationFrame(drawFrame)
    return
  }

  // ── Layout: fit all nodes to canvas ─────────────
  const padding = props.compact ? 24 : 40
  const cols = nodes.map(n => n.col)
  const rows = nodes.map(n => n.row)
  const minC = Math.min(...cols), maxC = Math.max(...cols)
  const minR = Math.min(...rows), maxR = Math.max(...rows)
  const rangeC = Math.max(maxC - minC, 1)
  const rangeR = Math.max(maxR - minR, 1)

  const availW = W - padding * 2
  const availH = H - padding * 2
  const cellW  = availW / rangeC
  const cellH  = availH / rangeR

  // Keep cells square, center in canvas
  const cell  = Math.min(cellW, cellH)
  const mapW  = rangeC * cell
  const mapH  = rangeR * cell
  const ox    = (W - mapW) / 2 - minC * cell
  const oy    = (H - mapH) / 2 - minR * cell

  const px = (n: MapNode) => n.col * cell + ox
  const py = (n: MapNode) => n.row * cell + oy

  // ── Edges ────────────────────────────────────────
  const drawn = new Set<string>()
  for (const node of nodes) {
    for (const connId of node.connections) {
      const key = [node.id, connId].sort().join('|')
      if (drawn.has(key)) continue
      drawn.add(key)

      const other = nodes.find(n => n.id === connId)
      if (!other) continue

      const isOpen =
        (node.state !== 'locked') && (other.state !== 'locked')

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(px(node),  py(node))
      ctx.lineTo(px(other), py(other))
      ctx.strokeStyle = isOpen ? COLORS.edgeOpen : COLORS.edgeLocked
      ctx.lineWidth   = isOpen ? 1.5 : 1
      if (!isOpen) {
        ctx.setLineDash([3, 4])
      }
      ctx.stroke()
      ctx.restore()
    }
  }

  // ── Nodes ─────────────────────────────────────────
  const NR    = NODE_R(!!props.compact)
  const LFONT = LABEL_FONT(!!props.compact)
  const LABEL_OFFSET = NR + 7

  for (const node of nodes) {
    const x = px(node)
    const y = py(node)

    if (node.state === 'current') {
      // Outer pulse rings (2 staggered)
      for (let ring = 0; ring < 2; ring++) {
        const phase  = (elapsed * 0.8 + ring * 0.5) % 1
        const radius = NR + 6 + phase * (NR + 10)
        const alpha  = (1 - phase) * 0.45

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(44, 110, 168, ${alpha})`
        ctx.lineWidth   = 1.2
        ctx.stroke()
      }

      // Node fill with glow
      ctx.shadowColor = COLORS.nodeCurrentGlow
      ctx.shadowBlur  = 14
      ctx.beginPath()
      ctx.arc(x, y, NR, 0, Math.PI * 2)
      ctx.fillStyle = COLORS.nodeCurrent
      ctx.fill()
      ctx.shadowBlur = 0

      // Inner highlight
      ctx.beginPath()
      ctx.arc(x, y - NR * 0.25, NR * 0.55, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.09)'
      ctx.fill()

      // Label
      ctx.font          = LFONT
      ctx.textAlign     = 'center'
      ctx.textBaseline  = 'top'
      ctx.fillStyle     = COLORS.labelCurrent
      ctx.fillText(node.label, x, y + LABEL_OFFSET)

    } else if (node.state === 'visited') {
      ctx.beginPath()
      ctx.arc(x, y, NR, 0, Math.PI * 2)
      ctx.fillStyle = COLORS.nodeVisited
      ctx.fill()

      // Inner highlight
      ctx.beginPath()
      ctx.arc(x, y - NR * 0.25, NR * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      ctx.fill()

      ctx.font         = LFONT
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle    = COLORS.labelVisited
      ctx.fillText(node.label, x, y + LABEL_OFFSET)

    } else {
      // Locked node
      ctx.beginPath()
      ctx.arc(x, y, NR, 0, Math.PI * 2)
      ctx.fillStyle   = COLORS.nodeLocked
      ctx.fill()
      ctx.strokeStyle = COLORS.nodeLockedBorder
      ctx.lineWidth   = 1
      ctx.stroke()

      // "?" mark
      ctx.font         = `500 ${Math.round(NR * 0.9)}px "IBM Plex Mono", monospace`
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle    = COLORS.labelLocked
      ctx.fillText('?', x, y)

      if (!props.compact) {
        ctx.font         = LFONT
        ctx.textBaseline = 'top'
        ctx.fillText(node.label, x, y + LABEL_OFFSET)
      }
    }
  }

  animId = requestAnimationFrame(drawFrame)
}

// ─── Lifecycle ────────────────────────────────────────────────

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  setupCanvas()
  animId = requestAnimationFrame(drawFrame)

  resizeObserver = new ResizeObserver(() => {
    setupCanvas()
  })
  if (wrapEl.value) resizeObserver.observe(wrapEl.value)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  resizeObserver?.disconnect()
})

watch(() => props.nodes, () => {
  // Node data changed – next frame will re-draw automatically
}, { deep: true })
</script>

<style scoped>
.map-canvas-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.map-canvas-el {
  display: block;
}
</style>
