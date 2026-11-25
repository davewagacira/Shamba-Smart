import Image from "next/image";
import Link from "next/link";
import { meta } from "@/lib/meta";
import { CountUp, FloatIn, ParallaxImage, Reveal, Stagger, StaggerItem, ZoomImage } from "@/components/motion";
import { PHOTOS } from "@/lib/photos";
import { SectionLink } from "@/components/SectionLink";

const correct = Math.round(meta.crop.metrics.test_accuracy * 440);

const proof = [
  { value: "2,200", label: "field soil and climate samples" },
  { value: "13,130", label: "national harvest records" },
  { value: `${meta.yield.countries.length}`, label: "countries, Kenya included" },
  { value: "24 yrs", label: "of FAO harvest history" },
];

const steps = [
  { title: "Tell us about your shamba", text: "Enter your soil test and local climate, or choose your country and crop." },
  { title: "We compare it with real farms", text: "Our models check your field against thousands of real fields and harvests." },
  { title: "Plan with confidence", text: "See the best crops, what to fix in your soil, and the harvest to expect." },
];

const audiences = [
  { photo: PHOTOS.farmer, title: "Farmers", text: "Decide what to plant before buying seed, and know roughly how many bags to expect." },
  { photo: PHOTOS.team, title: "Extension officers", text: "Give fast, consistent advice in the field from a soil test and a phone." },
  { photo: PHOTOS.pair, title: "Co-ops and agri-lenders", text: "Estimate expected harvests when planning input loans and collections." },
];

const faqs = [
  { q: "Is ShambaSmart free?", a: "Yes. Both tools are free to use, with no sign-up." },
  { q: "Do I need a soil test?", a: "For the Crop Advisor, a basic soil test (N, P, K and pH) gives the best results. You can also start from a typical field and adjust it. The Yield Forecast only needs your country and crop." },
  { q: "Where does the data come from?", a: "Crop recommendations learn from 2,200 field measurements across 22 crops. Harvest forecasts learn from 24 years of national harvest records compiled from FAO and World Bank data." },
  { q: "How accurate is it?", a: `In testing on data held back from training, the Crop Advisor matched ${correct} of 440 fields to the right crop, and harvest forecasts were typically within ±${meta.yield.metrics.MAE.toFixed(1)} tonnes per hectare.` },
  { q: "Can it forecast my exact farm?", a: "Not yet. Harvest forecasts describe a typical yield for a country under the conditions you set. County and farm-level data is on our roadmap." },
  { q: "Can I build ShambaSmart into my own app?", a: "Yes. Our public API returns crop recommendations and harvest forecasts as JSON. See the Developers page." },
];

const Check = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 flex-none" fill="currentColor" aria-hidden>
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

