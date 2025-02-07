import Link from "next/link";

const EthiopiaFlag = () => {
  const text = [
    { letter: "E", color: "text-green-500" },
    { letter: "t", color: "text-yellow-500" },
    { letter: "h", color: "text-red-500" },
    { letter: "i", color: "text-blue-500" },
    { letter: "o", color: "text-green-500" },
    { letter: "L", color: "text-yellow-500", ml: "ml-1" },
    { letter: "o", color: "text-red-500" },
    { letter: "s", color: "text-blue-500" },
    { letter: "t", color: "text-green-500" },
  ];

  const foundText = [
    { letter: "F", color: "text-red-500", ml: "ml-1" },
    { letter: "o", color: "text-blue-500" },
    { letter: "u", color: "text-green-500" },
    { letter: "n", color: "text-yellow-500" },
    { letter: "d", color: "text-red-500" },
  ];

  return (
    <Link href="/" className="text-xl lg:text-2xl font-bold flex items-center space-x-1">
      {text.map(({ letter, color, ml }, index) => (
        <span key={index} className={`${color} ${ml || ""}`}>
          {letter}
        </span>
      ))}
      <img src="/Emblem_of_Ethiopia.svg.png" alt="Emblem of Ethiopia" className="w-6 h-6" />
      {foundText.map(({ letter, color, ml }, index) => (
        <span key={index + text.length} className={`${color} ${ml || ""}`}>
          {letter}
        </span>
      ))}
    </Link>
  );
};

export default EthiopiaFlag;
