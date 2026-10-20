# tutors_webp

Statyczna jednostronicowa strona korepetytora matematyki i fizyki, w dwóch językach (PL / EN). Nie ma budowania ani zależności: wystarczy otworzyć `index.html` w przeglądarce albo wrzucić pliki na dowolny hosting statyczny (np. GitHub Pages).

Do strony dołączony jest prosty wizualny edytor (`editor.html`), dzięki któremu można zmieniać wygląd, teksty i układ bez dotykania kodu.

## Spis treści

1. [Szybki start](#szybki-start)
2. [Pliki w projekcie](#pliki-w-projekcie)
3. [Jak wygląda strona](#jak-wygląda-strona)
4. [Edytor strony](#edytor-strony)
5. [Zapis i git](#zapis-i-git)
6. [Plik `site-config.js`](#plik-site-configjs)
7. [Konfiguracja bez edytora](#konfiguracja-bez-edytora)
8. [Dostępność i UX](#dostępność-i-ux)
9. [Bezpieczeństwo](#bezpieczeństwo)
10. [Ograniczenia i znane kompromisy](#ograniczenia-i-znane-kompromisy)

## Szybki start

- **Podgląd strony:** otwórz `index.html`.
- **Edycja:** otwórz `editor.html` w Chrome lub Edge (w tym samym folderze co `index.html`), zmieniaj, naciśnij **Zapisz** (Ctrl+S) i wskaż plik `site-config.js`. Potem zrób zwykły commit.
- **Telefon i kalendarz:** numer telefonu i adres kalendarza Google można wpisać w edytorze (zakładka *Treść*) albo w `calendar-config.js`.

Strona działa też z lokalnego serwera (`npx serve`, `python -m http.server`), ale nie jest to konieczne.

## Pliki w projekcie

| Plik | Po co |
|---|---|
| `index.html` | Cała strona: nagłówek, sekcje, stopka oraz sprite ikon SVG. |
| `styles.css` | Style. Na końcu pliku są bloki „v2" i „v3" z nowym wyglądem, które celowo nadpisują starsze reguły (dzięki temu widać w diffie, co się zmieniło). |
| `app.js` | Teksty PL/EN (obiekt `translations`), przełącznik języka, menu mobilne, odsłanianie telefonu, kalendarz Google, przyklejony przycisk, animacje przy przewijaniu. |
| `site-customize.js` | Wczytuje i **waliduje** `site-config.js`, stosuje ustawienia do strony i obsługuje podgląd na żywo w edytorze. |
| `site-config.js` | Ustawienia zapisane przez edytor. Pusty obiekt `{}` = wygląd domyślny. |
| `editor.html` | Wizualny edytor strony (jeden plik: HTML, CSS i JS). |
| `calendar-config.js` | Adres kalendarza Google i numer telefonu (można je nadpisać z edytora). |
| `service-area.js`, `service-area-config.js` | Pozostałość po starszej wersji (mapa obszaru zajęć). Nie są ładowane przez `index.html`. |
| `llms.txt` | Opis strony dla narzędzi AI. Wymaga aktualizacji (patrz *Ograniczenia*). |
| `att.*.jpeg`, `profile_picture.jpg` | Zdjęcia. Używane jest pierwsze, drugie nie jest nigdzie podłączone. |

## Jak wygląda strona

Kolejność sekcji (można ją zmienić w edytorze):

1. **Nagłówek** — logo, przełącznik języka, menu (na telefonie: hamburger), przycisk „Umów lekcję".
2. **Hero** — nagłówek, krótkie bio, przyciski, zdjęcie w ramce z ozdobami.
3. **Trzy liczby** — pas z krótkimi hasłami.
4. **Oferta** — trzy karty w układzie kafelkowym (pierwsza duża i ciemna).
5. **Cennik** — dwie karty (online / stacjonarnie) z dużą ceną i logo narzędzi do lekcji online.
6. **Rezerwacja** — karta z krokami i ramka z kalendarzem Google. Na telefonie zamiast osadzonego kalendarza jest duży przycisk otwierający stronę rezerwacji.
7. **Opinie** — ukryta, dopóki w edytorze nie dodasz opinii (do 6).
8. **Cytat** — ciemny pas.
9. **Kontakt** — telefon (z odsłanianiem albo od razu), opcjonalnie e-mail.
10. **Stopka.**

### Wygląd i zachowanie

- **Przyciski:** główny jest limonkowy z ciemną obwódką i twardym cieniem, drugorzędny to kontur. Strzałka „↗" oznacza tylko linki zewnętrzne, kotwice mają „→" lub „↓".
- **Ikony:** inline SVG (sprite w `index.html`), a logo narzędzi (Discord, Miro, Google Meet, Zoom, Teams, WhatsApp) pochodzą z [Simple Icons](https://simpleicons.org/) (CC0) i są dołączane z `site-customize.js`.
- **Animacje:** podkreślenie nagłówka się „rysuje", sekcje delikatnie wjeżdżają. Przy `prefers-reduced-motion` są wyłączone.
- **Telefon:** przyklejony przycisk rezerwacji przy dolnej krawędzi (chowa się, gdy widać inne przyciski rezerwacji lub kontakt).
- **Efekty hover** działają tylko na urządzeniach z myszką.

## Edytor strony

Otwórz `editor.html` w **Chrome lub Edge**, w tym samym folderze co `index.html`. Interfejs jest po polsku.

### Układ okna

- **Środek:** podgląd strony na żywo. Przełączniki u góry: rozmiar (Komputer / Tablet / Telefon) i język podglądu (PL / EN). Klik w napis w podglądzie wybiera go do edycji, klik w puste tło sekcji wybiera sekcję.
- **Lewy panel — struktura strony:** lista sekcji. Przeciągnij sekcję lub użyj strzałek ▲▼, aby zmienić kolejność. Oko ukrywa sekcję razem z linkiem w menu i stopce. Strzałka po lewej rozwija pojedyncze elementy sekcji (każdy też można ukryć).
- **Prawy panel — pięć zakładek:** Styl, Sekcja, Tekst, Treść, Zmiany.

### Co zmienia dana opcja

Najedź na dowolną opcję (albo ją przesuń/zmień), a podgląd **obrysuje na niebiesko elementy, na które ona działa**, i podpisuje je nazwą opcji. Każda opcja ma też krótki opis, co i gdzie zmienia. Dodatkowo:

- **żółta kropka** przy opcji = wartość różni się od oryginału,
- **↺** przywraca wartość domyślną tej jednej opcji,
- przełącznik „Pokazuj, co zmienia" na górze wyłącza obrysowywanie,
- jeśli element nie jest widoczny w wybranym rozmiarze podglądu (np. przyklejony przycisk na komputerze), podpis podpowiada, jak go zobaczyć.

### Zakładka „Styl"

- **Kolory:** 6 gotowych palet (Oryginał, Ocean, Zachód, Lawenda, Mięta, Mono) oraz sześć kolorów osobno: akcent, główny (ciemny), tło strony, tekst, tekst pomocniczy, linie.
- **Czcionki:** nagłówki i tekst, 13 krojów do wyboru (ładowane z Google Fonts, wszystkie obsługują polskie znaki).
- **Kształty:** zaokrąglenie kart, kształt przycisków (pigułka / zaokrąglone / kwadratowe), cień przycisków.
- **Układ i odstępy:** odstępy między sekcjami, maksymalna szerokość treści na komputerze.
- **Górna część (hero):** zdjęcie po prawej/lewej, kształt zdjęcia (łuk / prostokąt / owal), ozdoby wokół zdjęcia, kadr zdjęcia (poziomo i pionowo).
- **Funkcje:** kafelkowy układ ofert, przyklejony przycisk na telefonie, animacje.

### Zakładka „Sekcja"

Po wybraniu sekcji (z listy po lewej albo klikiem w podglądzie):

- ukrycie całej sekcji,
- **kolor tła** (pełnej szerokości pas za sekcją),
- **dodatkowy odstęp** nad i pod sekcją,
- przełączniki widoczności pojedynczych elementów (np. przycisk LinkedIn, jedna z kart oferty, uwaga pod cennikiem).

### Zakładka „Tekst"

Kliknij napis w podglądzie (albo wybierz go z listy z wyszukiwarką). Można zmienić:

- treść po **polsku i angielsku** (dozwolone znaczniki: `<br>`, `<em>`, `<strong>`),
- **rozmiar**, **grubość** i **kolor** tego jednego napisu,
- „↺ oryginał" przywraca pierwotny tekst.

### Zakładka „Treść"

- **Marka i zdjęcie:** nazwa marki w logo, wgranie zdjęcia (zmniejszane i osadzane w `site-config.js`) albo nazwa pliku z folderu projektu.
- **Dokąd prowadzą przyciski:** Auto (w PL do kontaktu, w EN do rezerwacji) / Rezerwacja / Kontakt.
- **Kontakt:** numer telefonu, przełącznik „Pokaż numer od razu", adres e-mail (pojawia się przycisk „Napisz e-mail"), profil LinkedIn, link do kalendarza Google. Pola z błędnym formatem są zaznaczone na czerwono i strona ich nie użyje.
- **Narzędzia do lekcji online:** wybór logo w karcie „Online".
- **Opinie:** do 6, każda z treścią, imieniem i opisem (np. „mama ucznia"). Można je przestawiać i usuwać.

### Zakładka „Zmiany"

Lista wszystkiego, co różni się od oryginału (pogrupowana), z przyciskiem „Cofnij" przy każdej pozycji. Klik w wiersz podświetla w podglądzie, czego dotyczy. Liczba zmian jest widoczna na zakładce.

### Pozostałe

- **Cofnij / Ponów:** Ctrl+Z / Ctrl+Shift+Z (do 100 kroków).
- **Przytrzymaj: oryginał:** pokazuje stronę bez Twoich zmian, żeby porównać.
- **Resetuj:** przywraca oryginał (można jeszcze cofnąć).
- **Szkic:** niezapisane zmiany są zapamiętywane w przeglądarce i można je przywrócić po ponownym otwarciu edytora.

## Zapis i git

**Zapisz** (Ctrl+S) zapisuje plik `site-config.js` w folderze projektu. Przy pierwszym zapisie wskaż plik obok `index.html`, kolejne zapisy robią to bez pytania. Gdy przeglądarka nie obsługuje zapisu do pliku (np. Firefox), edytor **pobiera** `site-config.js`, a Ty podmieniasz go ręcznie (przycisk **Pobierz** robi to samo na żądanie).

`site-config.js` to zwykły plik tekstowy, więc:

- zmiany widać w `git diff`,
- zapisuje się je zwykłym commitem (`git add site-config.js && git commit`),
- porównanie wersji to po prostu `git checkout` odpowiedniego brancha.

Edytor sam niczego nie commituje.

## Plik `site-config.js`

Format: jeden obiekt przypisany do `window.BRIGHTSIDE_SITE`. Wszystkie pola są opcjonalne, brakujące przyjmują wartości domyślne.

```js
window.BRIGHTSIDE_SITE = {
  brand: "",                       // nazwa przy logo (puste = „Jasne!”)
  photo: "",                       // nazwa pliku albo data: URL
  colors: { ink, muted, paper, green, deep, line },   // #rrggbb
  fonts: { display: "Manrope", sans: "DM Sans" },
  shape: { cardRadius: 20, buttonShape: "pill|rounded|square", buttonShadow: true },
  spacing: { section: 1 },         // 0.4 – 1.8
  layout: { contentWidth: 1440 },  // 960 – 1680
  hero: { photoSide: "right|left", photoShape: "arch|rounded|oval", decorations: true, focusX: 57, focusY: 50 },
  features: { stickyCta: true, animations: true, bento: true },
  cta: { target: "auto|booking|contact" },
  contact: { phone, email, linkedin, calendarUrl, revealPhone: false },
  tools: ["discord", "miro", "googlemeet"],   // + zoom, teams, whatsapp
  testimonials: [{ text, author, role }],     // do 6
  sections: { order: [...], hidden: [...] },
  hiddenItems: [...],
  sectionStyle: { hero: { bg: "#rrggbb", gap: 0 }, ... },
  textStyle: { heroTitle: { scale: 1, weight: 0, color: "" }, ... },
  text: { en: { klucz: "tekst" }, pl: { ... } }
};
```

Przy wczytaniu każda wartość jest sprawdzana: kolory muszą być w formacie `#rrggbb`, czcionki pochodzą z listy, liczby są ograniczane do zakresów, adresy muszą być `https://` (kalendarz tylko z `calendar.google.com/calendar/appointments/schedules/`), a w tekstach dozwolone są tylko `<br>`, `<em>` i `<strong>`. Błędna wartość jest po cichu zastępowana domyślną.

Plik jest generowany przez edytor. Ręczne edycje są możliwe, ale edytor je nadpisze przy następnym zapisie.

## Konfiguracja bez edytora

`calendar-config.js` zawiera dwa ustawienia:

```js
window.BRIGHTSIDE_CALENDAR_URL = "https://calendar.google.com/calendar/appointments/schedules/…?gv=true";
window.BRIGHTSIDE_PHONE_NUMBER = "+48123456789";
```

Wartości wpisane w edytorze (zakładka *Treść*) mają pierwszeństwo przed tymi z pliku.

Teksty w obu językach są w `app.js` (obiekt `translations`). Edytor zapisuje tylko różnice względem nich, więc nic nie zostaje nadpisane w kodzie.

## Dostępność i UX

Co zostało zrobione w tej wersji:

- **Cele dotykowe ≥ 44 px** (menu, przełącznik języka, linki w stopce, przyciski).
- **Widoczny `:focus-visible`** na wszystkich elementach interaktywnych.
- **Czytelna typografia:** min. 12–13 px dla drobnych napisów, 15–16 px dla treści na telefonie, bez skrajnie ujemnego `letter-spacing`.
- **Menu mobilne** z `aria-controls`, zamykane klawiszem Esc i kliknięciem poza menu, przełączane do 900 px.
- **Ikony SVG** z `aria-hidden`, zamiast znaków Unicode, które wyglądają różnie na różnych systemach.
- **`prefers-reduced-motion`:** brak animacji i odsłaniania.
- **Efekty hover tylko na urządzeniach z myszką.**
- **Obraz w hero** z `width`/`height` i `fetchpriority="high"` (bez skoku układu).
- **Na telefonie** zamiast długiego iframe kalendarza (przewijanie wewnątrz strony) jest przycisk otwierający rezerwację w nowej karcie.

## Bezpieczeństwo

- Podgląd w edytorze reaguje na wiadomości tylko wtedy, gdy strona jest w ramce i ma w adresie `?edit=1`, i tylko od okna nadrzędnego.
- Wszystkie wartości z `site-config.js` i z edytora są walidowane (patrz wyżej). Teksty z `<script>` są wyświetlane jako zwykły tekst.
- Opinie i inne pola użytkownika trafiają na stronę przez `textContent`.
- Numer telefonu i adres kalendarza są jawne w plikach JS (ukrywanie numeru za kliknięciem nie chroni przed botami, a jedynie utrudnia przypadkowe odczytanie).

## Ograniczenia i znane kompromisy

- **Edytor nie obejmuje** kilku bardzo jasnych odcieni zieleni zapisanych na sztywno w `styles.css` (np. tło ikon). Po zmianie koloru akcentu różnią się one nieznacznie.
- **Zapis do pliku** działa w Chrome i Edge. W innych przeglądarkach edytor pobiera plik.
- **Wnętrza kalendarza Google nie da się ostylować**, bo to osobna strona w iframe. Kolor strony rezerwacji ustawia się w Kalendarzu Google.
- **Wersja językowa** jest wybierana w JS po załadowaniu, więc przez ułamek sekundy widać angielski HTML (i wyszukiwarki widzą wersję EN). Docelowo lepiej mieć dwa statyczne pliki (`/pl`, `/en`).
- **`llms.txt`** wymaga aktualizacji (m.in. ceny są już opublikowane).
- **Martwy kod** po starszej wersji: `service-area*.js`, część reguł w `styles.css` (np. `.formula-card`, `.pricing-table`) i nieużywane klucze tłumaczeń.
- Zawartość (opinie, numer telefonu, ceny w wersji EN) jest makietą do uzupełnienia.
