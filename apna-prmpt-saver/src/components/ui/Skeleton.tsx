import { cn } from '../../utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5',
        'bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  )
}

export function PromptCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}
