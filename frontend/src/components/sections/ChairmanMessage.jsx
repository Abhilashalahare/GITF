import chairman from "../../assets/chairman.png"

export default function ChairmanMessage({ data }) {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-[#7E5CAD]">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header matching reference[cite: 9] */}
        <div className="flex items-center justify-center mb-16 md:mb-24">
          <div className="h-[1px] bg-brand-charcoal/30 flex-grow max-w-[150px]"></div>
          <h2 className="px-6 font-serif italic text-3xl md:text-4xl text-brand-charcoal">
            Chairman's Message
          </h2>
          <div className="h-[1px] bg-brand-charcoal/30 flex-grow max-w-[150px]"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
          
          {/* Portrait Column */}
          <div className="w-full lg:w-5/12 flex flex-col items-center">
            <div className="w-full max-w-sm overflow-hidden bg-transparent">
              {/* Using mix-blend to help standard rectangular images merge better into the solid background */}
              <img 
                src={chairman} 
                alt={data.signature} 
                className="w-full h-auto object-cover filter grayscale mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" 
              />
            </div>
            <div className="mt-8 text-center w-full relative">
              {/* Mimicking the elegant cursive/serif signature style from the reference[cite: 9] */}
              <h3 className="font-serif italic text-5xl md:text-6xl text-brand-white -rotate-2">
                {data.signature}
              </h3>
            </div>
          </div>

          {/* Message Document Column */}
          <div className="w-full lg:w-7/12 lg:pt-8">
            {/* Main title is white[cite: 9] */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic mb-8 leading-tight text-brand-white">
              {data.title}
            </h2>
            
            {/* Body text is dark for readability and reference matching[cite: 9] */}
            <div className="text-brand-charcoal space-y-6 text-lg font-sans font-medium">
              {data.body.map((para, i) => (
                <p key={i} className="leading-relaxed">{para}</p>
              ))}
            </div>
            
            <p className="mt-10 text-brand-charcoal text-sm font-bold uppercase tracking-widest bg-[#66BB6A] inline-block px-4 py-2">
              {data.designation}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}