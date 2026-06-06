"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shield, Lock, Trash2, Eye, Database, UserCheck } from "lucide-react";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10 py-4">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
            <div
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => router.push("/")}
            >
                <Image
                    src="/MM_logo_V2.svg"
                    alt="MeteorMate Logo"
                    width={56}
                    height={56}
                    className="w-10 h-10 md:w-14 md:h-14 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="flex flex-col leading-tight">
                    <h1 className="font-pavanam font-bold md:text-2xl text-lg tracking-tight bg-gradient-to-r from-primary via-yellow-400 to-secondary bg-clip-text text-transparent drop-shadow-lg">
                        MeteorMate
                    </h1>
                    <span
                        className="text-[10px] md:text-xs font-pavanam font-medium text-white/70 uppercase tracking-widest">
							Powered by ACM Dev
						</span>
                </div>
            </div>
            <button
                onClick={() => router.push("/")}
                className="text-white/70 hover:text-white transition-colors text-sm md:text-base cursor-pointer"
            >
                Back to Home
            </button>
        </div>
      </header>

        {/* Main Content */}
        <main className="pt-32 pb-20 px-6 md:px-10">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Your Privacy Matters
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              We&apos;re committed to protecting your data and giving you control over your information. Here&apos;s how we keep your profile safe.
            </p>
          </div>

          {/* Privacy Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Encryption */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">End-to-End Encryption</h2>
              </div>
              <p className="text-white/70 leading-relaxed">
                All your data is encrypted both in transit and at rest using industry-standard protocols. Your messages, profile details, and matches are secured with the same encryption used by major tech companies.
              </p>
            </div>

            {/* Data Retention */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Automatic Deletion</h2>
              </div>
              <p className="text-white/70 leading-relaxed">
                Your data is automatically deleted after 2 years of inactivity. You can also delete your account at any time, and all your information will be permanently removed within 30 days.
              </p>
            </div>

            {/* No PII Logging */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Minimal Logging</h2>
              </div>
              <p className="text-white/70 leading-relaxed">
                We don&apos;t log personally identifiable information (PII) in our system logs. Our analytics are anonymized and aggregated to improve the platform without tracking individuals.
              </p>
            </div>

            {/* Your Control */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">You&apos;re In Control</h2>
              </div>
              <p className="text-white/70 leading-relaxed">
                Choose what information appears on your profile. Control who can see your social media links, contact details, and lifestyle preferences. You decide what to share.
              </p>
            </div>
          </div>

          {/* Data Practices Section */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 md:p-12 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Database className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Our Data Practices</h2>
            </div>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                <strong className="text-white">What we collect:</strong> We only collect information necessary to help you find compatible roommates - your name, email, preferences, and optional social media links for verification.
              </p>
              <p>
                <strong className="text-white">How we use it:</strong> Your data powers our matching algorithm and helps you connect with potential roommates. We never sell your information to third parties or use it for advertising.
              </p>
              <p>
                <strong className="text-white">Who can see it:</strong> Only verified UTD students using MeteorMate can see your profile, and only the information you choose to share. Your email and verification details remain private.
              </p>
              <p>
                <strong className="text-white">Security measures:</strong> We employ industry-standard security practices including encrypted databases, secure authentication, regular security audits, and limited employee access to user data.
              </p>
            </div>
          </div>

          {/* UTD Specific */}
          <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Built for UTD Students</h2>
            <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
              MeteorMate is designed exclusively for the UT Dallas community. We verify all users through UTD email addresses to ensure a safe, authentic environment. Your data stays within our secure platform and is never shared with the university or external organizations.
            </p>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-white/50">
            <p>Last updated: January 2026</p>
            <p className="mt-2">
              Questions about privacy? Email us at{" "}
              <a
                href="mailto:info@meteormate.com"
                className="text-primary hover:text-primary-hover transition-colors"
              >
                info@meteormate.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Background Effect */}
      <div
        className="fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `url('/stars.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
}