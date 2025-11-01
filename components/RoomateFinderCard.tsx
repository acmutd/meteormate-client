import React from 'react'

interface RoomateFinderCardProps {
    data: string | {
        image: {
            src: string;
            alt: string;
        };
        name: string;
        major: string;
        grade: string;
        description: string;
        tags: string[];
        personalities: string[];
    };
}

export default function RoomateFinderCard({
    data
}: RoomateFinderCardProps) {
    const cardData = typeof data === 'string' ? JSON.parse(data) : data;
    const  {image, name, major, grade, description, tags, personalities} = cardData

    return(
        <div className="rounded-2xl bg-white w-120 h-120">
            {/* image section with name, major, grade in bottom left*/}
            <div className="relative rounded-t-2xl h-1/2 w-full">
                <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover h-full w-full rounded-t-2xl"
                />
                {/* text with user info */}
                <div className="absolute bottom-2 left-2 rounded-4xl drop-shadow-2xl pb-2 pt-1 px-4 bg-white/20 backdrop-blur-md">
                    <h1 className="items-left text-white text-sm font-bold">{name}</h1>
                    <p className="text-white text-xs">{major} - {grade}</p>
                </div>
            </div>
            {/* tags section */}
            <div className="p-3">
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, index: number) => (
                        <div
                            key={index}
                            className="bg-[#7B7B7B] text-white text-xs font-semibold rounded-full px-3 py-1"
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
            {/* description*/}
            <div className="text-sm px-3">{description}</div>
            {/* personalities section */}
            <div className="p-3">
                <div className="items-center justify-center flex flex-wrap gap-2">
                    {personalities.map((personality: string, index: number) => (
                        <div
                            key={index}
                            className="bg-[#E2E2E2] rounded-xl p-2 flex flex-col items-center w-15"
                        >
                            <img
                                src={`/images/personality_images/${personality}.png`}
                                alt={personality}  
                                className="w-7 h-7" 
                            />
                            <p className="capitalize text-center text-[0.6rem] pt-1">{personality.replace(/_/g, ' ')}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* more info button */}
            <div className="mt-2 flex items-center justify-center">
                <button
                    className="rounded-4xl px-10 py-2 bg-gradient-to-br from-[#FF9100] to-[#FFC94C] text-white hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                    onClick={() => console.log("more info button pressed")}
                >
                    More Information</button>
            </div>
        </div>
    );
}