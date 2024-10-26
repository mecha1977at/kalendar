# Kalender-Widget mit Eleventy und DecapCMS

## Überblick

Dieses Projekt ist ein Kalender-Widget, das mit [Eleventy (11ty)](https://www.11ty.dev/), [DecapCMS](https://decapcms.org/) sowie benutzerdefiniertem HTML, CSS und JavaScript entwickelt wurde. Die Anwendung ermöglicht es Benutzern, verfügbare Termine einzusehen, einen Zeit-Slot auszuwählen und Termine in einer einfachen und intuitiven Benutzeroberfläche zu bestätigen.

## Funktionen

- **Dynamische Kalendergenerierung**: Der Kalender wird dynamisch generiert, sodass Benutzer den aktuellen Monat anzeigen und zwischen verschiedenen Monaten navigieren können.
- **Terminverwaltung**: Benutzer können verfügbare Slots anzeigen, eine Uhrzeit buchen und Termine bestätigen.
- **Responsives Design**: Der Kalender wurde nach dem Mobile-First-Prinzip erstellt, um eine Kompatibilität auf allen Geräten zu gewährleisten.
- **DecapCMS-Integration**: Das Projekt ist mit DecapCMS integriert, um die einfache Verwaltung von Inhalten zu ermöglichen.

## Installation

Um dieses Projekt lokal auszuführen, benötigen Sie Node.js und npm.

1. **Repository klonen**:

   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Abhängigkeiten installieren**:

   ```sh
   npm install
   ```

3. **Eleventy ausführen**:

   ```sh
   npx eleventy --serve
   ```

4. **Projekt aufrufen**:
   Öffnen Sie Ihren Webbrowser und navigieren Sie zu `http://localhost:8080`, um das Kalender-Widget anzuzeigen.

## Projektstruktur

- `.eleventy.js`: Konfigurationsdatei für Eleventy.
- `netlify.toml`: Konfiguration für die Bereitstellung auf Netlify.
- `package.json`: Enthält Abhängigkeiten und Skripte für das Projekt.
- `src/`: Enthält den Hauptcode für den Kalender, einschließlich HTML, CSS und JavaScript.
  - `index.html`: Haupt-HTML-Vorlage für das Kalender-Widget.
  - `assets/`: Enthält Styles und Skripte.
    - `styles/styles.css`: Styling für das Kalender-Widget.
    - `scripts/script.js`: JavaScript-Funktionalität für das dynamische Rendering des Kalenders und der Termine.
  - `_data/appointments.json`: Enthält die bereits gebuchten Termine.

## Verwendung

1. **Kalendernavigation**: Verwenden Sie die Pfeiltasten, um zwischen den Monaten zu navigieren.
2. **Datum auswählen**: Klicken Sie auf ein verfügbares Datum, um die Zeitslots anzuzeigen und auszuwählen.
3. **Termin buchen**: Wählen Sie einen Zeitslot und fügen Sie eine optionale Nachricht hinzu, um den Termin zu bestätigen.

## Voraussetzungen

- **Node.js**: Version 12 oder höher.
- **NPM**: Version 6 oder höher.
- **Eleventy**: Statischer Site-Generator, der zur Bereitstellung und Erstellung der Inhalte verwendet wird.

## Bereitstellung

Dieses Projekt kann auf Netlify oder jeder anderen Plattform bereitgestellt werden, die statisches Hosting unterstützt. Die Konfiguration für Netlify ist in der Datei `netlify.toml` enthalten.

## Entwicklungshinweise

- **Datenverwaltung**: Termine werden über eine JSON-Datei (`appointments.json`) verwaltet. Dies ist ein Platzhalter, und für die Verwendung in der Produktion wird eine Backend-Unterstützung benötigt.
- **DecapCMS**: Sie können DecapCMS für die einfache Verwaltung der Inhalte unter `/admin` aufrufen. Stellen Sie sicher, dass Sie die Authentifizierung (z. B. über Netlify Identity) konfigurieren, um das CMS abzusichern.

## Bekannte Probleme

- **Keine persistente Speicherung**: Termine werden derzeit im Speicher gespeichert und gehen nach einem Neuladen der Seite verloren. Eine Integration mit einem Backend ist erforderlich, um die Daten persistent zu speichern.
- **Zeitformatierung**: Alle Zeitslots müssen im Format `HH:MM` angegeben werden, damit die Buchungsfunktion korrekt arbeitet.

## Zukünftige Verbesserungen

- **Backend-Integration**: Hinzufügen eines Backends, um Termindaten über Sessions hinweg zu speichern.
- **Verbesserte UI/UX**: Verbesserungen für eine bessere Benutzererfahrung, einschließlich Animationen und Fehlerbehandlung.
- **Benachrichtigungen**: Integration von E-Mail-Benachrichtigungen für bestätigte Buchungen.

## Beitragende

Fühlen Sie sich frei, dieses Repository zu forken und Pull Requests einzureichen. Beiträge zur Verbesserung der Funktionalität und zur Lösung von Problemen sind jederzeit willkommen.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Sie können es nach Belieben verwenden.

## Danksagungen

- **Eleventy**: Für die Bereitstellung eines einfach zu verwendenden statischen Site-Generators.
- **DecapCMS**: Für die bequeme Integration zur Inhaltsverwaltung.
- **Netlify**: Für die einfache Bereitstellung und das Hosting.
