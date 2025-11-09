

# Technische Möglichkeiten von GPT Assistenten
## System Instructions
Die System Instructions können genutzt werden, um dem Assistant einen groben Rahmen zu geben, wie er sich verhalten soll, wie Tief ins Detail er mit seinen Antworten gehen soll und für welches Themenfeld er geschaffen ist.
## Files / File Search
Man kann dem Assistenten Textdateien hochladen damit er damit arbeiten kann. Der Assistant kann die Dateien, als Wissensquelle nutzen, um Themen über die er nicht viele informational hätte besser zu verstehen und spezifische Antworten zu geben.
## Code Interpreter
Der Code Interpreter wird dafür genutzt Python Code auszuführen, um Daten zu analysieren, Diagramme zu erstellen oder Berechnungen durchzuführen. Der Assistenten schreibt dann Python Code, um das resultat des Ausgeführten codes dem Nutzer auszugeben.
### Functions
Über Functions kann ein Assistent mit externen Systemen kommunizieren, oder man kann sich zurückgegebenen Daten strukturieren lassen. Das heisst der Assistant kann selbst API-Abfragen machen und die rückgabe verarbeiten.

# Ideen
## Kilter Assistant
Das Kilterboard ist ein standardisiertes Trainingsboard zum Bouldern.
Ein Assistant, der Boulder-Probleme auf dem standardisierten Kilterboard erstellt.
Der User soll einen Schwierigkeitsgrad von V0-V16 wählen. Daraufhin generiert der Assistant eine Kletterroute, indem er bestimmte Griffe auf dem Board auswählt.
Damit der Assistant nicht irgendein Bild generiert, wird ein Bild von einem Kilter Board hinterlegt. 
Das Ergebnis wäre dann das mitgegebene Bild mit den ausgewählten Griffen umkreist.

| *Kilter-Board Griffset*                            | *Generierter Boudler auf einem Kilter-Board*      |
|----------------------------------------------------|---------------------------------------------------|
| <img src="kilterboard.jpeg" width="200">           | <img src="kilterboard_generated.png" width="200"> |

## Dichter
Die Idee hierbei ist, dass der Assistant ein Gedicht auf Basis eines Dichters, eines Gedichttyps und eines Themas oder Bildes schreibt.
Zum Beispiel kann der Nutzer "Goethe", "Sonett" und "Wolf" angeben. Daraufhin generiert der Assistant ein neues Sonett über einen Wolf im Stil von Goethe.
Wenn man alternativ ein Bild anstelle von einem Thema mitgibt, wird das Thema aus dem Bild heraus analysiert.


## Yoda
Ein Assistant, der beliebige Texte und Files so umschreibt, als ob Yoda (aus Star Wars) sie geschrieben hätte.
Man gibt der KI einfach eine Textdatei oder einen Text und bekommt einen Text raus, der von Yoda geschrieben wurde.

## Nutzwertanalyse
| Kriterium                           | Gewichtung | Kilter Assistant | Dichter     | Yoda      |
|-------------------------------------|------------|------------------|-------------|-----------|
| Technische Umsetzbarkeit            | 50%        | 2 / 5            | 5 / 5       | 5 / 5     |
| Kreativität                         | 20%        | 5 / 5            | 3 / 5       | 3 / 5     |
| Nutzermehrwert / Nutzen             | 10%        | 5 / 5            | 3 / 5       | 1 / 5     |
| Interessante Funktionen (Bild/File) | 20%        | 5 / 5            | 4 / 5       | 4 / 5     |
| Gesamtpunktzahl (Ø gewichtet)       | **100%**   | **3.5 / 5**      | **4.2 / 5** | **4 / 5** |
*Nutzwertanalyse der Ideen*

## Auswertung
Wir haben und für den Dichter entschieden. Es kann mit Bildern und Text gearbeitet werden und ist gut umsetzbar.
Der Kilter Assistant ist leider mit den uns bekannten Mitteln technisch zu schwer umzusetzen.
Yoda ist ein Lustiges Idee doch scheint uns der Nutzen sehr begrenzt.

# Umsetzen

