export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Upload",
      description: "Upload your research materials from various sources"
    },
    {
      number: "2",
      title: "Analyze",
      description: "AI processes and analyzes your content for key insights"
    },
    {
      number: "3",
      title: "Refine",
      description: "Refine and organize ideas based on AI recommendations"
    },
    {
      number: "4",
      title: "Insight",
      description: "Generate clear insights and actionable conclusions"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}