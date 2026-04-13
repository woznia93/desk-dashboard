let allEvents = [];
let currentView = 'day';
let currentMonth = new Date();
let selectedDay = new Date();

// ── Weather ──────────────────────────────────────────
async function updateWeather() {
    try {
        const res = await fetch("http://127.0.0.1:8000/weather");
        const data = await res.json();
        document.getElementById("temp").innerText = data.temp + "°";
        document.getElementById("condition").innerText = data.condition;
        document.getElementById("clock").innerText = data.time;
    } catch (err) {
        document.getElementById("temp").innerText = "--°";
        document.getElementById("condition").innerText = "N/A";
        document.getElementById("clock").innerText = "--:--";
    }
}

// ── Events ───────────────────────────────────────────
async function loadEvents() {
    try {
        const res = await fetch("http://127.0.0.1:8000/events");
        allEvents = await res.json();
        renderAll();
    } catch (err) {
        console.error("Events error:", err);
    }
}

function renderAll() {
    renderHeader();
    if (currentView === 'day')   renderDay();
    if (currentView === 'week')  renderWeek();
    if (currentView === 'month') renderMonth();
}

function renderHeader() {
    const now = new Date();
    document.getElementById("today-date").innerText = now.toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
    });
}

// ── Day View ─────────────────────────────────────────
function renderDay() {
    const today = new Date().toDateString();
    const list = document.getElementById("day-events-list");
    const todays = allEvents
        .filter(e => new Date(e.start).toDateString() === today)
        .sort((a, b) => new Date(a.start) - new Date(b.start));

    list.innerHTML = todays.length === 0
        ? '<div class="no-events">Nothing scheduled today</div>'
        : todays.map(e => eventHTML(e)).join('');
}

// ── Week View ─────────────────────────────────────────
function renderWeek() {
    const container = document.getElementById("week-days");
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    container.innerHTML = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const isToday = day.toDateString() === today.toDateString();
        const dayEvents = allEvents
            .filter(e => new Date(e.start).toDateString() === day.toDateString())
            .sort((a, b) => new Date(a.start) - new Date(b.start));

        return `
          <div class="week-day ${isToday ? 'today' : ''}">
            <div class="week-day-label">
              ${day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              ${isToday ? '<span class="today-badge">Today</span>' : ''}
            </div>
            ${dayEvents.length === 0
                ? '<div class="no-events-small">—</div>'
                : dayEvents.map(e => `
                    <div class="week-event">
                      <span class="week-event-time">${formatTime(e.start)}</span>
                      <span>${e.title}</span>
                      <span class="delete-btn" onclick="deleteEvent('${e.id}')">✕</span>
                    </div>`).join('')
            }
          </div>`;
    }).join('');
}

// ── Month View ────────────────────────────────────────
function renderMonth() {
    const label = document.getElementById("month-label");
    label.innerText = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const grid = document.getElementById("month-grid");
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toDateString();

    let html = '<div class="month-weekdays">';
    ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => html += `<div>${d}</div>`);
    html += '</div><div class="month-cells">';

    for (let i = 0; i < firstDay; i++) html += '<div class="month-cell empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const isToday = date.toDateString() === today;
        const isSelected = date.toDateString() === selectedDay.toDateString();
        const dayEvents = allEvents.filter(e => new Date(e.start).toDateString() === date.toDateString());
        html += `
          <div class="month-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}"
               onclick="selectMonthDay(new Date(${date.getTime()}))">
            <span class="month-day-num">${d}</span>
            ${dayEvents.slice(0, 2).map(e =>
                `<div class="month-event-chip">${e.title}</div>`
            ).join('')}
            ${dayEvents.length > 2 ? `<div class="month-more">+${dayEvents.length - 2} more</div>` : ''}
          </div>`;
    }
    html += '</div>';
    grid.innerHTML = html;
}

function selectMonthDay(date) {
    selectedDay = date;
    renderMonth();

    const panel = document.getElementById("selected-day-events");
    const label = document.getElementById("selected-day-label");
    const list  = document.getElementById("selected-day-list");

    const dayEvents = allEvents
        .filter(e => new Date(e.start).toDateString() === date.toDateString())
        .sort((a, b) => new Date(a.start) - new Date(b.start));

    label.innerText = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    list.innerHTML = dayEvents.length === 0
        ? '<div class="no-events">Nothing scheduled</div>'
        : dayEvents.map(e => eventHTML(e)).join('');

    panel.classList.remove("hidden");
}

function changeMonth(dir) {
    currentMonth.setMonth(currentMonth.getMonth() + dir);
    renderMonth();
}

// ── View Switching ────────────────────────────────────
function setView(view) {
    currentView = view;
    ['day','week','month'].forEach(v => {
        document.getElementById(`${v}-view`).classList.toggle('hidden', v !== view);
        document.getElementById(`tab-${v}`).classList.toggle('active', v === view);
    });
    renderAll();
}

// ── Add / Delete ──────────────────────────────────────
function openAddModal() {
    // pre-fill datetime to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById("event-datetime").value = now.toISOString().slice(0,16);
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("event-title").value = "";
}

async function submitEvent() {
    const title = document.getElementById("event-title").value.trim();
    const start = document.getElementById("event-datetime").value;
    if (!title || !start) return;
    const event = { id: Date.now().toString(), title, start };
    await fetch("http://127.0.0.1:8000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)
    });
    closeModal();
    loadEvents();
}

async function deleteEvent(id) {
    await fetch(`http://127.0.0.1:8000/events/${id}`, { method: "DELETE" });
    loadEvents();
}

// ── Helpers ───────────────────────────────────────────
function eventHTML(e) {
    return `
      <div class="event-item">
        <span class="event-time">${formatTime(e.start)}</span>
        <span class="event-title-text">${e.title}</span>
        <span class="delete-btn" onclick="deleteEvent('${e.id}')">✕</span>
      </div>`;
}

function formatTime(isoStr) {
    const d = new Date(isoStr);
    if (isNaN(d)) return "All day";
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ── Init ──────────────────────────────────────────────
setInterval(updateWeather, 60000);
setInterval(loadEvents, 300000);
updateWeather();
loadEvents();