## Backend
Als Erstes wurde ein einfacher request an die OpenAI client.responses.create endpoint gemacht was sich als unkompliziert erwies. 
Dieser Endpoint wird in vielen Beispielen in der OpenAI Dokumentation für Textgeneration und Bildanalyse verwendet.
Nachdem es möglich war, erfolgreich eine Antwort vom Endpoint zu erhalten, haben wir überlegt, wie wir den API-Key einbauen.
Schlussendlich wurde entschieden, dass der User den API-Key selbst mitgeben muss. Das hat den Vorteil, dass der API-Key auf Seiten der Applikation nicht hinterlegt wird.
Durch diese Entscheidung haben wir uns bewusst auch dagegen entschieden, einen Assistenten aus dem Playground zu nutzen. 
Ein weiterer Grund keinen Assistenten zu nutzen, war, dass Assistenten nur mit dem API-Key des eigenen Accounts angesprochen werden können.
Stattdessen wird ein normales Modell (GPT 4o) angesprochen. Das Modell  4o eignet sich besonders für kreative Aufgaben und kann auch Bilder analysieren.

### Prompt
Die meiste Arbeit wurde in das Erstellen von den Systemprompts/Instructions gesteckt. 
Es gibt zwei unterschiedliche Prompts: einen für den Fall, dass ein Thema mitgegeben wird, und den anderen für den Fall, dass der User ein Bild anstelle des Themas mitgibt.

Zunächst wird die Rolle der KI definiert, in der festgelegt ist, wie sich die KI zu verhalten hat und was sie verarbeiten soll.
Danach wird der KI erklärt, was sie mit den Inputs des Users machen soll.
Als Letztes wird noch festgelegt, wie der Output strukturiert sein soll, und es wird ein Beispiel gegeben.
Der ganze Prompt ist als Anleitung aufgebaut, die befolgt werden soll. Damit sollen konsistente Ergebnisse erzielt werden.

### Anfrage
Wir sprechen den Endpoint OpenAI.responses.create an. Wir haben uns für das Model gpt-4o entschieden. Es soll gut für kreative Aufgaben sein und kann auch Bilder verarbeiten.
In dem Feld "instructions“ geben wir Anweisungen, womit das Model mit den vom User mitgegebenen Werten etwas anstellen soll und wie der Output aussehen soll. 
Wir belassen die Temperatur (Determinismuswert) hierbei auf dem Standardwert (1), was nach unseren Tests eine gute Balance zu sein scheint.

### Input Validierung
Das Modell zeigt Schwierigkeiten mit frei erfundenen Inputs oder wenn nicht existierende Gedichttypen angegeben werden.
Die Probleme zeigen sich im Outputformat, das nicht eingehalten wird.
Um dem entgegenzuwirken, wurde eine Inputvalidierung eingebaut. Die Inputs werden auch von der KI geprüft. Wenn die Inputs nicht verstanden werden, wird schlicht "false" zurückgegeben (ansonsten "true").
Um der KI so wenig Spielraum wie möglich zu geben, reduzieren wir die Temperature auf 0.0 (deterministische Antworten) und
die maximale Anzahl an Output-Tokens auf das zugelassene Minimum von 16 (wünschenswert wären 1 oder 2 Tokens). Die Tokenlimitierung bewirkt, dass nur so wenig Text wie möglich zurückgegeben werden kann. 
Da wir für die Validierung keine komplexen Anforderungen haben, reicht es, wenn wir ein kleineres, günstigeres und schnelleres Modell ansprechen. Wir nutzen hier das gpt-4o-mini.

Die Validierung mittels KI bringt die Vorteile mit sich, dass so auch Rechtschreibfehler kein Problem darstellen.
Auch hat der Nutzer dadurch mehr Möglichkeiten, verschiedene Dichter anzugeben, da es keine fixe Liste geben muss.
```python
client = OpenAI(api_key=api_key)
response = client.responses.create(
    model="gpt-4o-mini",
    instructions=validate_input,
    input=f"> Poet: {poet}\n> Poem Type: {type}",
    temperature=0.0,
    max_output_tokens=16
)
```
*Python-Code der Anfrage auf den OpenAI-Endpoint für die Inputvalidierung*

