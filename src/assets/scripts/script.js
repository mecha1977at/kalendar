// Gebuchte Termine aus der JSON-Datei abrufen und im Kalender anzeigen
let bookedAppointments = []; // * Array zur Speicherung gebuchter Termine

fetch('_data/appointments.json')
  .then((response) => {
    console.log('Fetching appointments.json...'); // ? Ausgabe in der Konsole zum Verfolgen des Datenabrufs
    if (!response.ok) {
      console.error('Network response was not ok', response); // ! Ausgabe bei fehlgeschlagenem Netzwerkabruf
      throw new Error('Netzwerkantwort war nicht in Ordnung');
    }
    return response.json(); // ? JSON-Daten aus der Antwort parsen
  })
  .then((data) => {
    console.log('Appointments loaded:', data); // * Gebuchte Termine wurden erfolgreich geladen
    bookedAppointments = data.appointment || []; // * Korrigierter JSON-Pfad, um das richtige Array zu erreichen
    renderCalendar(); // * Kalender nach dem Laden der Termine rendern
  })
  .catch((error) => {
    console.error('Es gab ein Problem bei der Abrufoperation:', error); // ! Ausgabe bei Fehlern im Abrufprozess
  });

// Variablen für DOM-Elemente definieren
const monthYear = document.getElementById('monthYear');
const calendar = document.getElementById('calendar');
const selectedDateEl = document.getElementById('selectedDate');
const timeSlots = document.getElementById('timeSlots');
const confirmDateEl = document.getElementById('confirmDate');
const popup = document.getElementById('popup');
const messageEl = document.getElementById('message');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const weekdaysEl = document.getElementById('weekday');
let selectedTimeSlot = ''; // * Variable zur Speicherung des ausgewählten Zeit-Slots
let currentDate = new Date(); // * Aktuelles Datum für die Navigation speichern
let selectedDate = null; // Variable zur Speicherung des ausgewählten Datums

// Arbeitszeiten und Arbeitstage definieren
const workingHours = {
  start: 9 * 60, // * Startzeit in Minuten (9:00 Uhr)
  end: 17 * 60, // * Endzeit in Minuten (17:00 Uhr)
  days: [1, 2, 3, 4, 5], // * Arbeitstage sind Montag bis Freitag
};

// Funktion zum Rendern des Kalenders
function renderCalendar() {
  console.log('Rendering calendar...'); // ? Ausgabe zum Verfolgen des Kalender-Rendering-Prozesses
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // * Index des ersten Tages im Monat ermitteln
  const lastDate = new Date(year, month + 1, 0).getDate(); // * Letzter Tag des Monats ermitteln

  // Aktuellen Monat und Jahr im Header setzen
  const monthNames = [
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
  ];
  monthYear.innerText = `${monthNames[month]} ${year}`; // * Monat und Jahr im Header anzeigen

  // Wochentag-Header hinzufügen
  console.log('Rendering weekdays...'); // ? Debug-Ausgabe für die Wochentagsanzeige
  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  weekdaysEl.innerHTML = ''; // * Vorherige Wochentagsanzeige leeren
  weekdays.forEach((day, index) => {
    const daySpan = document.createElement('span');
    daySpan.classList.add('weekday'); // * Klasse für Wochentagsanzeige setzen
    daySpan.innerText = day;
    if (index === 5 || index === 6) {
      daySpan.classList.add('weekend'); // * Wochenende hervorheben
    }
    weekdaysEl.appendChild(daySpan); // * Wochentag zum DOM hinzufügen
  });

  console.log('Clearing previous calendar days...'); // ? Debug-Ausgabe für das Leeren des Kalenders
  calendar.innerHTML = ''; // * Kalender leeren

  // Leere Felder vor dem ersten Tag des Monats einfügen
  for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex - 1); i++) {
    const emptyDiv = document.createElement('div');
    calendar.appendChild(emptyDiv); // * Leeres Element für den Platz vor dem ersten Tag
  }

  console.log('Rendering days of the month...'); // ? Debug-Ausgabe für das Rendern der Tage
  // Tage des Monats hinzufügen
  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day'); // * Klasse für Tag hinzufügen
    dayDiv.textContent = day; // * Tageszahl setzen
    const formattedDate = new Date(year, month, day, 12, 0, 0)
      .toISOString()
      .split('T')[0]; // * Datum im Format YYYY-MM-DD, um Zeitzonenprobleme zu vermeiden

    // Überprüfen, ob der Tag gebucht ist
    if (bookedAppointments.some((appt) => appt.date === formattedDate)) {
      console.log(`Day ${day} is booked.`); // ? Debug-Ausgabe für gebuchte Tage
      dayDiv.classList.add('booked'); // * Klasse für gebuchte Tage hinzufügen
    } else {
      dayDiv.classList.add('available'); // * Klasse für verfügbare Tage hinzufügen
    }

    dayDiv.addEventListener('click', () => {
      console.log(`Day ${day} selected.`); // ? Debug-Ausgabe für ausgewählten Tag
      selectDate(year, month, day); // * Datum auswählen und Zeit-Slots rendern
    });
    calendar.appendChild(dayDiv); // * Tag zum Kalender hinzufügen
  }
}

