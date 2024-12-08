export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function calculateNodePosition(
  parentX: number,
  parentY: number,
  direction: 'left' | 'right' | 'bottom'
): { x: number; y: number } {
  const SPACING = 150;
  
  switch (direction) {
    case 'left':
      return { x: parentX - SPACING, y: parentY };
    case 'right':
      return { x: parentX + SPACING, y: parentY };
    case 'bottom':
      return { x: parentX, y: parentY + SPACING };
  }
}