### Text to Speech
Als zusätzliches Feature haben wir eine Text-to-Speech-Funktion integriert, damit man sich das generierte Gedicht vorlesen lassen kann. Dazu nutzen wir die [Google Text-to-Speech-Library (gTTS)](https://pypi.org/project/gTTS/).

## Frontend
Das Frontend wurde mit TypeScript und dem Framework React umgesetzt.
Da man mit React nur schlecht ein modernes Design umsetzen kann, wurde [Material UI (MUI)](https://mui.com/material-ui/) verwendet.

### Design
MUI verwendet das Material Design von Google, welches ein recht modernes und einfach verständliches Design bietet.
Das Standard-Theme von MUI wurde nicht angepasst, da es für ein kleines Projekt ausreichend ist.

Das Backend unterstützt zwei Möglichkeiten, um Gedichte zu generieren. Diese werden mithilfe von zwei Tabs dargestellt.
Standardmässig kann der Benutzer eine Beschreibung des Themas eingeben. Bei Bedarf kann man den Tab wechseln, um ein Bild hochzuladen.

MUI ist auch für Mobilgeräte optimiert, was es zu einem Kinderspiel gemacht hat, auch ein gut verwendbares Mobildesign hinzubekommen.

### Eingaben
Der Benutzer kann mittels mehrerer Input-Felder die folgenden Daten eingeben:
- API Key
- Name des Poeten
- Typ des Gedichts

Für den API-Key wird ein Passwortfeld verwendet, damit der Key nicht sichtbar ist.
Für den Typ des Gedichts verwenden wir ein Free-Solo-Dropdown mit Autocomplete. Übersetzt bedeutet das:
Man hat eine Suchleiste mit Vorschlägen, kann jedoch seine eigenen verwenden.

Je nach dem Tab kann man anschliessend noch in ein Multiline-Textfeld das Thema genauer spezifizieren oder ein Bild hochladen.
Das Bild wird auch direkt als Vorschau dargestellt, damit man nicht aus Versehen das falsche auswählt.
Sollte das Ganze von einem Handy (oder Ähnlichem) benutzt werden, hat man auch die Option, direkt mit der Kamera-App ein Bild aufzunehmen.

### Ausgabe des Textes
Nachdem man `Generiern` gedrückt hat, beginnt die generierung des Textes, sowie die der Text to Speech (TTS) Audiodatei.
Nach dessen abschluss werden die letzten Ergebnisse unter dem Formular als formatiertes Markdown angezeigt.
Auch hat man die Möglichkeit die TTS Audiodatei abspielen zu lassen, für den Fall, dass man eine lange Ballade nicht selbst vorlesen möchte.

[//]: # (TODO Bilder hinzufügen)

# Auswertung
Die Umsetzung des Projektes war erfolgreich. Es ist möglich, Gedichte zu generieren, die die angegebenen Spezifikationen wie Thema/Bild und Gedichttyp einhalten. 
Den Poeten widerzuspiegeln, ist aus mehreren Gründen schwierig. Erstens: Viele Poeten haben einen ähnlichen Style oder den Style eines anderen Poeten angenommen. 
Zweitens: Manche Poeten haben nur wenige oder keine Gedichte eines gewissen Typs geschrieben.
Durch die Validierung der Inputs wird der KI das Generieren eines Gedichts erleichtert, da keine sinnlosen Inputs verarbeitet werden.
Das Frontend ist schlicht, aber intuitiv und ermöglicht eine einfache Nutzung der Applikation sowohl auf einem Computer als auch auf dem Handy.

Interessant für uns war, wie viele Einstellungen man bei einem Request an die OpenAI-API machen kann (temperature, top_p …) und wie stark diese Einstellungen den Output beeinflussen.
Auch eine relevante Erkenntnis ist, dass ein klar strukturierter Prompt und Instruktionen der KI enorm helfen, einen konsistenten Output zu generieren. Vor allem auch Sachen zu definieren, die nicht gemacht werden sollen, hat extrem geholfen.
Sehr interessant zu sehen war, dass unterschiedliche Modelle für unterschiedliche Aufgaben besser geeignet waren. Z. B. haben wir anfangs das GPT-4-mini genutzt, was Probleme hatte, die Dichter zu interpretieren.