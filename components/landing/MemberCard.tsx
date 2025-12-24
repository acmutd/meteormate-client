"use client";
import Image from "next/image";

export interface TeamMember {
	id: number;
	name: string;
	gradYear: string;
	major: string;
	role: string;
	imageSrc: string;
	isLead: boolean;
}

interface MemberCardProps {
	member: TeamMember;
}

const getRoleColor = (role: string) => {
	const roleLower = role.toLowerCase();
	if (roleLower.includes("ui/ux") || roleLower.includes("ux")) {
		return "bg-gradient-to-r from-purple-500 to-pink-500";
	} else if (roleLower.includes("frontend")) {
		return "bg-gradient-to-r from-blue-500 to-cyan-500";
	} else if (roleLower.includes("backend")) {
		return "bg-gradient-to-r from-green-500 to-emerald-500";
	} else if (roleLower.includes("full-stack") || roleLower.includes("fullstack")) {
		return "bg-gradient-to-r from-orange-500 to-yellow-500";
	}
	return "bg-gradient-to-r from-gray-500 to-gray-600";
};

export default function MemberCard({ member }: MemberCardProps) {
	return (
		<div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden w-64 h-96 flex flex-col">
			<div className="relative w-full h-64 flex-shrink-0 overflow-hidden">
				<Image
					src={member.imageSrc}
					alt={member.name}
					fill
					className="object-cover"
				/>
				<div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
			</div>
			
			<div className="relative px-4 py-4 flex-1 flex flex-col min-h-0 overflow-hidden">
				<div className="flex flex-col gap-1.5 min-w-0">
					{member.isLead && (
						<span className="inline-block bg-gradient-to-r from-orange-400 to-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full w-fit outfit-bold flex-shrink-0">
							LEAD
						</span>
					)}
					<h2 className="text-lg font-bold text-white truncate outfit-bold">{member.name}</h2>
					{!member.isLead && (
						<div className="min-w-0">
							<span className={`inline-block ${getRoleColor(member.role)} text-white text-xs font-bold px-3 py-1 rounded-full outfit-bold truncate block`}>
								{member.role}
							</span>
						</div>
					)}
					<p className="text-white/60 text-xs truncate outfit-regular">{member.major}</p>
					<p className="text-white/50 text-xs outfit-regular">Class of {member.gradYear}</p>
				</div>
			</div>
		</div>
	);
}

