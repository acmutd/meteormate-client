import Image from 'next/image';

interface InterestCardProps {
  name: string;
  isSelected: boolean;
  onToggle: () => void;
}

export default function InterestCard({ name, isSelected, onToggle }: InterestCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        flex flex-col items-center justify-center
        cursor-pointer
        rounded-2xl p-4 w-24 h-24
        transition-colors duration-200
        ${isSelected ? 'bg-[#FFC03F]' : 'bg-[#F1EBE2]'}
      `}
    >
      <div className="relative w-12 h-12 mb-2">
        <Image
          src={`/images/createProfileInterests/${name}.png`}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-xs font-medium text-gray-800 text-center">
        {name}
      </span>
    </button>
  );
}
