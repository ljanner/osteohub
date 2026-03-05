# Fazit & Reflexion

## Was ist gut gelaufen?

### Cloudflare als Plattform-Entdeckung

Der grösste Gewinn dieses Projekts war die Entdeckung des Cloudflare-Ökosystems. Über die
Evaluationsphase hinweg habe ich diverse Hosting-Optionen verglichen - Vercel, Netlify, Render,
DigitalOcean - und war beeindruckt, wie weit die heutigen Plattformen gekommen sind: GitHub-
Integration, automatische Deployments, Preview-Branches, alles out-of-the-box. Dass ich am Ende bei
Cloudflare gelandet bin, lag am grosszügigen Free Tier und daran, dass Workers, D1 und Pages ein
stimmiges Gesamtpaket bilden. Für kleinere Projekte gibt es damit endlich eine überzeugende
kostenlose Lösung, die ich auch nach dem Modul weiter einsetzen werde.

Besonders positiv überrascht hat mich die lokale Entwicklung mit Wrangler. Das lokale D1-Setup
funktionierte reibungslos, Hot Reload war schnell, und ich konnte den gesamten Stack lokal testen,
ohne ständig in die Cloud deployen zu müssen.

### Element Dogfooding

OsteoHub war mein erstes eigenes Projekt mit der Open-Source-Variante von Element - normalerweise
arbeite ich als Library-Entwickler auf der anderen Seite und baue die Komponenten selbst. Die
Perspektive als Konsument war extrem wertvoll: Ich habe während der Arbeit an OsteoHub mehrere Bugs
upstream im Element-Repository gemeldet und gefixt. Das Dogfooding hat also nicht nur dem Projekt,
sondern auch dem Design-System selbst genützt.

### Drizzle ORM & moderner Angular-Stack

Drizzle war für mich ein Erstversuch - bewusst in der Beta-Version (v1.0.0-beta.15), da zum
Projektzeitpunkt noch kein stabiles 1.0-Release vorlag. Diese Entscheidung hat sich ausgezahlt:
keinerlei Stabilitätsprobleme, und die Type-Safety sowie die deklarative Schema-Definition haben
gut mit dem TypeScript-Ökosystem harmoniert. Der moderne Angular-Stack - Standalone Components,
Signals, Lazy Loading - fühlte sich produktiv und sauber an. In Kombination mit Vitest für Unit
Tests entstand ein Setup, das schnelle Feedback-Zyklen ermöglichte.

### Funktionale Vollständigkeit

