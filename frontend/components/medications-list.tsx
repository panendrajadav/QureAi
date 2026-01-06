interface MedicationsListProps {
  medications: Array<{
    name: string
    status: string
  }>
}

export function MedicationsList({ medications }: MedicationsListProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-4">Your Medications</h3>
      <div className="space-y-3">
        {medications.map((med) => (
          <div key={med.name} className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <span className="text-sm font-medium text-foreground">{med.name}</span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{med.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
