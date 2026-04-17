// Catmull-Rom 插值 (p1 到 p2 之间的点)
function catmullRomPoint(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
        x: 0.5 * ((2 * p1.x) +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
    };
}

function sampleCatmullRomCurve(pointsArray, tension, segmentsPerSegment = 20) {
  // pointsArray: [{x, y}] 形式的控制点数组
  // tension: Konva.Line 的 tension 值 (0~1)，通常 tension=0 是直线，tension=0.5 是标准 Catmull-Rom
  // 注意：Konva 的 tension 实现略有不同，但上述公式在 tension=0.5 时就是标准 Catmull-Rom
  // 为简化，我们固定使用标准 Catmull-Rom，忽略 tension 参数（或映射到插值公式中的 alpha）
  // 对于更精确的匹配，可参考 Konva 源码，但视觉上差异很小。

  const n = pointsArray.length
  if (n < 2) return pointsArray.slice()

  const sampled = []

  // 处理第一个点
  sampled.push(pointsArray[0])

  // 对每段曲线进行采样
  for (let i = 0; i < n - 1; i++) {
    const p0 = pointsArray[Math.max(0, i - 1)]
    const p1 = pointsArray[i]
    const p2 = pointsArray[i + 1]
    const p3 = pointsArray[Math.min(n - 1, i + 2)]

    // 在 p1 和 p2 之间插入 segmentsPerSegment 个点
    for (let s = 1; s <= segmentsPerSegment; s++) {
      const t = s / segmentsPerSegment
      const point = catmullRomPoint(p0, p1, p2, p3, t)
      sampled.push(point)
    }
  }

  return sampled
}

function lineToPathWithTension(line, segmentsPerSegment = 30) {
  // 1. 获取原始控制点 (平铺数组 -> 对象数组)
  const pointsFlat = line.points()
  const controlPoints = []
  for (let i = 0; i < pointsFlat.length; i += 2) {
    controlPoints.push({ x: pointsFlat[i], y: pointsFlat[i + 1] })
  }

  // 2. 采样得到平滑曲线上的密集点
  const tension = line.tension() || 0.5 // 默认 0.5
  const sampledPoints = sampleCatmullRomCurve(controlPoints, tension, segmentsPerSegment)

  // 3. 构建 SVG 路径字符串
  let pathData = `M ${sampledPoints[0].x} ${sampledPoints[0].y}`
  for (let i = 1; i < sampledPoints.length; i++) {
    pathData += ` L ${sampledPoints[i].x} ${sampledPoints[i].y}`
  }

  // 4. 复制原 Line 的样式属性
  const commonAttrs = {
    stroke: line.stroke(),
    strokeWidth: line.strokeWidth(),
    strokeScaleEnabled: line.strokeScaleEnabled(),
    lineCap: line.lineCap(),
    lineJoin: line.lineJoin(),
    dash: line.dash(),
    shadowColor: line.shadowColor(),
    shadowBlur: line.shadowBlur(),
    shadowOffsetX: line.shadowOffsetX(),
    shadowOffsetY: line.shadowOffsetY(),
    shadowOpacity: line.shadowOpacity(),
    listening: line.listening(),
    visible: line.visible(),
    name: line.name(),
    id: line.id(),
  }

  // 5. 创建 Path 对象
  const path = new Konva.Path({
    data: pathData,
    ...commonAttrs,
  })

  return path
}

export {lineToPathWithTension as ltp}