// Funktion zum Auswählen eines Datums und Rendern der Zeit-Slots
function selectDate(year, month, day) {
  console.log(`Selecting date: ${day}-${month + 1}-${year}`); // ? Debug-Ausgabe für die Datumsauswahl
  selectedDate = new Date(year, month, day, 12, 0, 0); // * Ausgewähltes Datum speichern, Zeit explizit setzen, um Zeitzonenprobleme zu vermeiden
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  selectedDateEl.innerText = selectedDate.toLocaleDateString('de-DE', options); // * Ausgewähltes Datum anzeigen

  // Überprüfen, ob der ausgewählte Tag ein Arbeitstag ist
  if (workingHours.days.includes(selectedDate.getDay())) {
    renderTimeSlots(selectedDate); // * Zeit-Slots rendern, wenn es ein Arbeitstag ist
  } else {
    console.warn('Selected date is a weekend. No appointments available.'); // ! Warnung für Wochenend-Termine
    timeSlots.innerHTML =
      '<li>Termine sind am Wochenende nicht verfügbar. Bitte kontaktieren Sie uns per E-Mail für spezielle Anfragen.</li>'; // * Nachricht für Wochenenden anzeigen
  }
}

// Funktion zum Rendern der verfügbaren Zeit-Slots
function renderTimeSlots(selectedDate) {
  console.log('Rendering time slots for:', selectedDate); // ? Debug-Ausgabe für Zeit-Slots
  timeSlots.innerHTML = ''; // * Vorherige Zeit-Slots leeren
  const slots = generateTimeSlots(workingHours.start, workingHours.end); // * Zeit-Slots generieren
  const dateStr = selectedDate.toISOString().split('T')[0]; // * Datum im YYYY-MM-DD-Format

  slots.forEach((slot) => {
    const li = document.createElement('li');
    li.textContent = slot; // * Zeit-Slot anzeigen

    // Überprüfen, ob der Zeit-Slot bereits gebucht ist
    if (checkIfSlotIsBooked(selectedDate, slot)) {
      console.log(`Slot ${slot} is already booked.`); // ? Debug-Ausgabe für gebuchte Slots
      li.classList.add('booked'); // * Slot als gebucht markieren
      li.classList.add('disabled'); // * Slot als nicht auswählbar markieren
      li.setAttribute('aria-disabled', 'true'); // * Barrierefreiheit berücksichtigen
    } else if (checkIfSlotIsInBuffer(selectedDate, slot)) {
      console.log(`Slot ${slot} is within buffer time.`); // ? Debug-Ausgabe für Puffer-Slots
      li.classList.add('buffer'); // * Slot als Puffer markieren
      li.classList.add('disabled'); // * Slot als nicht auswählbar markieren
      li.setAttribute('aria-disabled', 'true'); // * Barrierefreiheit berücksichtigen
    } else {
      li.addEventListener('click', () => {
        console.log(`Slot ${slot} selected.`); // ? Debug-Ausgabe für ausgewählten Slot
        selectTimeSlot(slot); // * Zeit-Slot auswählen
      });
    }

    timeSlots.appendChild(li); // * Slot zur Liste hinzufügen
  });
}

// Funktion zum Überprüfen, ob ein Zeit-Slot bereits gebucht ist
function checkIfSlotIsBooked(selectedDate, slot) {
  const dateStr = selectedDate.toISOString().split('T')[0]; // * Datum im YYYY-MM-DD-Format
  const isBooked = bookedAppointments.some((appt) => {
    return appt.date === dateStr && appt.time === slot; // * Überprüfen, ob der Slot gebucht ist
  });
  console.log(`Checking if slot ${slot} on ${dateStr} is booked: ${isBooked}`); // ? Debug-Ausgabe für Buchungsprüfung
  return isBooked;
}

