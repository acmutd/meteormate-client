"use client"
import RoomateFinderCard from "../../../components/RoomateFinderCard";

export default function() {
    return(
        <RoomateFinderCard
            image={{src: "/images/roomate_finder_placeholder.png", alt: "image"}}
            name="Jane K."
            major="Computer Science"
            grade="Junior"
            description="Hii my name is Jane, I love video games and parties! 
                I have 2 cats named Milk and Cookies, I am looking for someone chill."
            tags={["$800> Rent", "Off Campus", "Los Rios Apartments"]}
            personalities={["very_neat", "night","running", "music", "social", "gaming"]}
        ></RoomateFinderCard>
    );
}