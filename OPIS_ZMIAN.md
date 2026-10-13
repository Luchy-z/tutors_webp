# Nowa wersja strony: redesign UI/UX, kalendarz i edytor — opis zmian

Ta paczka to propozycja alternatywnej wersji wyglądu i UX Twojej strony oraz proste narzędzie (`editor.html`), które pozwala zmieniać wygląd i teksty bez dotykania kodu. **Treść (teksty, ceny, opinie) celowo zostaje bez zmian**, to makieta do uzupełnienia. Zmiany dotyczą warstwy wizualnej, układu i interakcji. Możesz porównać ją ze swoją wersją i zdecydować, która jest lepsza.

## 1. Co w oryginalnej wersji jest dobre

- **Spójny język wizualny.** Kremowe tło, ciemna zieleń i limonkowy akcent dają rozpoznawalny, „przyjazny edukacyjnie” charakter, bez korporacyjnego niebieskiego.
- **Hero z portretem w łuku** (organiczna plama, mała notatka „∑”) to najmocniejszy element. Ma osobowość i dobrze komunikuje „człowiek, nie platforma”.
- **Zaznaczenie w nagłówku** (podkreślenie markerem) to zgrabny, subtelny akcent.
- **Spójne zaokrąglenia i cienie** (karty 15 do 20 px, przyciski „pill”). Wszystko wygląda jak z jednego systemu.
- **Rytm sekcji:** jasne sekcje, jedna ciemna z cytatem i kontakt dają przewidywalne tempo przewijania.
- **Dobre podstawy dostępności:** `<table>` z `caption`, `aria-expanded` na przyciskach, `prefers-reduced-motion`, zapamiętywanie języka.
- **Rozsądna logika w JS:** walidacja adresu kalendarza i numeru telefonu, brak zależności, brak etapu budowania.
- **Dwie wersje językowe** z automatycznym wyborem języka przeglądarki.

## 2. Co według mnie wymagało poprawy

### Wygląd i UX

| Problem | Dlaczego to ma znaczenie |
|---|---|
| Typografia za drobna: 9 do 11 px w wielu miejscach (opisy, tabela cennika, stopka), `letter-spacing` do -5 px | Nieczytelne na telefonie, polskie znaki przy tak ciasnym trackingu wyglądają gorzej. |
| Płaska hierarchia przycisków: wszystkie CTA to ten sam ciemnozielony „pill” z „↗” | Główne działanie (rezerwacja) nie wyróżnia się od pobocznych. „↗” sugeruje link zewnętrzny, a prowadzi do kotwicy. |
| Ikony jako znaki Unicode (✳ ∑ ◉ ☎ ◷ ☰) | Wyglądają inaczej na różnych systemach i czcionkach, czytniki ekranu odczytują je dosłownie. |
| Karty ofert wizualnie jednostajne, cennik jako tabela | Środek strony jest monotonny. Tabela wygląda jak arkusz kalkulacyjny na tle „miękkiej” reszty. |
| Brak widocznego stanu `:focus` | Nawigacja klawiaturą jest praktycznie niewidoczna (WCAG 2.4.7). |
| Małe cele dotykowe (linki w nawigacji, `.small-link`, linki w stopce, przełącznik języka) | Poniżej 44 px (zalecenie Apple, NN/g) i trudne do trafienia kciukiem. WCAG 2.5.8 wymaga min. 24 px. |
| Menu mobilne: tylko do 600 px, bez Esc i zamykania po kliknięciu poza menu, ikona jako znak tekstowy | Na tabletach nawigacja się nie mieści. |
| Kilka szarości o kontraście około 3 do 3,8:1 przy 9 do 10 px | Poniżej wymaganego 4,5:1 dla małego tekstu. |
| Iframe kalendarza Google 620 do 680 px na telefonie | Zagnieżdżone przewijanie w środku strony, trudne do obsługi kciukiem. |
| Brak przyklejonego CTA na długiej stronie mobilnej | Po przewinięciu użytkownik nie ma pod ręką głównej akcji. |
| Efekty hover „przyklejają się” po dotyku | Karty i przyciski zostają uniesione na ekranach dotykowych. |
| Obraz w hero bez `width`/`height` | Skok układu przy ładowaniu. |
| Brak favikony | Karta w przeglądarce bez ikony. |

### Treść i spójność (poza zakresem tego PR, ale warto zauważyć)

