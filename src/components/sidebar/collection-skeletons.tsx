import React from "react"


export const CollectionSkeletons: React.FC = () => {
  return (
    <div className="space-y-1 pl-5">
      <div className="w-full h-3.5 bg-muted-foreground rounded-sm animate-pulse" />
      <div className="w-full h-3.5 bg-muted-foreground rounded-sm animate-pulse" />
      <div className="w-full h-3.5 bg-muted-foreground rounded-sm animate-pulse" />
      <div className="w-full h-3.5 bg-muted-foreground rounded-sm animate-pulse" />

    </div>
  )
}