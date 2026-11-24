function bits(value: string, count: number) {
  let hash = 2166136261;
  const flags: boolean[] = [];
  for (let i = 0; i < value.length; i += 1) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  let state = hash >>> 0;
  for (let i = 0; i < count; i += 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    flags.push(state % 3 !== 0);
  }
  return flags;
}

export function QrMark({ value }: { value: string }) {
  const size = 21;
  const cells = bits(value, size * size);
  const finder = (x: number, y: number) => {
    const rects = [];
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const edge = row === 0 || col === 0 || row === 6 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4);
        if (edge) rects.push(<rect key={`${x + col}-${y + row}`} x={x + col} y={y + row} width="1" height="1" fill="#0D2E52" />);
      }
    }
    return rects;
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-52 w-52 bg-white" role="img" aria-label="전시 QR">
      {cells.map((on, index) => {
        const x = index % size;
        const y = Math.floor(index / size);
        const inFinder = (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);
        if (inFinder || !on) return null;
        return <rect key={index} x={x} y={y} width="1" height="1" fill="#0D2E52" />;
      })}
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
    </svg>
  );
}
