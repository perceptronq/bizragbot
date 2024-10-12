const words = [
    "Market Research Queries 💡",
    "Financial analysis 📊",
    "Sales predictions 📈",
    "Customer support 🤩",
    "Market Research Queries 💡",
    "Financial analysis 📊",
    "Sales predictions 📈",
    "Customer support 🤩",
    "Market Research Queries 💡",
    "Financial analysis 📊",
    "Sales predictions 📈",
    "Customer support 🤩",
    "Market Research Queries 💡",
    "Financial analysis 📊",
    "Sales predictions 📈",
    "Customer support 🤩",
    "Market Research Queries 💡",
    "Financial analysis 📊",
    "Sales predictions 📈",
    "Customer support 🤩",
    "Market Research Queries 💡",
    "Financial analysis 📊",
    "Sales predictions 📈",
    "Customer support 🤩",
    "Market Research Queries 💡",
    "Financial analysis 📊",
    "Sales predictions 📈",
    "Customer support 🤩",
];

export const TapeSection = () => {
    return (
        <div className="py-4 lg:py-8 overflow-x-clip">
            <div className="bg-gray-800">
                <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <div className="flex flex-none gap-4 py-3 animate-move-left [animation-duration:40s]">
                        {words.map(word => (
                            <div key={word} className="inline-flex gap-4 items-center">
                                <span className="text-white uppercase font-semibold text-sm">{word}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
