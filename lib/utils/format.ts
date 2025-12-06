export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getStarArray(rating: number): number[] {
  const stars: number[] = []
  const filledStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < 5; i++) {
    if (i < filledStars) {
      stars.push(1)
    } else if (i === filledStars && hasHalfStar) {
      stars.push(0.5)
    } else {
      stars.push(0)
    }
  }

  return stars
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1
}

export function calculatePointsForNextLevel(points: number): number {
  const currentLevel = calculateLevel(points)
  const nextLevelPoints = currentLevel * 100
  return nextLevelPoints - points
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}
