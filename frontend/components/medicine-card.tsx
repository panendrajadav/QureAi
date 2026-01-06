import { Button } from "@/components/ui/button"

interface MedicineProps {
  medicine: {
    id: number
    name: string
    dosage: string
    frequency: string
    times: string
    reason: string
    prescribedBy: string
    startDate: string
  }
}

export function MedicineCard({ medicine }: MedicineProps) {
  return (
    <div className="border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-foreground">{medicine.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">Reason: {medicine.reason}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted rounded-lg p-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Dosage</p>
          <p className="text-sm font-semibold text-foreground mt-1">{medicine.dosage}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Frequency</p>
          <p className="text-sm font-semibold text-foreground mt-1">{medicine.frequency}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Times</p>
          <p className="text-sm font-semibold text-foreground mt-1">{medicine.times}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Prescribed By</p>
          <p className="text-sm font-semibold text-foreground mt-1">{medicine.prescribedBy}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">Started: {medicine.startDate}</div>
    </div>
  )
}
