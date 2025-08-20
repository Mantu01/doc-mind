export default function Testimonials() {
  const testimonials = [
    {
      category: "RESEARCHER",
      quote: "DocMind has transformed how I approach research. It connects ideas I never would have thought to link together.",
      author: "Dr. Sarah Chen, Academic Researcher"
    },
    {
      category: "ANALYST",
      quote: "The ability to upload different content types and get unified insights is game-changing for my workflow.",
      author: "Michael Rodriguez, Business Analyst"
    },
    {
      category: "STUDENT",
      quote: "Finally, a tool that helps me make sense of all my research materials. My thesis writing became so much clearer.",
      author: "Emma Thompson, Graduate Student"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          What Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                <div className="text-red-600 text-sm font-semibold">{testimonial.category}</div>
              </div>
              <p className="text-gray-300 mb-6 italic">&ldquo;{testimonial.quote}&ldquo;</p>
              <div className="text-sm text-gray-400">{testimonial.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}