// example result shown in the hero, taken from a real Crop Advisor run
function HeroPreview() {
  const rows = [
    ["Nitrogen", "76", "Ideal"],
    ["Rainfall", "84 mm", "Ideal"],
    ["Soil pH", "4.5", "Low"],
  ];
  return (
    <FloatIn className="relative mx-auto w-full max-w-sm">
      <div className="rounded-3xl bg-white/95 p-5 shadow-2xl ring-1 ring-black/5 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-leaf-600">Crop Advisor</p>
          <span className="rounded-full bg-leaf-50 px-2 py-0.5 text-[11px] text-leaf-700">Example result</span>
        </div>
        <div className="mt-3 rounded-2xl bg-leaf-800 p-4 text-white">
          <p className="text-xs text-leaf-200">Best crop for this field</p>
          <p className="mt-0.5 text-2xl font-semibold">Maize</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[98%] rounded-full bg-sun-400" />
          </div>
          <p className="mt-1.5 text-xs text-leaf-100">98% confidence</p>
        </div>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {rows.map(([f, v, s]) => (
              <tr key={f} className="border-t border-leaf-50">
                <td className="py-1.5 text-leaf-900/70">{f}</td>
                <td className="tabular-nums text-leaf-900">{v}</td>
                <td className="text-right">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${s === "Ideal" ? "bg-leaf-100 text-leaf-800" : "bg-soil-100 text-soil-700"}`}>{s}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 rounded-xl bg-soil-100 px-3 py-2 text-xs text-soil-700">Soil is too acidic: apply agricultural lime.</p>
      </div>
      <div className="absolute -left-10 -top-8 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 lg:block">
        <p className="text-xs text-leaf-900/60">Expected maize harvest, Kenya</p>
        <p className="mt-0.5 text-xl font-semibold text-leaf-900">7.7 <span className="text-sm font-normal text-leaf-900/60">bags / acre</span></p>
      </div>
    </FloatIn>
  );
}

function Feature({ id, photo, eyebrow, title, text, points, href, cta, reverse, overlay }: {
  id?: string;
  photo: { src: string; alt: string };
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  href: string;
  cta: string;
  reverse?: boolean;
  overlay: React.ReactNode;
}) {
  return (
    <section id={id} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={`relative ${reverse ? "lg:order-2" : ""}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <ZoomImage src={photo.src} alt={photo.alt} sizes="(min-width: 1024px) 560px, 100vw" />
        </div>
        <div className={`absolute -bottom-6 ${reverse ? "-left-2 sm:-left-6" : "-right-2 sm:-right-6"}`}>{overlay}</div>
      </div>
      <Reveal className="pt-4 lg:pt-0">
        <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-leaf-900 sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-leaf-900/70">{text}</p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-leaf-900/80">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-leaf-100 text-leaf-700"><Check /></span>
              {p}
            </li>
          ))}
        </ul>
        <Link href={href} className="mt-8 inline-flex rounded-full bg-leaf-700 px-6 py-3 font-medium text-white hover:bg-leaf-800">
          {cta}
        </Link>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <div className="pb-16">
      {/* full-bleed hero */}
      <section id="hero" className="relative overflow-hidden">
        <ParallaxImage src={PHOTOS.hero.src} alt={PHOTOS.hero.alt} />
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-900/90 via-leaf-900/65 to-leaf-900/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-leaf-900/50 to-transparent lg:hidden" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-32 sm:pb-24 sm:pt-36 lg:grid-cols-[1.15fr_1fr] lg:pb-28 lg:pt-40">
          <Stagger onMount gap={0.12} className="text-white">
            <StaggerItem>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-leaf-100 ring-1 ring-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-sun-400" /> Smart planning for Kenyan agriculture
            </p>
            </StaggerItem>
            <StaggerItem>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Plant the right crop.
              <br />
              <span className="text-sun-400">Know your harvest.</span>
            </h1>
            </StaggerItem>
            <StaggerItem>
            <p className="mt-6 max-w-xl text-lg text-leaf-100/90">
              ShambaSmart turns a soil test and your local climate into the crops most likely to thrive, and forecasts
              the harvest you can expect, in kilograms and 90 kg bags per acre.
            </p>
            </StaggerItem>
            <StaggerItem className="mt-8 flex flex-wrap gap-3">
              <Link href="/start" className="rounded-full bg-sun-400 px-6 py-3 font-semibold text-leaf-900 shadow-lg hover:brightness-95">
                Get started free
              </Link>
              <SectionLink id="how-it-works" className="rounded-full px-6 py-3 font-medium text-white ring-1 ring-white/40 hover:bg-white/10">
                See how it works
              </SectionLink>
            </StaggerItem>
            <StaggerItem>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-leaf-100/85">
              {["No sign-up needed", "Results in seconds", "Works on any phone"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="text-sun-400"><Check /></span>{t}</li>
              ))}
            </ul>
            </StaggerItem>
          </Stagger>
          <HeroPreview />
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-24 px-5 pt-16">
      {/* proof strip */}
      <Reveal>
        <p className="text-center text-sm font-medium text-leaf-900/60">Built on open agricultural data from the FAO and World Bank</p>
        <div className="mt-6 grid grid-cols-2 gap-y-6 rounded-3xl border border-leaf-100 bg-white px-6 py-8 shadow-sm md:grid-cols-4">
          {proof.map((p) => (
            <div key={p.label} className="text-center">
              <CountUp value={p.value} className="block text-3xl font-semibold text-leaf-700 tabular-nums" />
              <p className="mt-1 text-sm text-leaf-900/60">{p.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Feature
        id="features"
        photo={PHOTOS.seedling}
        eyebrow="Crop Advisor"
        title="Know what your land wants to grow"
        text="Enter your soil nutrients, pH and local climate. ShambaSmart ranks 22 crops by how well they suit your field and shows exactly what to improve."
        points={[
          "Top crops with a clear confidence score",
          "Your soil compared with each crop's ideal range",
          "Practical next steps, such as when to lime or add nitrogen",
        ]}
        href="/crop-advisor"
        cta="Open Crop Advisor"
        overlay={
          <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5">
            <p className="text-xs text-leaf-900/60">Best crop</p>
            <p className="text-lg font-semibold text-leaf-900">Coffee <span className="text-sm font-normal text-leaf-900/60">· 100%</span></p>
          </div>
        }
      />

      <Feature
        reverse
        photo={PHOTOS.grain}
        eyebrow="Yield Forecast"
        title="See your harvest before you plant"
        text="Choose your country and crop to see the expected harvest per hectare, per acre and in 90 kg bags. Adjust the conditions and the forecast updates instantly."
        points={[
          "Forecasts in the units farmers use: kg and bags per acre",
          "Compare all crops side by side for your country",
          "Kenya's real harvest history for context",
        ]}
        href="/yield-forecast"
        cta="Open Yield Forecast"
        overlay={
          <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5">
            <p className="text-xs text-leaf-900/60">Potatoes vs maize, Kenya</p>
            <p className="text-lg font-semibold text-leaf-900">17.8 <span className="text-sm font-normal text-leaf-900/60">vs</span> 1.7 t/ha</p>
          </div>
        }
      />

      <section id="how-it-works" className="scroll-mt-24">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-leaf-900 sm:text-4xl">From soil test to planting plan in three steps</h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <StaggerItem key={s.title} className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sun-400 font-semibold text-leaf-900">{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold text-leaf-900">{s.title}</h3>
              <p className="mt-1 text-leaf-900/70">{s.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="who-its-for" className="scroll-mt-24">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">Who it is for</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-leaf-900 sm:text-4xl">Made for the people who feed Kenya</h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
          {audiences.map((a) => (
            <StaggerItem key={a.title} className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image src={a.photo.src} alt={a.photo.alt} fill sizes="(min-width: 768px) 360px, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-leaf-900/95 via-leaf-900/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-xl font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-leaf-100/90">{a.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal>
      <section id="accuracy" className="grid scroll-mt-24 gap-10 rounded-3xl bg-leaf-900 px-6 py-12 text-white sm:px-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-sun-400">Proven accuracy</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Tested on fields and seasons it had never seen</h2>
          <p className="mt-4 text-leaf-100/80">We held back data during training, then checked every answer against what really happened.</p>
          <Link href="/how-it-works" className="mt-6 inline-block font-medium text-sun-400 hover:underline">See the full methodology →</Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [`${correct}/440`, "test fields matched to the right crop"],
            [`±${meta.yield.metrics.MAE.toFixed(1)}`, "t/ha typical harvest margin"],
            [`${Math.round(meta.yield.metrics.deployed["Test R2"] * 100)}%`, "of harvest differences explained"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
              <p className="whitespace-nowrap text-xl font-semibold sm:text-3xl">{v}</p>
              <p className="mt-1 text-xs text-leaf-100/75 sm:text-sm">{l}</p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section id="faq" className="grid scroll-mt-24 gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-leaf-600">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-leaf-900 sm:text-4xl">Questions farmers ask</h2>
          <p className="mt-3 text-leaf-900/70">
            Building something? See the <Link href="/developers" className="text-leaf-700 underline">developer API</Link>.
          </p>
        </div>
        <div className="divide-y divide-leaf-100 rounded-3xl border border-leaf-100 bg-white px-6 shadow-sm">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-leaf-900">
                {f.q}
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-leaf-50 text-leaf-700 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-leaf-900/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="relative overflow-hidden rounded-3xl">
        <Image src={PHOTOS.hero.src} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-leaf-900/85" />
        <div className="relative px-6 py-14 text-center text-white sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to plan your next season?</h2>
          <p className="mx-auto mt-3 max-w-xl text-leaf-100/85">Get a crop recommendation or a harvest forecast in under a minute.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/start" className="rounded-full bg-sun-400 px-6 py-3 font-semibold text-leaf-900 hover:brightness-95">Get started free</Link>
            <Link href="/how-it-works" className="rounded-full px-6 py-3 font-medium text-white ring-1 ring-white/40 hover:bg-white/10">Learn more</Link>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-leaf-100/80">
            {["Free to use", "No sign-up", "Built on FAO data"].map((t) => (
              <li key={t} className="flex items-center gap-2"><span className="text-sun-400"><Check /></span>{t}</li>
            ))}
          </ul>
        </div>
      </section>
      </Reveal>
      </div>
    </div>
  );
}
