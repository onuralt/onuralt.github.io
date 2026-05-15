const robotChapters = document.querySelectorAll(".robot-chapter");
const cvChapters = document.querySelectorAll(".cv-chapter");
const vlsiChapters = document.querySelectorAll(".vlsi-chapter");
const sectionNavLinks = document.querySelectorAll('nav a[href^="#"]');
const vlsiEvidenceImages = document.querySelectorAll(".vlsi-evidence-item img");
const animationToggle = document.querySelector("#animation-toggle");
const vlsiZoom = document.createElement("div");
const vlsiZoomImage = document.createElement("img");
let activeScrollAnimation;
const animationPreferenceKey = "portfolio-animation-disabled";

vlsiZoom.className = "vlsi-hover-zoom";
vlsiZoom.setAttribute("aria-hidden", "true");
vlsiZoom.appendChild(vlsiZoomImage);
document.body.appendChild(vlsiZoom);

function isAnimationDisabled() {
  return document.body.classList.contains("no-animation");
}

function showVlsiZoom(image) {
  vlsiZoomImage.src = image.currentSrc || image.src;
  vlsiZoomImage.alt = image.alt || "";
  vlsiZoom.classList.add("is-active");
}

function hideVlsiZoom() {
  vlsiZoom.classList.remove("is-active");
}

vlsiEvidenceImages.forEach((image) => {
  const item = image.closest(".vlsi-evidence-item");

  if (!item) {
    return;
  }

  item.addEventListener("mouseenter", () => showVlsiZoom(image));
  item.addEventListener("mouseleave", hideVlsiZoom);
  item.addEventListener("focusin", () => showVlsiZoom(image));
  item.addEventListener("focusout", hideVlsiZoom);
});

function equalizeVlsiEvidenceCards() {
  document.querySelectorAll(".vlsi-evidence-grid").forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".vlsi-evidence-card"));

    if (cards.length < 2) {
      return;
    }

    cards.forEach((card) => {
      card.style.height = "";
    });

    const maxHeight = Math.max(...cards.map((card) => card.offsetHeight));

    cards.forEach((card) => {
      card.style.height = `${maxHeight}px`;
    });
  });
}

function setCompletedRobotState() {
  const viewport = window.innerHeight || 1;
  const viewportWidth = window.innerWidth || 1;

  robotChapters.forEach((chapter) => {
    chapter.style.setProperty("--robot-progress", "1");
    chapter.style.setProperty("--title-opacity", "1");
    chapter.style.setProperty("--title-y", "0px");
    chapter.style.setProperty("--cover-x", `${Math.round(viewport * -0.38)}px`);
    chapter.style.setProperty("--cover-scale", "0.64");
    chapter.style.setProperty("--media-y", "-18px");
    chapter.style.setProperty("--rail-width", "100%");
    chapter.style.setProperty("--ball-rgb", "1");
    chapter.style.setProperty("--ball-hsv", "1");
    chapter.style.setProperty("--ball-threshold", "1");
    chapter.style.setProperty("--ball-stack", "1");
    chapter.style.setProperty("--filter-text", "1");
    chapter.style.setProperty("--caption-rgb-opacity", "0");
    chapter.style.setProperty("--caption-rgb-y", "-90px");
    chapter.style.setProperty("--caption-hsv-opacity", "0");
    chapter.style.setProperty("--caption-hsv-y", "-90px");
    chapter.style.setProperty("--caption-threshold-opacity", "0");
    chapter.style.setProperty("--caption-threshold-y", "-90px");
    chapter.style.setProperty("--caption-track-x", "0px");
    chapter.style.setProperty("--flow-copy", "1");
    chapter.style.setProperty("--flow-gif-opacity", "1");
    chapter.style.setProperty("--flow-gif-scale", "1");
    Array.from({ length: 8 }).forEach((_, index) => {
      chapter.style.setProperty(`--flow-${index + 1}`, "1");
      chapter.style.setProperty(`--flow-line-${index + 1}`, "1");
    });
    chapter.style.setProperty("--motion-approach", "1");
    chapter.style.setProperty("--motion-pair", "1");
    chapter.style.setProperty("--motion-turn", "1");
    chapter.style.setProperty("--filter-stack-x", `${Math.round(viewportWidth * 0.025)}px`);
    chapter.style.setProperty("--ball-scale", "0.95");
    chapter.style.setProperty("--rgb-x", "0px");
    chapter.style.setProperty("--rgb-y", "-76px");
    chapter.style.setProperty("--hsv-x", "24px");
    chapter.style.setProperty("--hsv-y", "0px");
    chapter.style.setProperty("--threshold-x", "48px");
    chapter.style.setProperty("--threshold-y", "76px");
  });
}