Alle User-Stories sind umgesetzt und die App läuft produktiv unter [osteohub.ch](https://osteohub.ch)
und wurde aktiv getestet.

---

## Wo lagen die Herausforderungen?

### Die richtigen Tools finden

Die grösste zeitliche Investition floss in die Evaluation der Deployment-Infrastruktur. Ich wusste
von Anfang an, dass dieser Bereich für mich Neuland ist, und habe bewusst Zeit eingeplant, um
verschiedene Plattformen zu vergleichen. Rückblickend war das richtig: Die investierte Zeit hat sich
in ein fundiertes Verständnis für moderne Cloud-Hosting-Optionen übersetzt, das über dieses Projekt
hinaus Bestand hat. Trotzdem war es zeitlich spürbar - gerade der ursprüngliche Firebase-Prototyp
musste komplett verworfen werden, als sich zeigte, dass Firebase Authentication für whitelisted admin
Accounts schlicht ungeeignet war.

### Frontend-Architektur als Library-Entwickler

Als jemand, der primär Libraries entwickelt, war die Strukturierung einer vollständigen
Angular-Applikation eine Umstellung. Services, Components, Guards, Interceptors - diese Schichten
kennt man als Library-Entwickler eher abstrakt. In der Praxis habe ich anfangs einige typische
Fehler gemacht: zu viel Logik in Components statt in Services, unklare Zuständigkeiten zwischen
Komponenten. Erst durch mehrere Refactoring-Runden hat sich eine saubere Architektur
herauskristallisiert. Der Lerneffekt war hoch, aber es hat gezeigt, dass Applikationsentwicklung
und Library-Entwicklung unterschiedliche Denkweisen erfordern.

### m:m-Relationen mit Drizzle

So elegant Drizzle für einfache Queries ist - die Arbeit mit fünf m:m-Beziehungen war stellenweise
mühsam. Jeder Create- und Update-Vorgang erfordert das manuelle Management der Join-Tabellen
(löschen, neu anlegen), und die Query-API für verschachtelte Relations brauchte einiges an
Einarbeitung. Das war kein Bug in Drizzle, sondern liegt in der Natur von m:m-Beziehungen -
trotzdem war es der unangenehmste Teil der Backend-Entwicklung.

---

## Was würde ich das nächste Mal anders machen?

### Architektur vor Code

Der grösste Hebel wäre gewesen, die Frontend-Architektur im Voraus zu planen: Welche Services gibt
es? Welche Daten fliessen wo? Welche Komponenten sind dumm, welche smart? Stattdessen bin ich nach
dem Prinzip „baue, was du gerade brauchst" vorgegangen und habe die Struktur organisch wachsen
lassen. Das funktioniert für Prototypen, führt aber bei einer Applikation dieser Grösse zu
Refactoring-Runden, die man mit etwas Planung hätte vermeiden können. Nächstes Mal würde ich vor
dem ersten `ng generate` ein kurzes Architektur-Diagramm mit Service-Zuständigkeiten skizzieren.

### Expliziteres Error Handling

Die aktuelle Fehlerbehandlung funktioniert - Errors werden geworfen und als Toasts angezeigt.
Aber der Code liest sich an manchen Stellen wie eine Kette von Try-Catch-Blöcken, bei denen
nicht sofort klar ist, warum genau hier gefangen wird. Inspiriert durch „Clean Code" würde
ich nächstes Mal von Anfang an ein konsistentes Error-Handling-Muster etablieren: klare
Error-Typen, ein zentraler Error-Handler, und bewusste Entscheidungen, wo Fehler
behandelt vs. weitergereicht werden. Das hätte den Code lesbarer und die Fehlerflüsse
nachvollziehbarer gemacht.

### Backend-Tests von Anfang an

Die Frontend-Tests sind vorhanden, beim Backend habe ich darauf verzichtet. Für künftige Projekte
würde ich zumindest die Controller mit Integration Tests abdecken - gerade bei den komplexen
m:m-Operationen hätte das Sicherheit beim Refactoring gegeben.

---

## Gesamtfazit

OsteoHub hat seinen Zweck erfüllt: Es ist eine funktional vollständige, produktiv einsetzbare
Webapplikation, die auf einem modernen Stack aufbaut und sich an ein etabliertes Design-System
hält. Der grösste persönliche Mehrwert liegt nicht im fertigen Produkt, sondern in drei
konkreten Lernerfahrungen:

1. **Cloud-Hosting-Landschaft**: Ich kann jetzt fundiert zwischen Cloudflare, Vercel, Netlify und
   klassischem IaaS entscheiden - ein Skill, der in der Library-Entwicklung kaum vorkommt.
2. **Applikationsarchitektur**: Die Perspektive als Konsument des eigenen Design-Systems war
   augenöffnend und hat direkt zu Verbesserungen upstream beigetragen.
3. **Fullstack-Denken**: Die Verbindung von Frontend, Backend, Datenbank und Deployment als
   Gesamtsystem zu betrachten, war eine wertvolle Ergänzung zu meiner bisherigen Spezialisierung.

Die technischen Entscheidungen - insbesondere der Wechsel von Firebase zu Cloudflare - waren
rückblickend richtig und haben zu einer robusteren und besser wartbaren Lösung geführt.
