"use client";
import LandingSection from "./LandingSection";
import MemberCard, { TeamMember } from "./MemberCard";

export default function MeetTheTeam() {
	const teamLeads: TeamMember[] = [
		{
			id: 1,
			name: "[NAME HERE]",
			gradYear: "[CLASS OF X]",
			major: "[MAJOR HERE]",
			role: "[ROLE HERE]",
			imageSrc: "/images/hero_section_background.png",
			isLead: true,
		},
		{
			id: 2,
			name: "[NAME HERE]",
			gradYear: "[CLASS OF X]",
			major: "[MAJOR HERE]",
			role: "[ROLE HERE]",
			imageSrc: "/images/hero_section_background.png",
			isLead: true,
		},
	];

	const teamDevelopers: TeamMember[] = [
		{
			id: 3,
			name: "[NAME HERE]",
			gradYear: "[CLASS OF X]",
			major: "[MAJOR HERE]",
			role: "[ROLE HERE]",
			imageSrc: "/images/hero_section_background.png",
			isLead: false,
		},
		{
			id: 4,
			name: "[NAME HERE]",
			gradYear: "[CLASS OF X]",
			major: "[MAJOR HERE]",
			role: "[ROLE HERE]",
			imageSrc: "/images/hero_section_background.png",
			isLead: false,
		},
		{
			id: 5,
			name: "[NAME HERE]",
			gradYear: "[CLASS OF X]",
			major: "[MAJOR HERE]",
			role: "[ROLE HERE]",
			imageSrc: "/images/hero_section_background.png",
			isLead: false,
		},
		{
			id: 6,
			name: "[NAME HERE]",
			gradYear: "[CLASS OF X]",
			major: "[MAJOR HERE]",
			role: "[ROLE HERE]",
			imageSrc: "/images/hero_section_background.png",
			isLead: false,
		},
		{
			id: 7,
			name: "[NAME HERE]",
			gradYear: "[CLASS OF X]",
			major: "[MAJOR HERE]",
			role: "[ROLE HERE]",
			imageSrc: "/images/hero_section_background.png",
			isLead: false,
		},
		{
			id: 8,
			name: "[NAME HERE]",
			gradYear: "[CLASS OF X]",
			major: "[MAJOR HERE]",
			role: "[ROLE HERE]",
			imageSrc: "/images/hero_section_background.png",
			isLead: false,
		},
	];

	return (
		<LandingSection
			id="meetTheTeam"
			className="w-screen min-h-screen bg-black flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: `url('/images/stars.png')` }}
		>
			<div className="max-w-7xl mx-auto px-4">
				<div className="text-center mb-12">
					<h1 className="text-white text-[60px] font-extrabold outfit-bold mb-3">
						Meet the Team
					</h1>
					<p className="text-white/80 outfit-regular text-[20px]">
						The passionate individuals building MeteorMate
					</p>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-bold text-center text-white/90 mb-6 outfit-bold">
						Project Managers
					</h2>
					<div className="flex flex-wrap justify-center gap-6">
						{teamLeads.map((member) => (
							<MemberCard key={member.id} member={member} />
						))}
					</div>
				</div>

				<div>
					<h2 className="text-2xl font-bold text-center text-white/90 mb-6 outfit-bold">
						Development Team
					</h2>
					<div className="flex flex-wrap justify-center gap-6">
						{teamDevelopers.map((member) => (
							<MemberCard key={member.id} member={member} />
						))}
					</div>
				</div>
			</div>
		</LandingSection>
	);
}