function setCompletedCvState() {
  cvChapters.forEach((chapter) => {
    chapter.style.setProperty("--cv-rail-width", "100%");
    Array.from({ length: 5 }).forEach((_, index) =>
      chapter.style.setProperty(`--cv-section-${index + 1}`, "1"),
    );
  });
}

function setCompletedVlsiState() {
  const viewportWidth = window.innerWidth || 1;
  const coverShift = Math.round(Math.min(viewportWidth * 0.22, 280));

  vlsiChapters.forEach((chapter) => {
    chapter.style.setProperty("--vlsi-media", "1");
    chapter.style.setProperty("--vlsi-text", "1");
    chapter.style.setProperty("--vlsi-note", "1");
    chapter.style.setProperty("--vlsi-rail-width", "100%");
    Array.from({ length: 6 }).forEach((_, index) =>
      chapter.style.setProperty(`--vlsi-figure-${index + 1}`, "1"),
    );
    Array.from({ length: 5 }).forEach((_, index) =>
      chapter.style.setProperty(`--vlsi-stage-${index + 1}`, "1"),
    );
    chapter.style.setProperty("--vlsi-media-y", "0px");
    chapter.style.setProperty("--vlsi-text-y", "0px");
    chapter.style.setProperty("--vlsi-cover-shift", `${coverShift}px`);
  });
}

function setCompletedAnimationState() {
  setCompletedRobotState();
  setCompletedCvState();
  setCompletedVlsiState();
  equalizeVlsiEvidenceCards();
}

function setAnimationDisabled(disabled) {
  document.body.classList.toggle("no-animation", disabled);

  if (animationToggle) {
    animationToggle.checked = disabled;
  }

  localStorage.setItem(animationPreferenceKey, disabled ? "true" : "false");

  if (activeScrollAnimation) {
    cancelAnimationFrame(activeScrollAnimation);
    activeScrollAnimation = null;
  }

  if (disabled) {
    setCompletedAnimationState();
  } else {
    updateRobotProgress();
  }
}

vlsiEvidenceImages.forEach((image) => {
  if (image.complete) {
    return;
  }

  image.addEventListener("load", equalizeVlsiEvidenceCards, { once: true });
});

function getChapterEndScrollTop(chapter) {
  const rect = chapter.getBoundingClientRect();
  const pageTop = rect.top + window.scrollY;

  return pageTop + getChapterTravel(chapter);
}

function getSectionTopScrollTop(section) {
  const headerHeight =
    document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  const rect = section.getBoundingClientRect();

  return rect.top + window.scrollY - headerHeight;
}

function getStickyTop(pin) {
  const top = pin ? Number.parseFloat(getComputedStyle(pin).top) : 0;

  return Number.isFinite(top) ? top : 0;
}

function getChapterPin(chapter) {
  return chapter.querySelector(".cv-pin, .robot-pin, .vlsi-pin");
}

function getChapterTravel(chapter) {
  const pin = getChapterPin(chapter);
  const stickyTop = getStickyTop(pin);
  const pinHeight = pin?.offsetHeight || window.innerHeight || 1;

  return Math.max(chapter.offsetHeight - stickyTop - pinHeight, 1);
}

