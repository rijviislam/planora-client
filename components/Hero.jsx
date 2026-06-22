"use client";

import { useAuth } from "@/lib/useAuth";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Link from "next/link";

const Z_DISTANCE = 250;

function carouselPlugin(slider) {
  function rotate() {
    const deg = 360 * slider.track.details.progress;
    slider.container.style.transform = `translateZ(-${Z_DISTANCE}px) rotateY(${-deg}deg)`;
  }

  slider.on("created", () => {
    const deg = 360 / slider.slides.length;
    slider.slides.forEach((el, idx) => {
      el.style.transform = `rotateY(${deg * idx}deg) translateZ(${Z_DISTANCE}px)`;
    });
    rotate();
  });

  slider.on("detailsChanged", rotate);
}

function autoplayPlugin(slider) {
  let timeout;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);

    if (mouseOver) return;

    timeout = setTimeout(() => {
      slider.next();
    }, 2000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });

    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });

    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

export default function Hero({ events = [] }) {
  const { user } = useAuth();
  const hostHref = user ? "/dashboard/my-events" : "/signup";

  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      selector: ".carousel__cell",
      renderMode: "custom",
      mode: "snap",
      drag: true,
      defaultAnimation: {
        duration: 2500,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      },
    },
    events.length > 1 ? [carouselPlugin, autoplayPlugin] : [],
  );
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="stamp text-xs font-medium text-coral">Now boarding</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
            Plan it.
            <br />
            <span className="italic text-coral">Stamp it.</span>
            <br />
            Show up.
          </h1>
          <p className="mt-6 max-w-md text-base text-ink-soft md:text-lg">
            Planora is where hosts issue admission and guests collect it —
            public or private, free or paid, every event gets a ticket worth
            keeping.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-coral"
            >
              Browse events
            </Link>
            <Link
              href={hostHref}
              className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
            >
              Host your own
            </Link>
          </div>
        </div>

        <div>
          {events.length === 0 ? (
            <div className="ticket flex h-64 items-center justify-center p-8 text-center">
              <p className="text-sm text-ink-soft">
                No featured event yet — check back soon.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 420,
                  height: 200,
                  perspective: 1000,
                  position: "relative",
                }}
              >
                <div
                  ref={sliderRef}
                  className="carousel keen-slider"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    overflow: "visible",
                    transformStyle: "preserve-3d",
                    transform: `translateZ(-${Z_DISTANCE}px)`,
                  }}
                >
                  {events.map((event) => {
                    const date = new Date(event.date);
                    return (
                      <div
                        key={event.id}
                        className="carousel__cell ticket flex"
                        style={{
                          position: "absolute",
                          width: 400,
                          left: 10,
                          height: 200,
                        }}
                      >
                        <div className="flex-1 p-5">
                          <p className="stamp text-xs text-coral">
                            Featured event
                          </p>
                          <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                            {event.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-xs text-ink-soft">
                            {event.description}
                          </p>
                          <p className="mt-3 text-xs text-ink-soft">
                            Hosted by{" "}
                            <span className="font-medium text-ink">
                              {event.owner?.name}
                            </span>
                          </p>
                        </div>

                        <div className="ticket-stub-divider my-3" />
                        <div className="flex w-28 shrink-0 flex-col items-center justify-center gap-1 p-3 text-center">
                          <p className="stamp text-[10px] text-ink-soft">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </p>
                          <p className="font-display text-3xl font-semibold text-ink">
                            {date.getDate()}
                          </p>
                          <p className="stamp text-[10px] text-ink-soft">
                            {date.getFullYear()}
                          </p>
                          <Link
                            href={`/events/${event.id}`}
                            className="stamp mt-3 rounded-full bg-coral px-3 py-1 text-[10px] font-semibold text-paper"
                          >
                            Join
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
