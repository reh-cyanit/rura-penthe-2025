# Changelog & Entscheidungsprotokoll

Dieses Dokument fasst eine Arbeitssitzung mit Claude Code zusammen: was geändert
wurde, und vor allem *warum* — damit eine nachfolgende Sitzung (Mensch oder KI)
nicht dieselben Fragen erneut klären muss.

## 1. Neue Features

### Icons in den Collapsible-Buttons
- `Collapsible` ([collapsible.ts](src/app/components/collapsible/collapsible.ts))
  hat ein neues optionales `@Input() icon` (Bildpfad als String) bekommen.
  Nur wenn `icon` gesetzt ist, wird ein `<img>` gerendert (`@if (icon)`).
- Icon steht **hinter dem Titel**, nicht hinter dem "öffnen/schließen"-Label —
  dafür wurden Titel+Icon in ein eigenes `<span class="title-group">` gepackt,
  weil `.btn` per `justify-content: space-between` nur zwei Flex-Kinder sauber
  auseinanderschiebt (Titel-Gruppe links, Status-Label rechts).
- Größe: 24×24px, `object-fit: contain`, 12px Abstand zum Titel — als **echtes
  CSS** in [collapsible.css](src/app/components/collapsible/collapsible.css),
  nicht als Utility-Klassen.
