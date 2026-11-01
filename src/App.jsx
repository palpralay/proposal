import { useState, useRef, useMemo } from "react";
import loveGif from "./assets/love.gif";
import sadgif1 from "./assets/sad1.gif";
import sadgif2 from "./assets/sad2.gif";
import sadgif3 from "./assets/sad3.gif";
import sadgif4 from "./assets/sad4.gif";
import sadgif5 from "./assets/sad5.gif";
import sadgif6 from "./assets/sad6.gif";
import sadgif7 from "./assets/sad7.gif";
import sadgif8 from "./assets/sad8.gif";
``
const bgMusicUrl = "/music/music.mp3";

const PHONE = "";
const MY_NAME = "";

const sadGifs = [sadgif1, sadgif2, sadgif3, sadgif4, sadgif5, sadgif6, sadgif7, sadgif8];

const noPhrases = [
  "No 😐",
  "Are you sure? 🥺",
  "Really sure? 😢",
  "Think again! 😣",
  "Last chance! 😖",
  "Surely not? 😟",
  "You might regret this! 😕",
  "Give it another thought! 😞",
  "Have a heart! 🥹",
  "You're breaking my heart 💔",
];

const subLines = [
  "I promise to make it worth your time.",
  "Even just coffee? ☕",
  "I'll even pay 😇",
  "I'll bring snacks. Good ones.",
  "Look at that Yes button, it's so big now…",
  "It's getting hard to click anything else!",
  "Okay, now I'm just begging 🥲",
];

const vibes = ["Coffee ☕", "Dinner 🍝", "Movie 🎬", "Long walk 🌅"];

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

function FallingHearts({ burst }) {
  const items = useMemo(() => {
    if (!burst) return [];
    const emojis = ["💖", "💗", "💕", "💘", "🌹", "✨"];
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: Math.random() * 100,
      size: 16 + Math.random() * 26,
      dur: 2.5 + Math.random() * 3,
      delay: Math.random() * 1.5,
    }));
  }, [burst]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {items.map((h) => (
        <span
          key={h.id}
          className="absolute -top-8 animate-fall"
          style={{
            left: `${h.left}vw`,
            fontSize: h.size,
            animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

export default function Page() {
  const [step, setStep] = useState("ask"); // ask | plan | done
  const [noCount, setNoCount] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [vibe, setVibe] = useState("");
  const [date, setDate] = useState(tomorrow());
  const [time, setTime] = useState("18:00");
  const [burst, setBurst] = useState(0);
  const [waLink, setWaLink] = useState("#");
  const audioRef = useRef(null);

  const yesButtonSize = noCount * 14 + 20;

  const playMusic = () => {
    audioRef.current
      ?.play()
      .then(() => setMusicPlaying(true))
      .catch((err) => console.error("Audio play error:", err));
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      playMusic();
    }
  };

  const handleNo = () => {
    playMusic();
    setNoCount((n) => n + 1);
  };

  const handleYes = () => {
    playMusic();
    setStep("plan");
    setBurst((b) => b + 1);
  };

  const handleLockIn = () => {
    const dt = new Date(`${date}T${time}`);
    const when =
      dt.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }) +
      " at " +
      dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

    const msg = `Yes! 💖 It's a date: ${vibe} on ${when}${MY_NAME ? ` — ${MY_NAME}` : ""}`;
    const link = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

    setWaLink(link);
    setStep("done");
    setBurst((b) => b + 1);

    // Redirect to WhatsApp after the hearts have had a moment.
    setTimeout(() => window.open(link, "_blank", "noopener,noreferrer"), 1800);
  };

  const canLockIn = vibe && date && time;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-zinc-900 backdrop-blur-sm">
      <audio ref={audioRef} loop preload="auto" src={bgMusicUrl} />
      <FallingHearts burst={burst} />

      <button
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-10 bg-pink-500 hover:bg-pink-600 text-white text-4xl p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        title={musicPlaying ? "Pause music" : "Play music"}
      >
        {musicPlaying ? "🔊" : "🔇"}
      </button>

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-md">
        {/* STEP 1: ask */}
        {step === "ask" && (
          <>
            <img
              className="h-57.5 rounded-xl mb-6"
              src={sadGifs[Math.min(noCount, sadGifs.length - 1)]}
              alt="bear"
            />
            <h1 className="text-4xl font-bold mb-2 text-black/80">
              Will you go on a date with me? 💌
            </h1>
            <p className="text-black/60 mb-8 min-h-6">
              {subLines[Math.min(noCount, subLines.length - 1)]}
            </p>

            <div className="flex gap-6 items-center pt-6 flex-wrap justify-center">
              <button
                style={{ fontSize: yesButtonSize }}
                onClick={handleYes}
                className="cursor-pointer bg-transparent border-2 border-green-500 text-green-600 font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
              >
                Yes 💖
              </button>

              <button
                style={{ fontSize: Math.max(12, 22 - noCount) }}
                onClick={handleNo}
                className="cursor-pointer bg-transparent border-2 border-rose-500 text-rose-600 font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-90 active:scale-75"
              >
                {noPhrases[Math.min(noCount, noPhrases.length - 1)]}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: plan the date */}
        {step === "plan" && (
          <>
            <img className="w-60 mb-6" src={loveGif} alt="happy" />
            <h1 className="text-4xl font-extrabold text-green-600 mb-6">
              Yayyyy!!! Let's plan it 💖
            </h1>

            <div className="w-full rounded-2xl border border-pink-300 bg-white/60 p-5 backdrop-blur">
              <p className="text-black/60 mb-3">Pick a vibe</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {vibes.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVibe(v)}
                    className={`rounded-xl border-2 px-3 py-2 text-lg font-bold transition-all hover:scale-105 ${
                      vibe === v
                        ? "bg-rose-500 border-rose-500 text-white"
                        : "border-pink-300 text-black/80"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <label className="block text-left text-sm text-black/60 mb-1">Day</label>
              <input
                type="date"
                min={tomorrow()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-pink-300 bg-white/70 p-2 text-lg mb-3"
              />

              <label className="block text-left text-sm text-black/60 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-pink-300 bg-white/70 p-2 text-lg"
              />

              <button
                disabled={!canLockIn}
                onClick={handleLockIn}
                className="mt-5 w-full rounded-xl bg-rose-500 py-3 text-xl font-bold text-white transition-all hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lock it in 🔒
              </button>
            </div>
          </>
        )}

        {/* STEP 3: done + WhatsApp */}
        {step === "done" && (
          <>
            <img className="w-60 mb-6" src={loveGif} alt="happy" />
            <h1 className="text-5xl font-extrabold text-green-600 mb-3">It's a date! 💞</h1>
            <p className="text-black/70 text-xl mb-2">
              {vibe} · {new Date(`${date}T${time}`).toLocaleString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p className="text-black/60 mb-4">
              Opening WhatsApp… if nothing happens, tap below 👇
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#25d366] px-7 py-3 text-xl font-bold text-white hover:scale-105 transition-all"
            >
              Send on WhatsApp 💬
            </a>
          </>
        )}
      </div>

      <p className="absolute bottom-12 text-center text-sm text-gray-500 z-10">
        made by @Pralay
      </p>
    </div>
  );
}
