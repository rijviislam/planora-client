import Categories from "@/components/Categories";
import CTA from "@/components/CTA";
import EventsSlider from "@/components/EventsSlider";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getFeaturedEvent() {
  try {
    const res = await fetch(`${API_URL}/events/featured`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

async function getUpcomingEvents() {
  try {
    const res = await fetch(`${API_URL}/events?limit=9`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, events] = await Promise.all([
    getFeaturedEvent(),
    getUpcomingEvents(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero event={featured} />
        <EventsSlider events={events} />
        <Categories />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
