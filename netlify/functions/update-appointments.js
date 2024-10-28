const fs = require('fs');
const path = require('path');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Neuer Termin aus dem Body der POST-Anfrage extrahieren
  const newAppointment = JSON.parse(event.body);
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'src',
    '_data',
    'appointments.json',
  );

  try {
    // appointments.json lesen
    let data = fs.readFileSync(filePath, 'utf8');
    let appointments = JSON.parse(data);

    // Neuen Termin hinzufügen
    appointments.appointment.push(newAppointment);

    // appointments.json Datei mit den neuen Daten überschreiben
    fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Termin erfolgreich gespeichert!' }),
    };
  } catch (error) {
    console.error('Fehler beim Speichern des Termins:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fehler beim Speichern des Termins' }),
    };
  }
};
