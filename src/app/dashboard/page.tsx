"use client";
import ProfileCard from "@/components/cardComponent/ProfileCard";

export default function Discover() {
  return (
    <div className="flex justify-center py-7">
      <ProfileCard
        name="Aastha Sheth"
        subtitle="Comp sci. major - senior"
        images={["/p2.png", "/p3.jpg","/p2.png"]}
        tags={[
          { label: "Does not have a lease", tone: "orange"},
          { label: "Year long lease", tone: "orange"},
          { label: "$1200 Rent range", tone: "orange"},
          { label: "Has a pet", tone: "gray" },
        ]}
        bio="Easygoing, clean, and respectful roommate. I value communication, shared spaces that stay organized, and a chill home vibe..."
        onDislike={() => console.log("dislike")}
        onRewind={() => console.log("rewind")}
        onLike={() => console.log("like")}
        back={{
					interests: [
						{ label: "Music", selected: true },
						{ label: "Art", selected: true },
						{ label: "Lifting" },
						{ label: "Hiking" },
						{ label: "Video Games" },
					],
					habits: [
						{ label: "Quiet", selected: true },
						{ label: "Tidy", selected: true },
						{ label: "Okay With Pets", selected: true },
						{ label: "Cooks Often" },
						{ label: "Early Bird" },
					],
					expandedBio:
						"Easygoing, clean, and respectful roommate. I value communication, shared spaces that stay organized, and a chill home vibe. To do for mm: nuke atharva. WOHOOOOOOOOOOOOOOOOOOOOOOOOo",
				}}
      />
    </div>
  );
}
