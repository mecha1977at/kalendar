const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Parse die Anfrage, um die gesendeten Daten zu erhalten
    const newAppointment = JSON.parse(event.body);

    // Pfad zur appointments.json Datei
    const filePath = path.resolve(
      __dirname,
      '../../src/_data/appointments.json',
    );

    // Lese die bestehende appointments.json Datei
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let appointmentsData = JSON.parse(fileContent);

    // Füge den neuen Termin hinzu
    appointmentsData[0].appointment.push(newAppointment);

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