// Funktion zum Überprüfen, ob ein Zeit-Slot innerhalb der Pufferzeit liegt (30 Minuten vor/nach einem gebuchten Termin)
function checkIfSlotIsInBuffer(selectedDate, slot) {
  const dateStr = selectedDate.toISOString().split('T')[0]; // * Datum im YYYY-MM-DD-Format
  const slotMinutes = parseTime(slot); // * Zeit-Slot in Minuten umwandeln

  const isInBuffer = bookedAppointments.some((appt) => {
    if (appt.date === dateStr) {
      const bookedMinutes = parseTime(appt.time.replace('.', ':')); // * Korrigierte Zeitformatierung von '.' zu ':'
      const bufferBefore = bookedMinutes - 30; // * 30 Minuten vor dem gebuchten Termin
      const bufferAfter = bookedMinutes + 60; // * 30 Minuten nach Ende des 30-minütigen Termins
      return (
        slotMinutes >= bufferBefore &&
        slotMinutes < bufferAfter &&
        slotMinutes !== bookedMinutes // * Sicherstellen, dass der Slot nicht genau der gebuchte ist
      );
    }
    return false;
  });
  console.log(
    `Checking if slot ${slot} on ${dateStr} is in buffer: ${isInBuffer}`,
  ); // ? Debug-Ausgabe für Pufferprüfung
  return isInBuffer;
}

// Funktion zum Generieren von Zeit-Slots in 30-Minuten-Intervallen
function generateTimeSlots(startMinutes, endMinutes) {
  console.log(
    `Generating time slots from ${startMinutes} to ${endMinutes} minutes.`,
  ); // ? Debug-Ausgabe für Generierung der Slots
  const slots = [];
  for (let time = startMinutes; time < endMinutes; time += 30) {
    const hours = Math.floor(time / 60)
      .toString()
      .padStart(2, '0'); // * Stunden aus Minuten berechnen
    const minutes = (time % 60).toString().padStart(2, '0'); // * Minuten berechnen
    slots.push(`${hours}:${minutes}`); // * Slot im Format HH:MM hinzufügen
  }
  console.log('Generated slots:', slots); // ? Debug-Ausgabe der generierten Slots
  return slots;
}

// Funktion zum Parsen der Zeit im HH:MM-Format zu Minuten
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number); // * Stunden und Minuten extrahieren
  const totalMinutes = hours * 60 + minutes; // * Gesamtminuten berechnen
  console.log(`Parsed time ${timeStr} to ${totalMinutes} minutes.`); // ? Debug-Ausgabe der geparsten Zeit
  return totalMinutes;
}

// Funktion zum Auswählen eines Zeit-Slots und Anzeigen des Bestätigungspopups
function selectTimeSlot(slot) {
  console.log(`Time slot ${slot} selected.`); // ? Debug-Ausgabe für ausgewählten Zeit-Slot
  selectedTimeSlot = slot; // * Ausgewählten Slot speichern
  confirmDateEl.innerText = `Sie haben ausgewählt: ${selectedDate.toLocaleDateString(
    'de-DE',
    { weekday: 'long', month: 'long', day: 'numeric' },
  )} um ${slot}`; // * Bestätigungsnachricht anzeigen
  popup.classList.remove('hidden'); // * Popup sichtbar machen
}
// Funktion zum Speichern der kombinierten Termine auf dem Server
function saveAppointmentsToServer() {
  // Hole bestehende Termine aus appointments.json
  fetch('_data/appointments.json')
    .then((response) => response.json())
    .then((data) => {
      let existingAppointments = data.appointment || [];

      // Hole neue Termine aus dem sessionStorage
      let newAppointments =
        JSON.parse(sessionStorage.getItem('appointments'))?.appointment || [];

      // Kombiniere beide Terminlisten
      let combinedAppointments = existingAppointments.concat(newAppointments);

      // Sende die kombinierte Liste an den Server
      fetch('http://localhost:3000/update-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointment: combinedAppointments }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              'Fehler beim Aktualisieren der Termine auf dem Server',
            );
          }
          return response.text();
        })
        .then((result) => {
          console.log(
            'Termine erfolgreich auf dem Server aktualisiert:',
            result,
          );
          alert('Termine erfolgreich aktualisiert!');
        })
        .catch((error) => {
          console.error('Fehler beim Senden der Daten:', error);
        });
    })
    .catch((error) => {
      console.error('Fehler beim Abrufen der Termine:', error);
    });
}

