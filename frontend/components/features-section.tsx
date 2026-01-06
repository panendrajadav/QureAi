export function FeaturesSection() {
  const features = [
    {
      title: "Comprehensive Database",
      description: "Access to a massive database of medications and their interactions",
      icon: "🔒",
    },
    {
      title: "Easy Management",
      description: "Simple tools to track multiple medications and dosages",
      icon: "⚙️",
    },
    {
      title: "AI-Powered Insights",
      description: "Get personalized health recommendations based on your profile",
      icon: "💡",
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Why Choose QuraAI?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Advanced safety features designed for your health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
