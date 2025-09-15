
export function getBondLevel(exp) {
  if (exp < 10) return { level: 1, label: "คนรู้จัก" };
  if (exp < 30) return { level: 2, label: "เพื่อนใหม่" };
  if (exp < 60) return { level: 3, label: "เพื่อนสนิท" };
  if (exp < 100) return { level: 4, label: "เพื่อนแท้" };
  return { level: 5, label: "คู่ใจ 💖" };
}
