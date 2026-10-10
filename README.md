# tutors_webp

Statyczna jednostronicowa strona korepetytora matematyki i fizyki (PL/EN). Bez budowania: otwórz `index.html`.

## Edytor strony (`editor.html`)

Prosty wizualny edytor strony, coś w rodzaju małego Figma. Otwórz `editor.html` w Chrome lub Edge, w tym samym folderze co `index.html`.

- **Podgląd na żywo** w trzech rozmiarach (komputer / tablet / telefon) i w obu językach.
- **Podświetlanie:** gdy najedziesz na dowolną opcję, podgląd obrysowuje na niebiesko elementy, które ta opcja zmienia (wyłączane przełącznikiem „Pokazuj, co zmienia"). Żółta kropka oznacza ustawienie zmienione względem oryginału, ↺ cofa je.
- **Styl:** gotowe palety, kolory, czcionki, kształt kart i przycisków, odstępy, szerokość treści, układ górnej części, kafelki ofert, przyklejony przycisk, animacje.
- **Sekcja:** tło sekcji, dodatkowy odstęp, ukrywanie całej sekcji i pojedynczych elementów.
- **Tekst:** kliknij napis w podglądzie, aby zmienić jego treść (PL i EN), rozmiar, grubość i kolor.
- **Treść:** nazwa marki, zdjęcie, dokąd prowadzą główne przyciski, telefon (z opcją pokazania od razu), e-mail, LinkedIn, link do kalendarza Google, logo narzędzi (Discord, Miro, Google Meet, Zoom, Teams, Skype, WhatsApp), opinie (do 6).
- **Zmiany:** lista wszystkiego, co różni się od oryginału, z cofnięciem każdej zmiany osobno.
- Lewy panel: kolejność sekcji (przeciąganie lub strzałki), oko ukrywa sekcję, strzałka rozwija jej elementy.
- Cofnij / ponów (Ctrl+Z / Ctrl+Shift+Z), „Przytrzymaj: oryginał" do porównania, automatyczny szkic.

### Zapis i git

**Zapisz** (Ctrl+S) zapisuje plik `site-config.js` w folderze projektu (przy pierwszym zapisie wskaż plik obok `index.html`). To zwykły plik tekstowy, więc zmiany widać w `git diff` i zapisuje się je zwykłym commitem. Gdy przeglądarka nie pozwala zapisać pliku, edytor pobiera go, a Ty podmieniasz go ręcznie.

Strona czyta `site-config.js` przez `site-customize.js`. Pusty plik oznacza wygląd domyślny. Wartości są walidowane przy wczytaniu (kolory hex, lista czcionek, zakresy liczb, adresy https, teksty tylko z `<br>`, `<em>`, `<strong>`).

Poza edytorem zostają: kilka jasnych odcieni zapisanych na sztywno w `styles.css` oraz adres kalendarza i numer telefonu w `calendar-config.js` (edytor może je nadpisać w zakładce Treść).