- **Wichtige Erkenntnis:** Das Projekt hat **kein Tailwind CSS** eingebunden
  (keine `tailwind.config.*`, kein `@tailwind`-Import). Klassen wie `h-6 w-6`,
  `flex`, `gap-3`, `w-[300px]` etc. sind im gesamten Projekt wirkungslos toter
  Code, auch wenn sie wie Tailwind aussehen. Deshalb wurde die Icon-Größe über
  eine eigene CSS-Klasse (`.icon-img`) gelöst statt über Utility-Klassen.
  → **Offener Punkt:** [collapsible.html:1](src/app/components/collapsible/collapsible.html#L1)
  hat immer noch die wirkungslosen Klassen `flex flex-col gap-3 w-[300px] max-w-[300px]`
  auf dem äußeren Wrapper-Div stehen (aus der Zeit vor dieser Erkenntnis). Nicht
  mehr im Rahmen dieser Sitzung angefasst, sollte aber bei Gelegenheit durch
  echtes CSS ersetzt oder entfernt werden.
- Einheitliche Button-Höhe unabhängig davon, ob ein Icon vorhanden ist:
  `min-height: 24px` auf `.title-group`.

### Responsives Banner
- [rura-penthe.css](src/app/pages/rura-penthe/rura-penthe.css): `.carousel-inner img`
  bekommt `width: 100%; height: 100%; object-fit: cover;` — das Bild skaliert
  jetzt mit der Seitenbreite statt in Originalgröße zu bleiben.
- Die alte `.title`-Regel (Überschrift über dem Banner) wurde entfernt, weil das
  zugehörige `<div class="title">` schon vorher aus dem HTML entfernt worden war
  (Banner ist jetzt reines `<img>`), die CSS-Regel war also toter Code.

### Countdown zur Zeitkapsel
- [time-capsule.ts](src/app/pages/time-capsule/time-capsule.ts): Der
  ursprüngliche Code `new Date(29.02.2028, 12)` war **kein gültiges
  JavaScript** (zwei Dezimalpunkte in einem Zahlenliteral). Ersetzt durch
  `new Date(2028, 1, 29, 12, 0, 0)` (Monat ist 0-indiziert → 1 = Februar).
- Countdown zeigt Tage/Stunden/Minuten/Sekunden als `computed()`-Signale,
  gespeist von einem `remainingMs`-Signal, das per `setInterval` (1s) aktuell
  gehalten wird. Cleanup über `ngOnDestroy` (`clearInterval`), analog zum
  bestehenden Muster mit `ResizeObserver` in `Collapsible`.

## 2. Aufräumarbeiten (toter Code / ungenutzte Ressourcen)

Ausgangspunkt war eine vollständige Analyse auf Wunsch des Nutzers. Entfernt:

- **Komplett totes Root-Component** `App` (`app.ts`/`.html`/`.css`) +
  `app.routes.ts`: Die App bootstrapt in [main.ts](src/main.ts) direkt
  `RuraPenthe`, nie `App`. Folge: `provideRouter()` und der `routes`-Import
  wurden auch aus [app.config.ts](src/app/app.config.ts) entfernt — Routing
  wird im gesamten Projekt nicht genutzt.
- `RuraPenthe` ([rura-penthe.ts](src/app/pages/rura-penthe/rura-penthe.ts)):
  ungenutzte Importe `RouterOutlet`, `CdkAccordionModule` entfernt, ebenso das
  wirkungslose `<router-outlet/>` im Template.
- [collapsible-content.ts](src/app/components/collapsibleContent/collapsible-content.ts):
  ungenutzte Importe `Termin`, `WhatsIs` entfernt (unnötige Abhängigkeit einer
  generischen UI-Komponente auf konkrete Seiten).
- [calculator.ts](src/app/pages/calculator/calculator.ts): ungenutzte Importe
  `NgModule`, `LOCALE_ID` entfernt.
- `public/rp_banner.jpg` gelöscht (durch `rurapenthe-endor_banner.jpg` ersetzt,
  alte Datei wurde nirgends mehr referenziert).
- Google-Fonts-Link "Material Icons" aus [index.html](src/index.html) entfernt
  (wurde geladen, aber nirgends im Projekt verwendet).

## 3. Abhängigkeits-Updates

Kernregel bei allen Updates: **nicht blind auf "latest" gehen**, sondern die
tatsächlichen Peer-Dependency-Constraints der Angular-Toolchain prüfen. Das hat
mehrfach zu Fehlern geführt, die sonst unbemerkt geblieben wären:

| Paket | Vorher | Nachher | Warum genau diese Version |
|---|---|---|---|
| `@angular/core`, `-common`, `-router`, `-forms`, `-compiler`, `-platform-browser` | 20.3.6 | 21.2.23 | `ng update` empfohlene stabile Version |
| `@angular/cli`, `@angular/build` | 20.3.6 | 21.2.24 | passend zu core |
| `@angular/cdk`, `@angular/material` | 20.2.10 | **21.2.14** (nicht 22.x!) | `npm outdated` zeigte 22.1.7 als "latest", aber Material 22 verlangt Angular Core v22, den es stabil noch nicht gibt. `ng update` selbst schlug korrekt 21.x vor. |
| `angular-eslint` | 20.4.0 | **21.4.0** (nicht 22.5.0!) | Gleiches Problem: `ng update` schlug initial 22.5.0 vor, das ist aber für Angular v22 gedacht (`ng lint` warnte explizit: "angular-eslint v22 is intended for Angular v22"). Mit v22 kam zusätzlich ungewollt `@angular-devkit/core@22.1.8` als transitive Dependency mit `EBADENGINE`-Warning (verlangt neuere Node-Version) ins Projekt. Nach Downgrade auf 21.4.0 verschwand das Problem. |
| `typescript` | 5.9.3 | **5.9.3 (unverändert!)** | `npm outdated` zeigte 7.0.2 als "latest". Tatsächlich verlangt `@angular/build@21.2.24` per Peer-Dependency `typescript >=5.9 <6.0` — sowohl 6.0.3 als auch 7.0.2 hätten den Build gebrochen. Das wurde durch einen fehlgeschlagenen `npm install` mit `--save-dev` konkret nachgewiesen, nicht nur vermutet. |
| `zone.js` | 0.15.1 | 0.16.3 | im von `@angular/core` erlaubten Bereich (`~0.15.0 \|\| ~0.16.0`) |
| `eslint` | 9.37 | 10.11 | von `angular-eslint` unterstützt (`^9.0.0 \|\| ^10.0.0`) |
| `typescript-eslint` | 8.46 | 8.70 | unproblematisch, reines Devtool |
| `@types/jasmine`, `jasmine-core`, `karma-jasmine-html-reporter` | älter | aktuell | keine Spec-Dateien im Projekt vorhanden → risikolos |
| `@eslint/js` | *(fehlte in package.json!)* | `^10.0.1` neu ergänzt | War nie explizit als Dependency eingetragen, sondern kam zufällig über eine transitive Hoisting-Kette mit. `ng lint` war dadurch **vor dieser Sitzung bereits kaputt** ("Cannot find module '@eslint/js'") — nach dem sauberen Neu-Aufbau von `node_modules` fiel das auf und wurde behoben. |

Verifiziert nach jedem größeren Schritt mit `ng build` und zusätzlich einmal
per Playwright-Screenshot im laufenden Dev-Server (u.a. Material-Radiobuttons/
-Select im Kalkulator nach dem Zwei-Major-Sprung von Angular Material).

## 4. Code-Qualität (ESLint)

`ng lint` war zunächst wegen der fehlenden `@eslint/js`-Dependency komplett
kaputt (siehe oben). Nach der Reparatur meldete es 14 echte, vorbestehende
Probleme — alle behoben:

- Ungenutzter Import `ɵunwrapWritableSignal` in `collapsible.ts`.
- Überflüssige Typ-Annotationen bei Literalen (`: string = ""` → `= ""`) in
  `collapsible.ts` und `calculator.ts` (5×).
- `any`-Typen bei Event-Handlern in `calculator.ts` → ersetzt durch die
  korrekten Material-Typen `MatSelectChange` und `MatRadioChange`.
- `let` statt `const` bei nie neu zugewiesenen Variablen in `calculator.ts`.
- Fehlendes `alt`-Attribut am Banner-`<img>` in `rura-penthe.html`
  (Barrierefreiheit).
- Fehlende Tastatur-Erreichbarkeit beim `(click)`-Handler auf einem `<a>` ohne
  `href` in `termin.html` → ergänzt um `role="button"`, `tabindex="0"` und
  `(keydown)="handleClick($event)"` (die Methode `handleClick` unterstützte
  Keyboard-Events bereits, war im Template nur nicht verdrahtet).

## 5. Sicherheit & Datenschutz

Auf Wunsch des Nutzers wurde das Projekt gezielt auf Sicherheits-/
Datenschutzprobleme geprüft (kein Backend, keine Auth → kleine Angriffsfläche,
Fokus auf Client-Side-Risiken):

- **Reverse Tabnabbing behoben** — [termin.html](src/app/pages/termin/termin.html):
  Externer Link hatte `target=”_blank”` mit typografischen (curly) statt
  geraden Anführungszeichen, wodurch `_blank` nicht als reserviertes Schlüsselwort
  erkannt wurde, **und** fehlendem `rel="noopener noreferrer"`. Beides behoben.
- **Google Fonts selbst gehostet** — vorher wurden Roboto und Orbitron per
  `<link>` von `fonts.googleapis.com` geladen, wodurch bei jedem Seitenaufruf
  die Besucher-IP an Google (USA) übertragen wurde. Das widersprach der
  eigenen Aussage im [Impressum](src/app/pages/impressum/impressum.html)
  ("Es werden keine Daten erhoben"). In Deutschland ist das ein bekanntes
  Abmahnrisiko (mehrere Landgerichte haben ungefragtes Google-Fonts-Laden als
  DSGVO-Verstoß gewertet).
  - Umsetzung: Beide Schriften liegen bei Google inzwischen als **Variable
    Fonts** vor — eine einzige `.woff2`-Datei pro Familie deckt über die
    `wght`-Achse alle benötigten Schriftschnitte ab. Es mussten nur 2 Dateien
    heruntergeladen werden (`public/fonts/roboto-latin-var.woff2` ~43 KB,
    `public/fonts/orbitron-latin-var.woff2` ~12 KB), dazu 8 `@font-face`-Regeln
    in [styles.css](src/styles.css) (3× Roboto-Gewichte, 5× Orbitron-Gewichte,
    alle auf dieselbe jeweilige Datei zeigend).
  - Die beiden `<link>`-Tags wurden aus `index.html` entfernt.
  - Verifiziert per Playwright: keine Netzwerk-Requests mehr an `fonts.g*`,
    Schriftbild optisch identisch zu vorher.
- `npm audit`: 16 Schwachstellen, aber **0 in Produktions-Dependencies**
  (`npm audit --omit=dev` → 0 Treffer). Alle 16 stecken ausschließlich in der
  Karma-Test-Toolchain (socket.io/ws/browserslist-Kette) und erreichen nie das
  ausgelieferte Bundle. Nicht behoben, da geringes Risiko und `npm audit fix`
  potenziell die gerade sorgfältig austarierten Dev-Dependency-Versionen
  wieder durcheinanderbringen könnte — bei Bedarf gezielt einzeln prüfen.

## 6. Offene Punkte für die nächste Sitzung

- `collapsible.html` (Zeile 1) enthält noch wirkungslose Pseudo-Tailwind-Klassen
  (`flex flex-col gap-3 w-[300px] max-w-[300px]`) — sollte durch echtes CSS
  ersetzt oder entfernt werden (siehe Abschnitt 1).
- `#colTimeCapsule` ist im Template von [rura-penthe.html](src/app/pages/rura-penthe/rura-penthe.html)
  vorhanden, hat aber kein zugehöriges `@ViewChild` in `rura-penthe.ts` und wird
  in `openCollapsible()` nicht mitgeschlossen, wenn der Kalkulator geöffnet
  wird. Nicht behoben, da unklar war, ob das gewünscht ist.
- `npm audit` zeigt 16 Dev-only-Schwachstellen (siehe Abschnitt 5) — bewusst
  nicht automatisch gefixt.
- Es existieren keine `*.spec.ts`-Testdateien im Projekt. `ng test` liefert
  entsprechend keine echte Abdeckung.
