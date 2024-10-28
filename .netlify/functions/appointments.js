const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const newAppointment = JSON.parse(event.body);

  // Stelle sicher, dass der Pfad zur appointments.json korrekt ist
  const filePath = path.resolve(__dirname, '../../src/_data/appointments.json');

  try {
    // Lese die bestehende appointments.json Datei
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let appointmentsData = JSON.parse(fileContent);

    // Füge den neuen Termin zur Liste hinzu
    appointmentsData.appointment.push(newAppointment);

    // Schreibe die aktualisierten Daten zurück in appointments.json
    fs.writeFileSync(filePath, JSON.stringify(appointmentsData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Appointment successfully saved' }),
    };
  } catch (error) {
    console.error('Error updating appointments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save appointment' }),
    };
  }
};
