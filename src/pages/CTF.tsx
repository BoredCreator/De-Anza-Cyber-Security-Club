import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  Code,
  ChevronDown,
  Discord,
  Star,
  ChevronRight,
} from "@/lib/cyberIcon";

function CTF() {
  const [loaded, setLoaded] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const schedule = [
    {
      time: "9:00 AM",
      event: "Registration & Check-in",
      description: "Grab your badge and meet the team",
    },
    {
      time: "10:00 AM",
      event: "Opening Ceremony",
      description: "Welcome and CTF overview",
    },
    { time: "10:30 AM", event: "CTF Begins", description: "Start hacking!" },
    {
      time: "12:30 PM",
      event: "Lunch Break",
      description: "Fuel up for more challenges",
    },
    {
      time: "1:30 PM",
      event: "Resume Competition",
      description: "Continue solving challenges",
    },
    { time: "4:00 PM", event: "CTF Ends", description: "Final submissions" },
    {
      time: "4:30 PM",
      event: "Awards Ceremony",
      description: "Winner announcements and prizes",
    },
  ];

  const faqs = [
    {
      question: "What is a CTF?",
      answer:
        'Capture The Flag (CTF) is a cybersecurity competition where participants solve security challenges to find "flags" - secret strings hidden in vulnerable systems. Our CTF features 31 challenges across web exploitation, cryptography, reverse engineering, forensics, binary exploitation, and miscellaneous categories.',
    },
    {
      question: "Do I need experience?",
      answer:
        "No! We welcome all skill levels. With 10 easy challenges designed for beginners, plus mentors on-site to help you learn, this is a great entry point into cybersecurity competitions.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring your laptop, charger, and enthusiasm! We recommend having a virtual machine with Kali Linux or similar security tools installed. We'll also provide setup guides before the event.",
    },
    {
      question: "Can I work in a team?",
      answer:
        "Yes! You can compete solo or in teams of up to 4 people. Teamwork is encouraged, especially for beginners. Find teammates on our Discord!",
    },
    {
      question: "How are challenges structured?",
      answer:
        "We have 31 total challenges: 10 Easy (perfect for beginners), 10 Medium (test your skills), 10 Hard (for experienced players), and 1 legendary Beast challenge that will push even the best to their limits.",
    },
    {
      question: "What are the prizes?",
      answer:
        "Over $500 in prizes! 1st place wins the grand prize, with awards for 2nd and 3rd place teams. There may also be special category awards. Full details announced closer to the event.",
    },
  ];

  return (
    <div className="min-h-screen bg-terminal-bg text-matrix">
      <div className="crt-overlay" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section
          className={`min-h-[80vh] flex items-center justify-center transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-matrix/20 border border-matrix/50 text-matrix text-sm font-terminal mb-4">
                31 CHALLENGES AVAILABLE
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">DACC</span>
              <br />
              <span className="glitch neon-text" data-text="CAPTURE THE FLAG">
                CAPTURE THE FLAG
              </span>
            </h1>

            <p className="text-gray-400 text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
              A cybersecurity competition for hackers of all skill levels
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 mb-10">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-matrix" />
                <span className="font-terminal">TBA 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-matrix" />
                <span className="font-terminal">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-matrix" />
                <span className="font-terminal">De Anza College</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/ctf/challenges"
                className="btn-hack-filled rounded-lg px-8 py-4 text-lg flex items-center gap-3"
              >
                <Code className="w-5 h-5" />
                Start Hacking
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/ctf/team"
                className="btn-hack rounded-lg px-8 py-4 text-lg flex items-center gap-3"
              >
                <Users className="w-5 h-5" />
                My Team
              </Link>
              <Link
                to="/ctf/leaderboard"
                className="btn-hack rounded-lg px-8 py-4 text-lg flex items-center gap-3"
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          className={`py-20 transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="card-hack rounded-lg p-6 text-center group hover:border-matrix/50 transition-all">
                <Trophy className="w-10 h-10 text-matrix mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-matrix mb-2">$500+</div>
                <div className="text-sm text-gray-500 font-terminal">
                  IN PRIZES
                </div>
              </div>
              <div className="card-hack rounded-lg p-6 text-center group hover:border-matrix/50 transition-all">
                <Users className="w-10 h-10 text-matrix mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-matrix mb-2">100+</div>
                <div className="text-sm text-gray-500 font-terminal">
                  PARTICIPANTS
                </div>
              </div>
              <div className="card-hack rounded-lg p-6 text-center group hover:border-matrix/50 transition-all">
                <Code className="w-10 h-10 text-matrix mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-matrix mb-2">31</div>
                <div className="text-sm text-gray-500 font-terminal">
                  CHALLENGES
                </div>
              </div>
              <div className="card-hack rounded-lg p-6 text-center group hover:border-matrix/50 transition-all">
                <Clock className="w-10 h-10 text-matrix mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-matrix mb-2">6</div>
                <div className="text-sm text-gray-500 font-terminal">HOURS</div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Breakdown Section */}
        <section
          className={`pb-20 transition-all duration-700 delay-150 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="text-matrix neon-text-subtle">
                31 Challenges Await
              </span>
            </h2>
            <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              From beginner-friendly puzzles to mind-bending exploits, there's
              something for every skill level.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative overflow-hidden rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent p-6 text-center group hover:border-green-500/60 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />
                <div className="relative">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    10
                  </div>
                  <div className="text-sm font-terminal text-green-400/80 uppercase tracking-wider mb-2">
                    Easy
                  </div>
                  <div className="text-xs text-gray-500">
                    Perfect for beginners
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent p-6 text-center group hover:border-yellow-500/60 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all" />
                <div className="relative">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    10
                  </div>
                  <div className="text-sm font-terminal text-yellow-400/80 uppercase tracking-wider mb-2">
                    Medium
                  </div>
                  <div className="text-xs text-gray-500">Test your skills</div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent p-6 text-center group hover:border-red-500/60 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
                <div className="relative">
                  <div className="text-4xl font-bold text-red-400 mb-2">10</div>
                  <div className="text-sm font-terminal text-red-400/80 uppercase tracking-wider mb-2">
                    Hard
                  </div>
                  <div className="text-xs text-gray-500">
                    For the experienced
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent p-6 text-center group hover:border-purple-500/60 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    <span className="text-4xl font-bold text-purple-400">
                      1
                    </span>
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-sm font-terminal text-purple-400/80 uppercase tracking-wider mb-2">
                    Beast
                  </div>
                  <div className="text-xs text-gray-500">Only for legends</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          className={`py-20 transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-matrix neon-text-subtle text-lg">$</span>
              <span className="text-gray-400 font-terminal">
                ls ./challenge_categories/
              </span>
            </div>
            <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Our CTF features challenges across 6 categories, testing
              everything from web security to binary exploitation.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="terminal-window group hover:scale-[1.02] transition-transform">
                <div className="terminal-header">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="ml-4 text-xs text-gray-500 font-terminal">
                    web_exploitation
                  </span>
                </div>
                <div className="terminal-body">
                  <h3 className="text-matrix font-bold mb-2 group-hover:neon-text-subtle transition-all">
                    Web Exploitation
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Find vulnerabilities in web applications through SQL
                    injection, XSS, SSRF, and more.
                  </p>
                </div>
              </div>

              <div className="terminal-window group hover:scale-[1.02] transition-transform">
                <div className="terminal-header">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="ml-4 text-xs text-gray-500 font-terminal">
                    cryptography
                  </span>
                </div>
                <div className="terminal-body">
                  <h3 className="text-matrix font-bold mb-2 group-hover:neon-text-subtle transition-all">
                    Cryptography
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Break ciphers, decrypt messages, and exploit weak
                    cryptographic implementations.
                  </p>
                </div>
              </div>

              <div className="terminal-window group hover:scale-[1.02] transition-transform">
                <div className="terminal-header">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="ml-4 text-xs text-gray-500 font-terminal">
                    reverse_engineering
                  </span>
                </div>
                <div className="terminal-body">
                  <h3 className="text-matrix font-bold mb-2 group-hover:neon-text-subtle transition-all">
                    Reverse Engineering
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Analyze binaries, decompile programs, and uncover hidden
                    functionality.
                  </p>
                </div>
              </div>

              <div className="terminal-window group hover:scale-[1.02] transition-transform">
                <div className="terminal-header">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="ml-4 text-xs text-gray-500 font-terminal">
                    forensics
                  </span>
                </div>
                <div className="terminal-body">
                  <h3 className="text-matrix font-bold mb-2 group-hover:neon-text-subtle transition-all">
                    Forensics
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Investigate digital artifacts, recover hidden data, and
                    analyze file systems.
                  </p>
                </div>
              </div>

              <div className="terminal-window group hover:scale-[1.02] transition-transform">
                <div className="terminal-header">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="ml-4 text-xs text-gray-500 font-terminal">
                    pwn
                  </span>
                </div>
                <div className="terminal-body">
                  <h3 className="text-matrix font-bold mb-2 group-hover:neon-text-subtle transition-all">
                    Binary Exploitation
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Exploit buffer overflows, format strings, and other memory
                    corruption bugs.
                  </p>
                </div>
              </div>

              <div className="terminal-window group hover:scale-[1.02] transition-transform">
                <div className="terminal-header">
                  <div className="terminal-dot red" />
                  <div className="terminal-dot yellow" />
                  <div className="terminal-dot green" />
                  <span className="ml-4 text-xs text-gray-500 font-terminal">
                    misc
                  </span>
                </div>
                <div className="terminal-body">
                  <h3 className="text-matrix font-bold mb-2 group-hover:neon-text-subtle transition-all">
                    Miscellaneous
                  </h3>
                  <p className="text-gray-500 text-sm">
                    OSINT, scripting, networking, and other creative security
                    challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section
          className={`py-20 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className="text-matrix neon-text-subtle text-lg">$</span>
              <span className="text-gray-400 font-terminal">
                cat ./schedule.txt
              </span>
            </div>

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red" />
                <div className="terminal-dot yellow" />
                <div className="terminal-dot green" />
                <span className="ml-4 text-xs text-gray-500 font-terminal">
                  event_timeline.sh
                </span>
              </div>
              <div className="terminal-body">
                <div className="space-y-6">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex gap-6 items-start">
                      <div className="shrink-0 w-24 text-right">
                        <span className="text-matrix font-terminal text-sm">
                          {item.time}
                        </span>
                      </div>
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-3 h-3 rounded-full bg-matrix shadow-neon" />
                        {index < schedule.length - 1 && (
                          <div className="h-full min-h-[60px] border-l-2 border-dotted border-gray-700" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <h3 className="text-white font-semibold mb-1">
                          {item.event}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          className={`py-20 transition-all duration-700 delay-400 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className="text-matrix neon-text-subtle text-lg">$</span>
              <span className="text-gray-400 font-terminal">
                cat /ctf/faq.md
              </span>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="card-hack rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between hover:bg-matrix/5 transition-colors"
                  >
                    <span className="text-matrix font-semibold pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-matrix shrink-0 transition-transform duration-200 ${
                        openFAQ === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      openFAQ === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <div className="px-5 pb-5">
                      <p className="text-gray-400 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`py-20 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot red" />
                <div className="terminal-dot yellow" />
                <div className="terminal-dot green" />
                <span className="ml-4 text-xs text-gray-500 font-terminal">
                  register.sh
                </span>
              </div>
              <div className="terminal-body text-center py-12">
                <Trophy className="w-16 h-16 text-matrix mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl font-bold text-matrix mb-4 neon-text-subtle">
                  Ready to Compete?
                </h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Test your skills with 31 challenges across 6 categories. From
                  beginner-friendly puzzles to the legendary Beast challenge!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/ctf/challenges"
                    className="btn-hack-filled rounded-lg px-8 py-4 flex items-center gap-3"
                  >
                    <Code className="w-5 h-5" />
                    View All Challenges
                  </Link>
                  <a
                    href="https://discord.gg/v5JWDrZVNp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hack rounded-lg px-8 py-4 flex items-center gap-3"
                  >
                    <Discord className="w-5 h-5" />
                    Join Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CTF;
