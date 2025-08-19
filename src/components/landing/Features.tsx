import { Upload, Lightbulb, Link2 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Upload,
      title: "Upload Anything",
      description: "Upload documents, websites, videos, and any content you want to analyze and synthesize."
    },
    {
      icon: Lightbulb,
      title: "Extract Insights",
      description: "AI-powered analysis extracts key insights and meaningful patterns from your research materials."
    },
    {
      icon: Link2,
      title: "Connect Ideas",
      description: "Develop your thinking by connecting related concepts and building comprehensive understanding."
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-gray-900/50 ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-red-600/50 transition-all group">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition-colors">
                <feature.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}