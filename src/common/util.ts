function hslaString(hsla: {h:number,s:number,l:number,a:number,t?:any}) {
  return `hsla(${hsla.h.toFixed(1)}, ${hsla.s.toFixed(1)}%, ${hsla.l.toFixed(1)}%, ${hsla.a.toFixed(3)})`
}
export function getGradientColor(stops: {t:number,h:number,s:number,l:number,a:number}[], t:number) {
  if (stops.length === 0) return 'hsla(300, 100%, 50%, 1)' // hot pink for error
  if (t <= stops[0]!.t) return hslaString(stops[0]!)
  if (t >= stops[stops.length-1]!.t) return hslaString(stops[stops.length-1]!)

  // find surrounding stops
  let i = 1;
  while (t > stops[i]!.t) i++;
  const a = stops[i-1]!, b = stops[i]!
  const u = (t - a.t) / (b.t - a.t)

  const hueDelta = ((((b.h - a.h) % 360) + 540) % 360) - 180 // shortest arc
  const h = (a.h + u * hueDelta + 360) % 360
  const s = a.s + u * (b.s - a.s)
  const l = a.l + u * (b.l - a.l)
  const aa = a.a + u * (b.a - a.a)

  return hslaString({ h, s, l, a: aa })
}