- Brak numeru telefonu i widoczne placeholdery („Add price”, notatka „Replace … before publishing”) w wersji EN.
- Wersje PL i EN to praktycznie dwie różne strony (inna oferta, inne bio, inna marka).
- Sekcja „Opinie” zawiera cytat własny, a nie opinie klientów.
- Główny przycisk w menu prowadzi w PL do kontaktu, a w EN do rezerwacji.
- Wersja językowa wybierana w JS po załadowaniu: krótki „flash” angielskiego, a wyszukiwarki widzą wersję EN.
- Martwy kod po starszej wersji (`service-area*.js`, część stylów, nieużywane klucze tłumaczeń), `llms.txt` jest nieaktualny.

## 3. Co zrobiłem

### 3.1 Wygląd i UX (`index.html`, `styles.css`, `app.js`)

- **Skala typograficzna:** min. 12 do 13 px dla drobnych napisów, 15 do 16 px dla treści na telefonie, tracking nagłówków -0,03 em zamiast -5 px.
- **Hierarchia przycisków:** główny jest limonkowy z ciemną obwódką i „naklejkowym” cieniem, drugorzędny to kontur. „↗” zostaje tylko przy linkach zewnętrznych, kotwice mają „→” lub „↓”.
- **Ikony SVG** (sprite w `index.html`) zamiast znaków Unicode, z `aria-hidden`.
- **Karty ofert w układzie kafelkowym (bento):** pierwsza duża i ciemna, dwie mniejsze obok. Można wyłączyć w edytorze.
- **Cennik jako dwie karty** (online / stacjonarnie) z dużą ceną. Narzędzia pokazane jako chipy, nie jako linki prowadzące na strony główne usług.
- **Dostępność:** `:focus-visible`, cele dotykowe min. 44 px, `aria-controls` w menu, Esc i kliknięcie poza menu zamykają je, hamburger do 900 px, efekty hover tylko tam, gdzie jest mysz, przyciemniona szarość w stopce.
- **Przyklejony przycisk rezerwacji na telefonie** (chowa się, gdy widać inne przyciski rezerwacji lub kontakt).
- **Animacje:** „rysowanie” podkreślenia w nagłówku i delikatne wjeżdżanie sekcji. Przy `prefers-reduced-motion` wyłączone.
- **Obraz w hero** z `width`/`height` i `fetchpriority="high"`, **favicona** (zmienia kolor razem z akcentem).

### 3.2 Kalendarz rezerwacji

- **Komputer:** dwie karty. Lewa: plakietka „60 minut · online”, trzy kroki rezerwacji, przycisk. Prawa: ramka z paskiem tytułu i linkiem „Otwórz w nowej karcie”, szary szkic na czas ładowania.
- **Telefon (do 800 px):** zamiast długiego osadzonego iframe jest karta z krokami i dużym przyciskiem otwierającym stronę rezerwacji Google w nowej karcie. Iframe w ogóle się wtedy nie ładuje.
- Wnętrza kalendarza Google nie da się ostylować (osobna strona). Jego kolor ustawia się w Kalendarzu Google.

### 3.3 Nowe elementy strony

