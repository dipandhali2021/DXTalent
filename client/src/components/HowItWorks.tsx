import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "1",
    emoji: "📝",
    title: "Sign Up & Choose Path",
    description: "Join as a learner or recruiter. Pick your skill focus area and start your journey.",
  },
  {
    number: "2",
    emoji: "🎯",
    title: "Complete Challenges",
    description: "Tackle real-world DX problems. Earn points, badges, and climb the leaderboard.",
  },
  {
    number: "3",
    emoji: "🏆",
    title: "Get Recognized",
    description: "Top performers get noticed by recruiters. Showcase verified skills, not just claims.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 text-sm font-bold">
            🎮 Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground rotate-playful-2">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to master DX skills and get discovered
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div
                className={`bg-card brutal-border brutal-shadow rounded-xl p-8 hover:brutal-shadow-lg hover:-translate-y-1 transition-all ${
                  index === 0 ? "rotate-playful-1" : index === 1 ? "rotate-playful-2" : "rotate-playful-3"
                }`}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-accent text-accent-foreground brutal-border flex items-center justify-center text-2xl font-bold rotate-12">
                  {step.number}
                </div>

                {/* Emoji */}
                <div className="text-6xl mb-4 animate-bounce-slow">{step.emoji}</div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.description}</p>
              </div>

              {/* Arrow between steps (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-8 z-10 text-primary transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