// Event-Listener für die Bestätigung eines Termins
confirmBtn.addEventListener('click', function () {
  // Verwende das bereits gespeicherte ausgewählte Datum und den ausgewählten Zeit-Slot
  if (!selectedDate || !selectedTimeSlot || !messageEl.value) {
    alert(
      'Bitte füllen Sie alle Felder aus oder stellen Sie sicher, dass Datum und Zeit ausgewählt wurden.',
    );
    return; // Beende die Funktion, wenn Daten fehlen
  }

  // Hole vorhandene Termine aus dem sessionStorage (falls vorhanden)
  let appointments =
    JSON.parse(sessionStorage.getItem('appointments'))?.appointment || [];

  // Erstelle ein neues Termin-Objekt
  const newAppointment = {
    date: selectedDate.toISOString().split('T')[0], // Verwende das ausgewählte Datum im Format YYYY-MM-DD
    time: selectedTimeSlot.replace(':', '.'), // Verwende das ausgewählte Zeit-Slot und formatiere es passend zur JSON-Datei
    message: messageEl.value, // Verwende die eingegebene Nachricht
  };

  // Füge den neuen Termin zu der Liste hinzu
  appointments.push(newAppointment);

  // Speichere die aktualisierte Liste der Termine wieder im sessionStorage
  sessionStorage.setItem(
    'appointments',
    JSON.stringify({ appointment: appointments }),
  );

  // Zeige den neuen Status in der Konsole (zur Überprüfung)
  console.log('Updated appointments:', { appointment: appointments });

  // Schließe das Pop-up
  popup.classList.add('hidden');

  // Speichere die kombinierten Termine auf dem Server
  saveAppointmentsToServer();
});

// Beispiel-Funktion, die aufgerufen wird, wenn ein Datum im Kalender ausgewählt wird
function openPopupForDate(date) {
  // Setze das Datum im Pop-up und speichere das ausgewählte Datum
  selectedDate = new Date(date);
  confirmDateEl.innerText = `Datum: ${selectedDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })}`;

  // Öffne das Pop-up
  popup.classList.remove('hidden');
}

// Beispiel für den Event-Handler des "Cancel"-Buttons
cancelBtn.addEventListener('click', function () {
  // Schließe das Pop-up
  popup.classList.add('hidden');
});

// Event-Listener zum Abbrechen eines Termins
cancelBtn.addEventListener('click', () => {
  console.log('Appointment confirmation canceled.'); // ? Debug-Ausgabe für abgebrochene Terminbestätigung
  popup.classList.add('hidden'); // * Popup ausblenden
});

// Event-Listener für die Navigation zum vorherigen Monat
prevMonthBtn.addEventListener('click', () => {
  console.log('Navigating to previous month...'); // ? Debug-Ausgabe für die Navigation
  currentDate.setMonth(currentDate.getMonth() - 1); // * Monat verringern
  renderCalendar(); // * Kalender für den neuen Monat rendern
});

// Event-Listener für die Navigation zum nächsten Monat
nextMonthBtn.addEventListener('click', () => {
  console.log('Navigating to next month...'); // ? Debug-Ausgabe für die Navigation
  currentDate.setMonth(currentDate.getMonth() + 1); // * Monat erhöhen
  renderCalendar(); // * Kalender für den neuen Monat rendern
});

// ? Überprüfung und regelmäßiges Nachladen der Daten, um neu gebuchte Termine zu aktualisieren
setInterval(() => {
  console.log('Checking for updated appointments...');
  fetch('_data/appointments.json')
    .then((response) => {
      if (!response.ok) {
        console.error('Network response was not ok', response);
        throw new Error('Netzwerkantwort war nicht in Ordnung');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Updated appointments loaded:', data);
      bookedAppointments = data.appointment || [];
      renderCalendar();
    })
    .catch((error) => {
      console.error('Es gab ein Problem bei der Abrufoperation:', error);
    });
}, 60000); // Alle 60 Sekunden prüfen
sessionStorage.clear();