function animateScrollTo(targetTop, duration = 1800) {
  const startTop = window.scrollY;
  const maxTop = document.documentElement.scrollHeight - window.innerHeight;
  const endTop = Math.min(Math.max(targetTop, 0), Math.max(maxTop, 0));
  const distance = endTop - startTop;
  const startTime = performance.now();
  const easeInOutCubic = (value) =>
    value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;

  if (activeScrollAnimation) {
    cancelAnimationFrame(activeScrollAnimation);
  }

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startTop + distance * eased);

    if (progress < 1) {
      activeScrollAnimation = requestAnimationFrame(step);
    } else {
      activeScrollAnimation = null;
    }
  }

  activeScrollAnimation = requestAnimationFrame(step);
}

function scrollToChapterEnd(chapter) {
  if (isAnimationDisabled()) {
    scrollToSectionTop(chapter);
    return;
  }

  animateScrollTo(getChapterEndScrollTop(chapter), 4800);
}

function scrollToSectionTop(section) {
  const targetTop = getSectionTopScrollTop(section);

  if (isAnimationDisabled()) {
    window.scrollTo(0, targetTop);
    return;
  }

  animateScrollTo(targetTop, 2400);
}

function addAdvanceButton(pin, target, label, completeTarget = true) {
  if (!pin || !target) {
    return;
  }

  const button = document.createElement("button");
  button.className = "slide-advance";
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", label);
  button.addEventListener("click", () => {
    if (completeTarget) {
      scrollToChapterEnd(target);
    } else {
      scrollToSectionTop(target);
    }
  });

  pin.appendChild(button);
}

function addSlideAdvanceControls() {
  const welcome = document.querySelector("#welcome");
  const orderedSlides = [
    {
      pin: welcome?.querySelector(".welcome-pin"),
      target: cvChapters[0],
      label: "Go to CV section",
    },
    {
      pin: cvChapters[0]?.querySelector(".cv-pin"),
      target: robotChapters[0],
      label: "Go to Robot section",
    },
    ...Array.from(robotChapters).map((chapter, index) => ({
      pin: chapter.querySelector(".robot-pin"),
      target: robotChapters[index + 1] || vlsiChapters[0],
      label: robotChapters[index + 1] ? "Next slide" : "Go to VLSI section",
    })),
    ...Array.from(vlsiChapters).map((chapter, index) => ({
      pin: chapter.querySelector(".vlsi-pin"),
      target: vlsiChapters[index + 1] || welcome,
      label: vlsiChapters[index + 1] ? "Next slide" : "Back to welcome",
      completeTarget: Boolean(vlsiChapters[index + 1]),
    })),
  ];

  orderedSlides.forEach(({ pin, target, label, completeTarget = true }) =>
    addAdvanceButton(pin, target, label, completeTarget),
  );
}

function setupSectionNavigation() {
  const welcome = document.querySelector("#welcome");
  const animatedTargets = new Map([
    ["#cv", cvChapters[0]],
    ["#robotics", robotChapters[0]],
    ["#vlsi", vlsiChapters[0]],
  ]);

  sectionNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");

      if (hash === "#welcome" && welcome) {
        event.preventDefault();
        history.pushState(null, "", hash);
        scrollToSectionTop(welcome);
        return;
      }

      const target = animatedTargets.get(hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      history.pushState(null, "", hash);

      if (isAnimationDisabled()) {
        scrollToSectionTop(target);
      } else {
        scrollToChapterEnd(target);
      }
    });
  });
}

