// Node.js (Express) Beispiel zum Aktualisieren der appointments.json-Datei
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // CORS importieren

const app = express();
const filePath = path.join(__dirname, 'src', '_data', 'appointments.json');

app.use(cors()); // CORS für alle Ursprünge aktivieren
app.use(express.json());

app.post('/update-appointments', (req, res) => {
  const newAppointments = req.body.appointment;

  // Debug-Log, um die empfangenen Daten zu überprüfen
  console.log('Neue Termine empfangen:', newAppointments);

  // Überprüfen, ob die neuen Termine im richtigen Format vorliegen
  if (!Array.isArray(newAppointments)) {
    console.error('Fehler: Ungültiges Datenformat für neue Termine');
    return res.status(400).send('Ungültiges Datenformat für neue Termine');
  }

  // Lesen der bestehenden Termine
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Fehler beim Lesen der Datei:', err);
      return res.status(500).send('Fehler beim Lesen der Datei');
    }

    let appointments;
    try {
      console.log('Daten aus appointments.json:', data);
      appointments = JSON.parse(data).appointment || [];
    } catch (parseError) {
      console.error('Fehler beim Parsen der JSON-Datei:', parseError);
      return res.status(500).send('Fehler beim Parsen der JSON-Datei');
    }

    console.log('Vorhandene Termine:', appointments);

    // Zusammenführen der bestehenden und neuen Termine, wobei Duplikate vermieden werden
    newAppointments.forEach((newAppointment) => {
      // Prüfen, ob der neue Termin bereits in den bestehenden Terminen enthalten ist
      const exists = appointments.some(
        (appt) =>
          appt.date === newAppointment.date &&
          appt.time === newAppointment.time &&
          appt.message === newAppointment.message,
      );

      if (!exists) {
        appointments.push(newAppointment);
      }
    });

    console.log('Aktualisierte Termine (ohne Duplikate):', appointments);

    // Schreiben der aktualisierten Termine zurück in die Datei
    fs.writeFile(
      filePath,
      JSON.stringify({ appointment: appointments }, null, 2),
      'utf8',
      (err) => {
        if (err) {
          console.error('Fehler beim Schreiben der Datei:', err);
          return res.status(500).send('Fehler beim Schreiben der Datei');
        }
        console.log('Termine erfolgreich aktualisiert');
        res.send('Termine erfolgreich aktualisiert');
      },
    );
  });
});

app.listen(3000, () => {
  console.log('Server läuft auf Port 3000');
});
