"use client";
import ProfileCard from "@/components/cardComponent/ProfileCard";
import confetti from "canvas-confetti";
import { useCallback, useRef, useState } from "react";
import { ItsAMatchOverlay } from "@/components/itsAMatch";

export default function Discover() {
  const [showMatch, setShowMatch] = useState(false);
	const hideTimer = useRef<number | null>(null);

	const fireMatch = useCallback(() => {
    // A quick "for ~900ms keep firing" effect
    const duration = 900;
    const end = Date.now() + duration;

    // helper: random in range
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    // Start match UI first (so overlay is visible immediately)
    setShowMatch(true);

    (function frame() {
      confetti({
        particleCount: 15,
        spread: 100,
        startVelocity: 20,
        scalar: 1.05,
        origin: { x: rand(0.05, 0.2), y: rand(0.2, 0.8) },
      });

      confetti({
        particleCount: 15,
        spread: 100,
        startVelocity: 20,
        scalar: 1.05,
        origin: { x: rand(0.8, 0.95), y: rand(0.2, 0.8) },
      });

      confetti({
        particleCount: 15,
        spread: 100,
        startVelocity: 20,
        scalar: 1.0,
        origin: { x: rand(0.2, 0.8), y: rand(0.05, 0.25) },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // if (hideTimer.current) window.clearTimeout(hideTimer.current);
    // hideTimer.current = window.setTimeout(() => {
    //   setShowMatch(false);
    // }, 2200);
  }, []);

  return (
    <div className="relative">
      <ItsAMatchOverlay
        open={showMatch}
        onClose={() => setShowMatch(false)}
        onConfirm={() => setShowMatch(false)}
        leftImg="/p2.png"
        rightImg="/p3.jpg"
        rightName="Usagi"
      />
    
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
          onLike={() => {
						console.log("like");
						fireMatch();
					}}
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
    </div>
  );
}
