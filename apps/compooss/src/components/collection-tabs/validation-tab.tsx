import { ShieldCheck } from "lucide-react"

export const ValidationTab = () => {
  return <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
        <ShieldCheck className="h-3.5 w-3.5" />
      </div>
      <p className="text-sm text-muted-foreground">Validation</p>
      <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
    </div>
  </div>
}