import gsap from "gsap";
import { renderCityMap } from "./map.js";

export class PaperReveal {
  constructor() {
    this.root = document.getElementById("paper-root");
    this.backdrop = this.root.querySelector(".paper-backdrop");
    this.sheet = this.root.querySelector(".paper-sheet");
    this.body = this.root.querySelector(".paper-body");
    this.foldTop = this.root.querySelector(".paper-fold-top");
    this.foldBottom = this.root.querySelector(".paper-fold-bottom");
    this.cityEl = this.root.querySelector(".paper-city");
    this.arabicEl = this.root.querySelector(".paper-arabic");
    this.landmarkEl = this.root.querySelector(".paper-landmark");
    this.descEl = this.root.querySelector(".paper-desc");
    this.tagsEl = this.root.querySelector(".paper-tags");
    this.regionEl = this.root.querySelector(".paper-region");
    this.listEl = this.root.querySelector(".paper-list");
    this.mapWrap = this.root.querySelector(".paper-map-wrap");
    this.highlightsSection = this.root.querySelector(".paper-highlights");
    this.closeBtn = this.root.querySelector(".paper-close");
    this.artEl = this.root.querySelector(".paper-art");

    this.open = false;
    this.tl = null;

    this.closeBtn.addEventListener("click", () => this.hide());
    this.backdrop.addEventListener("click", () => this.hide());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.open) this.hide();
    });
  }

  _paintArt(city) {
    const [a, b, c] = city.colors;
    this.artEl.style.background = `linear-gradient(160deg, ${a}, ${b} 55%, ${c})`;
    this.artEl.dataset.art = city.art;
  }

  _fill(city) {
    this.cityEl.textContent = city.city;
    this.arabicEl.textContent = city.arabic;
    this.landmarkEl.textContent = city.landmark;
    this.descEl.textContent = city.description;
    this.regionEl.textContent = `${city.region} · ${city.wilaya}`;
    this.tagsEl.innerHTML = city.tags
      .map((t) => `<span class="paper-tag">${t}</span>`)
      .join("");
    this.listEl.innerHTML = city.highlights
      .map(
        (h, i) => `
        <li class="paper-list-item" style="--i:${i}">
          <span class="paper-list-num mono">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <strong class="paper-list-title">${h.title}</strong>
            <p class="paper-list-text">${h.text}</p>
          </div>
        </li>`
      )
      .join("");
    renderCityMap(this.mapWrap, city);
    this._paintArt(city);
    this.body.scrollTop = 0;
  }

  _contentEls() {
    return [
      this.cityEl,
      this.landmarkEl,
      this.arabicEl,
      this.descEl,
      this.tagsEl,
      this.artEl,
      this.mapWrap,
      this.highlightsSection,
    ];
  }

  show(city) {
    if (this.open) return;
    this.open = true;
    this._fill(city);
    this.root.classList.add("is-open");
    this.root.setAttribute("aria-hidden", "false");

    if (this.tl) this.tl.kill();
    gsap.set(this.backdrop, { opacity: 0 });
    gsap.set(this.sheet, {
      opacity: 0,
      scale: 0.68,
      rotationX: -22,
      rotationY: 8,
      y: 100,
      transformOrigin: "50% 0%",
    });
    gsap.set(this.foldTop, { scaleY: 1, transformOrigin: "50% 100%" });
    gsap.set(this.foldBottom, { scaleY: 0.06, transformOrigin: "50% 0%" });
    gsap.set(this._contentEls(), { opacity: 0, y: 28 });
    gsap.set(this.listEl.querySelectorAll(".paper-list-item"), { opacity: 0, x: -12 });

    this.tl = gsap.timeline();
    this.tl
      .to(this.backdrop, { opacity: 1, duration: 0.45, ease: "power2.out" })
      .to(
        this.sheet,
        {
          opacity: 1,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
        },
        "-=0.2"
      )
      .to(
        this.foldTop,
        { scaleY: 0.03, duration: 0.5, ease: "power2.inOut" },
        "-=0.55"
      )
      .to(
        this.foldBottom,
        { scaleY: 1, duration: 0.55, ease: "power2.out" },
        "-=0.35"
      )
      .to(
        [this.cityEl, this.landmarkEl, this.arabicEl],
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
        "-=0.3"
      )
      .to(
        [this.mapWrap, this.artEl],
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
        "-=0.25"
      )
      .to(
        this.descEl,
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      )
      .to(
        this.highlightsSection,
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
        "-=0.15"
      )
      .to(
        this.listEl.querySelectorAll(".paper-list-item"),
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
        "-=0.2"
      )
      .to(
        this.tagsEl,
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "-=0.1"
      );
  }

  hide() {
    if (!this.open) return;

    if (this.tl) this.tl.kill();
    this.tl = gsap.timeline({
      onComplete: () => {
        this.open = false;
        this.root.classList.remove("is-open");
        this.root.setAttribute("aria-hidden", "true");
      },
    });

    this.tl
      .to(this._contentEls(), {
        opacity: 0,
        y: 16,
        duration: 0.18,
        stagger: 0.02,
        ease: "power2.in",
      })
      .to(
        this.foldBottom,
        { scaleY: 0.05, duration: 0.3, ease: "power2.in" },
        "-=0.05"
      )
      .to(
        this.foldTop,
        { scaleY: 1, duration: 0.3, ease: "power2.in" },
        "-=0.18"
      )
      .to(
        this.sheet,
        {
          opacity: 0,
          scale: 0.88,
          rotationX: 14,
          y: 50,
          duration: 0.4,
          ease: "power2.in",
        },
        "-=0.12"
      )
      .to(this.backdrop, { opacity: 0, duration: 0.28, ease: "power2.in" }, "-=0.15");
  }

  isOpen() {
    return this.open;
  }
}
