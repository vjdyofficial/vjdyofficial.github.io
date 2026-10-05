const time = document.getElementById("time");
const date = document.getElementById("date");
const event_dating = document.getElementById("event");
const creatorStatus = document.getElementById("creator-status");

const EVENTS = [
  {
    name: "🎄 Christmas",
    month: 12,
    day: 25,
  },

  {
    name: "🎆 New Year",
    month: 1,
    day: 1,
  },

  {
    name: "💍 Anniversary",
    month: 3,
    day: 21,
  },

  {
    name: "🔊 Sound Effects Studio Anniversary",
    month: 7,
    day: 2,
  },

  /*
   * CHANGE THESE TO YOUR ACTUAL BIRTHDAY
   *
   * Example:
   * month: 8,
   * day: 15
   */
  {
    name: "🎂 My Birthday",
    month: 1,
    day: 1,
  },
];

/*
 * ==========================================
 * PHILIPPINES TIME
 * ==========================================
 */

function getManilaDate() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    }),
  );
}

/*
 * ==========================================
 * CREATE NEXT EVENT DATE
 * ==========================================
 */

function getNextEventDate(event_datingInfo, now) {
  let year = now.getFullYear();

  let target = new Date(year, event_datingInfo.month - 1, event_datingInfo.day, 0, 0, 0);

  // If this year's event_dating has already passed,
  // schedule it for next year.
  if (target < now) {
    target = new Date(year + 1, event_datingInfo.month - 1, event_datingInfo.day, 0, 0, 0);
  }

  return target;
}

/*
 * ==========================================
 * FIND THE NEXT EVENT
 * ==========================================
 */

function getNextEvent(now) {
  let nextEvent = null;

  for (const event_datingInfo of EVENTS) {
    const target = getNextEventDate(event_datingInfo, now);

    if (!nextEvent || target < nextEvent.date) {
      nextEvent = {
        ...event_datingInfo,
        date: target,
      };
    }
  }

  return nextEvent;
}

/*
 * ==========================================
 * COUNTDOWN FORMATTER
 * ==========================================
 */

function formatCountdown(milliseconds) {
  if (milliseconds <= 0) {
    return "00d 00h 00m 00s";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor((totalSeconds % 86400) / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  return (
    String(days).padStart(2, "0") +
    "d " +
    String(hours).padStart(2, "0") +
    "h " +
    String(minutes).padStart(2, "0") +
    "m " +
    String(seconds).padStart(2, "0") +
    "s"
  );
}

/*
 * ==========================================
 * SPECIAL DAY MESSAGES
 * ==========================================
 */

function getSpecialMessage(now) {
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // 🎆 January 1
  if (month === 1 && day === 1) {
    return "🎆 Happy New Year!";
  }

  // 🎄 December 25
  if (month === 12 && day === 25) {
    return "🎄 Merry Christmas!";
  }

  return null;
}

/*
 * ==========================================
 * UPDATE EVERYTHING
 * ==========================================
 */

function updateVJDYClock() {
  const now = getManilaDate();

  const currentTime = now.toLocaleTimeString("en-PH", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentHour = now.getHours();
  let creatorStatusText = "Creator is active.";

  if (currentHour >= 22) {
    creatorStatusText = "Creator is relaxing.";
  } else if (currentHour >= 0 && currentHour < 5) {
    creatorStatusText = "Creator is inactive.";
  } else if (currentHour === 5) {
    creatorStatusText = "Creator is inactive.";
  } else if (currentHour >= 6 && currentHour < 22) {
    creatorStatusText = "Creator is active.";
  }

  creatorStatus.textContent = `${creatorStatusText}`;

  /*
   * Manila TIME
   */
  time.textContent = now.toLocaleTimeString("en-PH", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  /*
   * Manila DATE
   */
  date.textContent = now.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /*
   * SPECIAL DAY
   */
  const specialMessage = getSpecialMessage(now);

  if (specialMessage) {
    if (event_dating) {
      event_dating.textContent = specialMessage;
    }

    return;
  }

  /*
   * NEXT EVENT
   */
  const nextEvent = getNextEvent(now);

  if (!nextEvent || !event_dating) {
    return;
  }

  /*
   * COUNTDOWN
   */
  const difference = nextEvent.date - now;

  const countdown = formatCountdown(difference);

  /*
   * CHRISTMAS 100-DAY WINDOW
   *
   * When Christmas is within 100 days,
   * make it explicitly say so.
   */
  const christmas = EVENTS.find((item) => item.month === 12 && item.day === 25);

  const christmasDate = getNextEventDate(christmas, now);

  const christmasDifference = christmasDate - now;

  const hundredDays = 100 * 24 * 60 * 60 * 1000;

  if (christmasDifference > 0 && christmasDifference <= hundredDays) {
    const christmasCountdown = formatCountdown(christmasDifference);

    event_dating.textContent = `🎄 ${christmasCountdown} until Christmas!`;

    return;
  }

  /*
   * NORMAL EVENT COUNTDOWN
   */
  event_dating.textContent = `${nextEvent.name}: ${countdown}`;
}

/*
 * ==========================================
 * START
 * ==========================================
 */

updateVJDYClock();

// Update every second.
setInterval(updateVJDYClock, 1000);