function updateRobotProgress() {
  if (isAnimationDisabled()) {
    setCompletedAnimationState();
    return;
  }

  const viewport = window.innerHeight || 1;
  const reveal = (value, start, span) =>
    Math.min(Math.max((value - start) / span, 0), 1);

  robotChapters.forEach((chapter) => {
    const rect = chapter.getBoundingClientRect();
    const travel = getChapterTravel(chapter);
    const viewportWidth = window.innerWidth || 1;
    const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
    const title = Math.min(Math.max((progress - 0.12) / 0.28, 0), 1);
    const rail = Math.min(Math.max(progress, 0), 1);
    const mediaY = Math.round(progress * -18);
    const titleY = Math.round((1 - title) * 34);
    const coverX = Math.round(progress * viewport * -0.38);
    const coverScale = 1 - progress * 0.36;
    const ballRgb = Math.min(Math.max(progress / 0.14, 0), 1);
    const ballHsv = Math.min(Math.max((progress - 0.34) / 0.16, 0), 1);
    const ballThreshold = Math.min(Math.max((progress - 0.62) / 0.16, 0), 1);
    const ballStack = Math.min(Math.max((progress - 0.8) / 0.18, 0), 1);
    const filterText = Math.min(Math.max((progress - 0.82) / 0.16, 0), 1);
    const captionRgbY =
      progress < 0.34
        ? Math.round((1 - ballRgb) * 36)
        : Math.round(-90 * Math.min(Math.max((progress - 0.34) / 0.16, 0), 1));
    const captionRgbOpacity =
      progress < 0.34
        ? ballRgb
        : 1 - Math.min(Math.max((progress - 0.34) / 0.16, 0), 1);
    const captionHsvIn = Math.min(Math.max((progress - 0.34) / 0.16, 0), 1);
    const captionHsvOut = Math.min(Math.max((progress - 0.62) / 0.16, 0), 1);
    const captionHsvY =
      captionHsvOut > 0
        ? Math.round(-90 * captionHsvOut)
        : Math.round((1 - captionHsvIn) * 36);
    const captionHsvOpacity =
      captionHsvOut > 0 ? 1 - captionHsvOut : captionHsvIn;
    const captionThresholdIn = Math.min(
      Math.max((progress - 0.62) / 0.16, 0),
      1,
    );
    const captionThresholdOut = Math.min(
      Math.max((progress - 0.8) / 0.16, 0),
      1,
    );
    const captionThresholdOpacity =
      captionThresholdIn * (1 - captionThresholdOut);
    const captionThresholdY =
      captionThresholdOut > 0
        ? Math.round(-90 * captionThresholdOut)
        : Math.round((1 - captionThresholdIn) * 36);
    const filterStackX = Math.round(
      (-0.12 * (1 - ballStack) + 0.025 * ballStack) * viewportWidth,
    );
    const imageShrink = reveal(progress, 0.72, 0.22);
    const ballScale = 2.05 - imageShrink * 1.1;
    const captionTrackX = Math.round((1 - imageShrink) * 190);
    const flowCopy = reveal(progress, 0.08, 0.18);
    const flowGifIn = reveal(progress, 0.02, 0.12);
    const flowGifSettle = reveal(progress, 0.14, 0.34);
    const flowGifScale = 2.9 - flowGifSettle * 1.9;
    const flowSteps = [0.43, 0.5, 0.57, 0.64, 0.71, 0.78, 0.85, 0.92].map(
      (start) => reveal(progress, start, 0.06),
    );
    const flowLines = [0.48, 0.55, 0.62, 0.69, 0.76, 0.83, 0.9, 0.96].map(
      (start) => reveal(progress, start, 0.05),
    );
    const motionApproach = reveal(progress, 0.1, 0.18);
    const motionPair = reveal(progress, 0.42, 0.2);
    const motionTurn = reveal(progress, 0.56, 0.18);

    chapter.style.setProperty("--robot-progress", progress.toFixed(4));
    chapter.style.setProperty("--title-opacity", title.toFixed(4));
    chapter.style.setProperty("--title-y", `${titleY}px`);
    chapter.style.setProperty("--cover-x", `${coverX}px`);
    chapter.style.setProperty("--cover-scale", coverScale.toFixed(4));
    chapter.style.setProperty("--media-y", `${mediaY}px`);
    chapter.style.setProperty("--rail-width", `${(rail * 100).toFixed(2)}%`);
    chapter.style.setProperty("--ball-rgb", ballRgb.toFixed(4));
    chapter.style.setProperty("--ball-hsv", ballHsv.toFixed(4));
    chapter.style.setProperty("--ball-threshold", ballThreshold.toFixed(4));
    chapter.style.setProperty("--ball-stack", ballStack.toFixed(4));
    chapter.style.setProperty("--filter-text", filterText.toFixed(4));
    chapter.style.setProperty(
      "--caption-rgb-opacity",
      captionRgbOpacity.toFixed(4),
    );
    chapter.style.setProperty("--caption-rgb-y", `${captionRgbY}px`);
    chapter.style.setProperty(
      "--caption-hsv-opacity",
      captionHsvOpacity.toFixed(4),
    );
    chapter.style.setProperty("--caption-hsv-y", `${captionHsvY}px`);
    chapter.style.setProperty(
      "--caption-threshold-opacity",
      captionThresholdOpacity.toFixed(4),
    );
    chapter.style.setProperty(
      "--caption-threshold-y",
      `${captionThresholdY}px`,
    );
    chapter.style.setProperty("--caption-track-x", `${captionTrackX}px`);
    chapter.style.setProperty("--flow-copy", flowCopy.toFixed(4));
    chapter.style.setProperty("--flow-gif-opacity", flowGifIn.toFixed(4));
    chapter.style.setProperty("--flow-gif-scale", flowGifScale.toFixed(4));
    flowSteps.forEach((value, index) =>
      chapter.style.setProperty(`--flow-${index + 1}`, value.toFixed(4)),
    );
    flowLines.forEach((value, index) =>
      chapter.style.setProperty(`--flow-line-${index + 1}`, value.toFixed(4)),
    );
    chapter.style.setProperty("--motion-approach", motionApproach.toFixed(4));
    chapter.style.setProperty("--motion-pair", motionPair.toFixed(4));
    chapter.style.setProperty("--motion-turn", motionTurn.toFixed(4));
    chapter.style.setProperty("--filter-stack-x", `${filterStackX}px`);
    chapter.style.setProperty("--ball-scale", ballScale.toFixed(4));
    chapter.style.setProperty("--rgb-x", "0px");
    chapter.style.setProperty("--rgb-y", `${Math.round(ballStack * -76)}px`);
    chapter.style.setProperty("--hsv-x", `${Math.round(ballStack * 24)}px`);
    chapter.style.setProperty("--hsv-y", "0px");
    chapter.style.setProperty(
      "--threshold-x",
      `${Math.round(ballStack * 48)}px`,
    );
    chapter.style.setProperty(
      "--threshold-y",
      `${Math.round(ballStack * 76)}px`,
    );
  });

  cvChapters.forEach((chapter) => {
    const rect = chapter.getBoundingClientRect();
    const travel = getChapterTravel(chapter);
    const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
    const sections = [0.08, 0.28, 0.56, 0.7, 0.82].map((start) =>
      reveal(progress, start, 0.12),
    );

    chapter.style.setProperty(
      "--cv-rail-width",
      `${(progress * 100).toFixed(2)}%`,
    );
    sections.forEach((value, index) =>
      chapter.style.setProperty(`--cv-section-${index + 1}`, value.toFixed(4)),
    );
  });

  vlsiChapters.forEach((chapter) => {
    const rect = chapter.getBoundingClientRect();
    const viewportWidth = window.innerWidth || 1;
    const travel = getChapterTravel(chapter);
    const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
    const isSequence =
      chapter.classList.contains("vlsi-comparison-panel") ||
      chapter.classList.contains("vlsi-cell-panel") ||
      chapter.classList.contains("vlsi-build-panel") ||
      chapter.classList.contains("vlsi-measure-panel") ||
      chapter.classList.contains("vlsi-takeaway-panel");
    const isLateText = chapter.classList.contains("vlsi-takeaway-panel");
    const isCover = chapter.classList.contains("vlsi-cover");
    const media = reveal(progress, 0.06, 0.18);
    const text = reveal(
      progress,
      isCover ? 0.48 : isLateText ? 0.62 : isSequence ? 0.14 : 0.36,
      isCover ? 0.32 : 0.2,
    );
    const coverMotion = isCover ? reveal(progress, 0.42, 0.42) : 0;
    const coverShift = isCover
      ? Math.round(coverMotion * Math.min(viewportWidth * 0.22, 280))
      : 0;
    const figure1 = reveal(progress, 0.08, 0.14);
    const figure2 = reveal(progress, 0.22, 0.12);
    const figure3 = reveal(progress, 0.36, 0.12);
    const figure4 = reveal(progress, 0.5, 0.12);
    const figure5 = reveal(progress, 0.64, 0.12);
    const figure6 = reveal(progress, 0.78, 0.12);
    const note = reveal(progress, 0.78, 0.14);
    const stage1 = reveal(progress, 0.04, 0.12);
    const stage2 = reveal(progress, 0.18, 0.12);
    const stage3 = reveal(progress, 0.32, 0.12);
    const stage4 = reveal(progress, 0.5, 0.12);
    const stage5 = reveal(progress, 0.68, 0.14);

    chapter.style.setProperty("--vlsi-media", media.toFixed(4));
    chapter.style.setProperty("--vlsi-text", text.toFixed(4));
    chapter.style.setProperty("--vlsi-note", note.toFixed(4));
    chapter.style.setProperty(
      "--vlsi-rail-width",
      `${(progress * 100).toFixed(2)}%`,
    );
    chapter.style.setProperty("--vlsi-figure-1", figure1.toFixed(4));
    chapter.style.setProperty("--vlsi-figure-2", figure2.toFixed(4));
    chapter.style.setProperty("--vlsi-figure-3", figure3.toFixed(4));
    chapter.style.setProperty("--vlsi-figure-4", figure4.toFixed(4));
    chapter.style.setProperty("--vlsi-figure-5", figure5.toFixed(4));
    chapter.style.setProperty("--vlsi-figure-6", figure6.toFixed(4));
    chapter.style.setProperty("--vlsi-stage-1", stage1.toFixed(4));
    chapter.style.setProperty("--vlsi-stage-2", stage2.toFixed(4));
    chapter.style.setProperty("--vlsi-stage-3", stage3.toFixed(4));
    chapter.style.setProperty("--vlsi-stage-4", stage4.toFixed(4));
    chapter.style.setProperty("--vlsi-stage-5", stage5.toFixed(4));
    chapter.style.setProperty(
      "--vlsi-media-y",
      `${Math.round((1 - media) * 42)}px`,
    );
    chapter.style.setProperty(
      "--vlsi-text-y",
      `${Math.round((1 - text) * 36)}px`,
    );
    chapter.style.setProperty("--vlsi-cover-shift", `${coverShift}px`);
  });
}

addSlideAdvanceControls();
setupSectionNavigation();
equalizeVlsiEvidenceCards();

if (animationToggle) {
  animationToggle.addEventListener("change", () =>
    setAnimationDisabled(animationToggle.checked),
  );
}

setAnimationDisabled(localStorage.getItem(animationPreferenceKey) === "true");
updateRobotProgress();
window.addEventListener("scroll", updateRobotProgress, { passive: true });
window.addEventListener("scroll", hideVlsiZoom, { passive: true });
window.addEventListener("resize", () => {
  equalizeVlsiEvidenceCards();
  updateRobotProgress();
});
window.addEventListener("resize", hideVlsiZoom);
