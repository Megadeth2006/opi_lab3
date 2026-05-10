function updateClockMafia() {
    const now = new Date();

    // дата
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateStr = `${day}.${month}.${year}`;

    // время
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    const timeStr = `${h}:${m}:${s}`;

    const clockElement = document.getElementById("digitalClock");
    if (clockElement) {
        clockElement.innerHTML = `<div class="clock-date">${dateStr}</div><div class="clock-time">${timeStr}</div>`;
    }
}

setInterval(updateClockMafia, 7000);
updateClockMafia();

