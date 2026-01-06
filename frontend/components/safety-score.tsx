interface SafetyScoreProps {
  score: number
  riskLevel: string
  lastUpdated: string
}

export function SafetyScore({ score, riskLevel, lastUpdated }: SafetyScoreProps) {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-6">Safety Score</h3>

      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-6">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(score / 100) * (2 * Math.PI * 90)} ${2 * Math.PI * 90}`}
              strokeLinecap="round"
              className="text-primary transition-all"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-primary">{score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>

        <p className="text-center">
          <span className="font-semibold text-foreground">{riskLevel}</span>
          <br />
          <span className="text-xs text-muted-foreground">Last updated: {lastUpdated}</span>
        </p>
      </div>
    </div>
  )
}
