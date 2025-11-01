# Doku

##  Technische Möglichkeiten von GPT Assistenten
https://chatgpt.com/share/68f8c433-f834-800c-bc17-439c498e033b
### System Instructions
Die System Instructions können genutzt werden um dem Assistant einen groben Rahmen zu geben wie er sich verhalten soll, wie Tief ins Detail er mit seinen Antworten gehen soll und für welches Themenfeld er geschaffen ist.
### Files / File Search
Man kann dem Assistenten Textdateien hochladen damit er damit arbeiten kann. Der Assistant kann die Dateien als Wissensquelle nutzen um Themen über die er nicht viele informational hätte besser zu verstehen und spezifische Antworten zu geben.
### Code Interpreter
Der Code Interpreter wird dafür genutzt Python Code auszuführen um Daten zu analysieren, Diagramme zu erstellen oder Berechnungen durch zu führen. Der Assistenten schreibt dann Python Code um das resultat des Ausgeführten codes dem Nutzer auszugeben.
### Functions
Über Functions kann ein Assistenten mit externene Systemen kommunizieren, oder man kann sich zurückgegebenen Daten strukturieren lassen. Das heisst der Assistant kann selbst API-Abfragen machen und die rückgabe verarbeiten.

## Ideen
### Kilter Assistant
Ein Assistant, der Boulder-Probleme auf dem standardisierten Kilter Board erstellt.
Der User soll einen Schwierigkeitsgrad von V0-V16 wählen. Daraufhin generiert der Assistant eine Kletterroute, indem er bestimmte Griffe auf dem Board auswählt.
Damit der Assistant nicht irgend ein Bild generiert wird ein Bild von einem Kilter Board hinterlegt. 
Das Ergebnis wäre dann das mitgegebene Bild mit den ausgewählten Griffen umkreist.

Bilder!!!!!

#### Auswertung
Das Kilter Board wird weltweit genutzt und ist wie schon erwähnt standardisiert. Deshalb könnte der Assistant wirklich benutzt werden.
Allerdings hat sich beim Testen, im OpenAI Playground, herausgestellt, dass das Bearbeiten von Bilder nicht gut funktioniert.
Auch die einschätzung des Schwierigkeitsgrades ist schwer da man auf Bildern nicht gut erkennt wie gut ein Griff ist.
Daher haben wir uns schlussendlich gegen die Idee entschieden.

### Dichter
Die Idee hierbei ist, dass der Assistant ein Gedicht auf basis eines Dichters, eines Gedichttyps und eines Themas oder Bildes schreibt.
Zum Beispiel kann der Nutzer "Goethe", "Sonett" und "Wolf" angeben, daraufhin generiert der Assistant ein neues Sonett über einen Wolf im Stil von Goethe.
Wenn man alternativ ein Bild anstelle von einem Thema mitgibt wird das Thema aus dem Bild heraus analysiert.

#### Auswertung
Diese Idee fanden wir besonders Geeignet für das Project da sowohl Text als auch Bild verwendet werden. Auch der Umsetzung stand Technisch nichts im Weg.
Bilder können gut analysiert werden und es gibt viele Gedichte von unterschiedlichen Dichtern. 
Schwierigkeiten könnten allerdings auftreten, wenn der gewählte Dichter nie in der angegebenen Gedichtform geschrieben hat, da der Stiel dann stark abweichen könnt.

### Yoda
Der Assistant der beliebige Texte und Files so umschreibt, als ob Yoda (aus Star Wars) sie geschrieben hätte.
Man gibt der KI einfach eine Text-Datei oder ein Text und Bekommt einen Text raus der von Yoda geschrieben wurde.

#### Auswertung
Die Idee fanden wir lustig. Die technische Umsetzung währe gut möglich gewesen und hätte interessante Aspect wie das Auslesen und Schreibe von Dateien beinhalted.
Wir haben uns dagegen entschieden da wir einen sehr geringen Nutzen sahen.

## Umsetzen
### Setup
Da es eine Gruppen arbeit war, wurde damit gestartet ein Git-Repository anzulegen. Für das Dependencies-Management im Backend benutzen wir Poetry und im Frontend Jarn.

### Backend
Als erstes wurde ein einfacher request an die OpenAI chat.completion.crate endpoint gemacht was weiter nicht kompliziert war. 
Nach dem möglich war eine Antwort (Antwort auf irgend eine frage) vom Endpoint zu kriegen, wurde überlegt wie wir den API-Key einbauen.
Wir haben uns dazu entschieden, dass der User den API-Key selbst mitgeben muss, dass bringt Vorteile mit sich, das der API-Key, auf unserer Seite, nirgends gespeichert werden muss.
Auch haben wir uns mit der Obigen entscheidung gleich dagegen entschieden den Assistent, aus dem Playground, zu nutzen. 
Assistent können nämlich nur mit dem API-Key des eigenen Account angesprochen werden.
Da wir eher eine kleine Web-App in gedanken hatten war das natürlich völlig unsinnig. Stattdessen wird ein normales Modell (GPT 4.1 mini) angesprochen, das auch Bilder analysieren kann.
Die meiste arbeit wurde in das erstellen von den Systemprompts gebraucht. 
Es gibt zwei unterschiedliche Prompts einen für den fall, dass ein Thema mitgegeben wird, und der Andere für den fall, dass der User ein Bild anstelle des Themas mit gibt.
#### Prompt
Als erstes wird die Rolle des Assistants definiert hier wird ihm erklärt wie er sich verhalten soll und was er verarbeiten soll.
Danach wird dem Assistent erklärt was er mit dem Input des Users machen soll.
Als letztes wird ihm noch gesagt wie der Output strukturiert werden soll und ein Beispiel.
Der ganze prompt ist wie eine Anleitung aufgebaut die befolgt werden soll. Damit die Outputs möglichst ähnlich bleiben.

### Frontend

## Auswerten