- **Logo narzędzi** (Discord, Miro, Google Meet, Zoom, Teams, WhatsApp) z [Simple Icons](https://simpleicons.org/) (CC0).
- **Sekcja „Opinie”** (do 6 opinii), widoczna dopiero po dodaniu pierwszej. Link „Opinie” w menu prowadzi do niej.
- **Przycisk „Napisz e-mail”** w kontakcie (pojawia się po wpisaniu adresu) i opcja **pokazania numeru od razu** (bez klikania).
- **Wybór celu głównych przycisków** („Auto” zachowuje dotychczasową logikę PL/EN).

### 3.4 Edytor strony (`editor.html`, `site-customize.js`, `site-config.js`)

Wizualny edytor w stylu uproszczonego Figma, w jednym pliku HTML, bez zależności. Interfejs po polsku.

- **Podgląd na żywo** (komputer / tablet / telefon, PL / EN). Klik w napis w podglądzie wybiera go do edycji.
- **Podświetlanie, co zmienia dana opcja:** najazd na opcję obrysowuje w podglądzie dotknięte elementy i podpisuje je. Każda opcja ma opis. Żółta kropka = zmiana względem oryginału, ↺ cofa ją.
- **Styl:** 6 palet, 6 kolorów, 13 czcionek, kształt kart i przycisków, cień, odstępy, szerokość treści, układ hero (strona, kształt i kadr zdjęcia, ozdoby), kafelki ofert, przyklejony przycisk, animacje.
- **Sekcja:** tło, dodatkowy odstęp, ukrywanie sekcji i pojedynczych elementów.
- **Tekst:** treść PL/EN, rozmiar, grubość i kolor pojedynczego napisu.
- **Treść:** marka, zdjęcie (wgranie z automatycznym zmniejszeniem), cele przycisków, telefon, e-mail, LinkedIn, link do kalendarza, logo narzędzi, opinie.
- **Zmiany:** lista wszystkiego, co różni się od oryginału, z cofnięciem każdej pozycji.
- **Lewy panel:** kolejność sekcji (przeciąganie lub strzałki), oko ukrywa sekcję i jej link w menu.
- Cofnij / ponów (Ctrl+Z), „Przytrzymaj: oryginał” do porównania, automatyczny szkic, zapis do pliku (Ctrl+S).
- **Zapis:** edytor zapisuje zwykły plik `site-config.js`, więc zmiany widać w `git diff` i zapisuje się je commitem. W przeglądarkach bez zapisu do plików plik jest pobierany.
- **Bezpieczeństwo:** `site-customize.js` waliduje każdą wartość (kolory `#rrggbb`, czcionki z listy, zakresy liczb, adresy https, kalendarz tylko z `calendar.google.com`). W tekstach dozwolone są tylko `<br>`, `<em>`, `<strong>`. Podgląd reaguje na komunikaty tylko w ramce, z `?edit=1` i od okna nadrzędnego.

### 3.5 Dokumentacja

Pełne `README.md`: struktura projektu, opis strony, instrukcja edytora, format `site-config.js`, dostępność, bezpieczeństwo, ograniczenia.

## 4. Jak to sprawdzić

1. Rozpakuj ZIP do **osobnego folderu** (Twoja wersja zostaje nietknięta).
2. Otwórz `index.html` i porównaj z Twoją wersją. Warto obejrzeć też widok telefonu (F12, przełącznik urządzeń).
3. Otwórz `editor.html` w **Chrome lub Edge**: to wizualny edytor strony. Najedź na dowolną opcję, a podgląd pokaże, co ona zmienia. Zapis (Ctrl+S) tworzy plik `site-config.js`.
4. Jeśli wolisz zachować swoją wersję i wziąć tylko wybrane rzeczy, porównaj foldery (np. w VS Code: *Select for Compare*). Zmiany są podzielone na bloki „v2” i „v3” na końcu `styles.css`.

## 5. Jak testowałem

- **Strona:** zrzuty ekranu w headless Chrome (komputer 1440 px, telefon 390 px), sprawdzenie braku poziomego przewijania i braku błędów w konsoli.
- **Edytor:** skrypt przez Chrome DevTools Protocol, który klika kontrolki i sprawdza efekt w podglądzie: kolor akcentu, zmiana czcionki, ukrywanie i przestawianie sekcji, klik w tekst, edycja tekstu (z próbą wstrzyknięcia `<script>`), telefon i e-mail (także błędny format), logo narzędzi, opinie, cele przycisków, tło i odstęp sekcji, styl napisu, zakładka „Zmiany” z cofaniem, cofnij/ponów, „oryginał”, zawartość wygenerowanego `site-config.js`.
- **Nie testowałem:** Safari i Firefoksa, prawdziwych urządzeń, animacji przy faktycznym przewijaniu oraz zapisu bezpośrednio do pliku (tylko wariantu z pobraniem).

## 6. Znane ograniczenia

- Kilka bardzo jasnych odcieni zieleni jest w `styles.css` zapisanych na sztywno, więc po zmianie akcentu nie zmienią się razem z nim.
- Zapis bezpośrednio do pliku działa w Chrome i Edge.
- Treść (ceny w EN, opinie, telefon, rozbieżności PL/EN) została poza zakresem tego PR.
- Dodany CSS jest dopisany na końcu `styles.css` (bloki „v2” i „v3”), a stare, nieużywane reguły nie zostały usunięte, żeby diff pokazywał, co się zmieniło. Sprzątanie warto zrobić po wyborze wersji.
- Przy ukryciu pierwszej karty oferty układ kafelkowy ma dwie równe karty.

## 7. Pliki

| Plik | Zmiana |
|---|---|
| `index.html` | Nowy układ sekcji, ikony SVG, cennik jako karty, nowy kalendarz, sekcja opinii, przycisk e-mail |
| `styles.css` | Bloki „v2” i „v3” (nowy wygląd, dostępność, kalendarz, opinie) |
| `app.js` | Nowe teksty, menu, przyklejony przycisk, animacje, kalendarz (mobile, ładowanie), cele przycisków |
| `site-customize.js` | **Nowy.** Walidacja i stosowanie ustawień, podgląd i podświetlanie dla edytora |
| `site-config.js` | **Nowy.** Zapisane ustawienia (domyślnie puste) |
| `editor.html` | **Nowy.** Edytor |
| `README.md` | Pełna dokumentacja |
