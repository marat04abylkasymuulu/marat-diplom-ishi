# РЕКОРД — Окуу борборунун веб-сайты

**"Рекорд"** — Ош шаарындагы ЖРТ/ОРТ (Жалпы Республикалык Тестирлөө) даярдоо борборунун толук функционалдуу веб-тиркемеси.

> Директор: Нишанов Шекербек | 8+ жыл тажрыйба | 200+ балл алган окуучулар

---

## Сайт жөнүндө

### Коомдук бөлүк (студенттер көрөт)

| Бет | Мазмуну |
|-----|---------|
| **Башкы бет** | Hero-блок, статистика (жыл, окуучулар, сертификаттар), **акция/тизме** (админден түзөтүлөт), тез байланыш |
| **Биз жөнүндө** | Борбордун тарыхы, миссиясы, директор жөнүндө |
| **Курстар** | Категория боюнча фильтр, ар бир курстун баасы/узактыгы/башталыш датасы |
| **Расписание** | Жума боюнча сабактардын таблицасы |
| **Окутуучулар** | Сүрөт, аты-жөнү, предмети, тажрыйбасы |
| **Жетишкендиктер** | Статистика + 200+ балл алган окуучулардын тизмеси |
| **Отзывдар** | Жарыяланган отзывдар + окуучу пикирин калтыруу формасы (модерация админде) |
| **Жаңылыктар** | Акциялар, жаңы курстар, ЖРТ жаңылыктары |
| **Байланыштар** | Филиалдар (**Google / 2GIS** карталар — embed же share link), дарек, телефон, WhatsApp, жазылуу формасы |

### Админ панель (кызматкерлер көрөт)

`/panel/login` дареги аркылуу кирүү. Техникалык билим талап кылбайт.

| Бөлүм | Мүмкүнчүлүк |
|-------|-------------|
| **Dashboard** | Жалпы статистика: жаңы кайрылуулар, күтүүдөгү пикирлер |
| **Акция / тизме** | Башкы беттеги промо-тизмени текст менен түзөтүү |
| **Курстар** | Курс кошуу/өзгөртүү/жок кылуу, категория башкаруу |
| **Окутуучулар** | Мугалим кошуу/өзгөртүү/жок кылуу |
| **Расписание** | Күн/убакыт/аудитория боюнча сабак кошуу |
| **Отзывдар (ЖРТ)** | Сайтта көрүнгөн отзывдарды башкаруу (жарыяланган отзывдар) |
| **Окуучу пикири** | Форма аркылуу келген пикирлер — жарыялоо/четке кагуу |
| **Жетишкендиктер** | Сайттагы статистиканы өзгөртүү |
| **Жаңылыктар** | Жаңылык/акция жарыялоо |
| **Кайрылуулар** | Жазылуу формаларын көрүү, WhatsApp/чалуу |
| **Филиалдар** | Филиал + **Google Maps / 2GIS** embed URL (share link сервер тараптан чечилет) |

### Кошумча мүмкүнчүлүктөр

- **3 тилдик колдоо**: Кыргызча, Орусча, Англисче (тил которгуч)
- **WhatsApp интеграция**: Даяр билдирүү менен WhatsApp ачылат
- **Email билдирүүлөр**: Жаңы кайрылуу/отзыв келгенде админге email жөнөтүлөт
- **Мобильдик версия**: Бардык беттер телефондо да иштейт
- **JWT аутентификация**: Коопсуз админ кирүү системасы
- **API throttling** (продакшн): коомдук суроолор үчүн лимит (`anon` / `user`); `manage.py test` учурунда өчүрүлөт (тесттер 429 албайт)

---

## Технологиялар

| Катмар | Технология |
|--------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, react-i18next |
| Backend | Django 5.1, Django REST Framework, SimpleJWT |
| Database | SQLite (локалдык), PostgreSQL (продакшн) |
| Тил колдоо | react-i18next (frontend), Django i18n (backend) |
| Контейнер | Docker, Docker Compose, Nginx |
| CI/CD | GitHub Actions → Docker Hub |
| Тесттер | Django TestCase (backend), Vitest (frontend) |

---

## Проект структурасы

```
record-education/
├── backend/                 # Django backend
│   ├── config/              # Settings, URLs
│   ├── courses/             # Курстар + расписание
│   ├── teachers/            # Окутуучулар
│   ├── reviews/             # Отзывдар + жетишкендиктер + студент feedback
│   ├── news/                # Жаңылыктар
│   ├── contacts/            # Байланыш формасы + филиалдар
│   ├── admin_api/           # Админ панелдин API'си (JWT менен)
│   ├── Dockerfile           # Backend Docker image
│   ├── entrypoint.sh        # Миграция + сервер баштоо
│   ├── requirements.txt
│   └── manage.py
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, Footer, WhatsApp button
│   │   ├── pages/           # Коомдук беттер (9 бет)
│   │   ├── admin/           # Админ панель (login, dashboard, CRUD pages)
│   │   ├── locales/         # Которуулар (ky, ru, en)
│   │   ├── hooks/           # useLocalized
│   │   ├── utils/           # API client (axios), mapEmbeds (карта URL'дери)
│   │   └── test/            # Vitest тесттери
│   ├── Dockerfile           # Frontend Docker image (multi-stage)
│   ├── nginx.conf           # Nginx конфигурациясы
│   ├── package.json
│   └── vite.config.js
├── .github/workflows/ci.yml # GitHub Actions CI/CD
├── docker-compose.yml       # Бир команда менен иштетүү
├── .gitignore
└── README.md
```

---

## Docker менен иштетүү (эң оңой жол)

### Талаптар

- **Docker** жана **Docker Compose** орнотулган болушу керек

### Бир команда менен баштоо

```bash
git clone https://github.com/alidin000/record-education.git
cd record-education

# .env файлын түзүү (backend үчүн)
cp backend/.env.example backend/.env

# Бардыгын иштетүү
docker compose up --build
```

Даяр! Сайт ачылат:
- **http://localhost** — Коомдук сайт
- **http://localhost/panel/login** — Админ панель
- **http://localhost:8000/admin/** — Django admin

### Админ аккаунт түзүү (Docker ичинде)

```bash
docker compose exec backend python manage.py createsuperuser
```

### Токтотуу

```bash
docker compose down
```

---

## Локалдык иштетүү (Docker'сиз)

### Талаптар

- **Python** 3.12 (же 3.10+; CI — 3.12)
- **Node.js** 18 же жогору (npm менен)
- **Git**

### 1. Репозиторийди клондоо

```bash
git clone https://github.com/alidin000/record-education.git
cd record-education
```

### 2. Backend орнотуу

```bash
cd backend

# Виртуалдык чөйрө түзүү
python -m venv venv

# Активдештирүү
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Зарыл пакеттерди орнотуу
pip install -r requirements.txt

# Environment файлын түзүү
cp .env.example .env
# .env файлын ачып SECRET_KEY'ди өзгөртүңүз (каалаган текст жаз)

# Маалымат базасын даярдоо
python manage.py migrate

# Админ аккаунт түзүү (логин/пароль сурайт)
python manage.py createsuperuser

# Серверди иштетүү
python manage.py runserver
```

Backend иштеп жатат: **http://localhost:8000**
Django admin: **http://localhost:8000/admin/**

### 3. Frontend орнотуу (жаңы терминалда)

```bash
cd frontend

# Пакеттерди орнотуу
npm install

# Dev серверди иштетүү
npm run dev
```

Frontend иштеп жатат: **http://localhost:5173**

### 4. Сайтты ачуу

| URL | Эмне |
|-----|------|
| http://localhost:5173 | Коомдук сайт (студенттер көрөт) |
| http://localhost:5173/panel/login | Админ панель (кызматкерлер) |
| http://localhost:5173/panel/promo | Акция / башкы бет тизмеси (логин кийин) |
| http://localhost:8000/admin/ | Django admin (программист үчүн) |
| http://localhost:8000/api/ | API endpoint тизмеси |

---

## Биринчи мазмун кошуу (кадам-кадам)

Админ панелге кирип (`/panel/login`), createsuperuser'дагы логин/пароль менен кириңиз.

### 1-кадам: Категория кошуу

**Курстар** → **"Категориялар"** баскычы → Категория кошуңуз:
- "ЖРТ Математика" / "ОРТ Математика"
- "ЖРТ Кыргыз тили" / "ОРТ Кыргызский язык"
- "Интенсив" / "Интенсив"

### 2-кадам: Курс кошуу

**Курстар** → **"Жаңы курс"** → Маалыматтарды толтуруңуз:
- Аталышы (Кыргызча жана Русча — милдеттүү, Англисче — каалоо боюнча)
- Категория, узактык, баа, башталыш датасы

### 3-кадам: Окутуучу кошуу

**Окутуучулар** → **"Жаңы окутуучу"** → Аты, предмети, тажрыйбасы

### 4-кадам: Расписание кошуу

**Расписание** → **"Кошуу"** → Курсту тандап, күн/убакыт/аудитория

### 5-кадам: Жетишкендик кошуу

**Жетишкендиктер** → **"Кошуу"** → Маани (мис. "200+") жана аталыш

Баары! Сайт автоматтуу жаңыланат.

---

## API Endpoints

### Коомдук (аутентификациясыз)

| Метод | Endpoint | Сүрөттөмө |
|-------|----------|-----------|
| GET | `/api/courses/` | Курстар (фильтр: `?category=slug`) |
| GET | `/api/categories/` | Категориялар |
| GET | `/api/schedule/` | Расписание |
| GET | `/api/teachers/` | Окутуучулар |
| GET | `/api/reviews/` | Отзывдар (фильтр: `?featured=true`) |
| GET | `/api/achievements/` | Жетишкендиктер |
| GET | `/api/news/` | Жаңылыктар (фильтр: `?category=promo`) |
| GET | `/api/branches/` | Филиалдар (карта embed талаалары менен) |
| GET | `/api/site-promo/` | Башкы беттеги акция/тизме тексти |
| GET | `/api/resolve-map-link/?url=...` | Google/2GIS **share** linkти embed URLге айлантуу (коопсуз host текшерүү менен) |
| POST | `/api/contact/` | Жазылуу формасы |
| GET/POST | `/api/feedback/` | Студент отзывдары (POST — жөнөтүү, GET — жарыяланган) |

### Админ (JWT token керек)

| Метод | Endpoint | Сүрөттөмө |
|-------|----------|-----------|
| POST | `/api/admin/token/` | Логин (username + password → access + refresh token) |
| POST | `/api/admin/token/refresh/` | Token жаңылоо |
| GET | `/api/admin/me/` | Учурдагы колдонуучу |
| GET | `/api/admin/dashboard/` | Статистика |
| GET/PATCH | `/api/admin/site-promo/` | Башкы бет акциясы / тизме |
| CRUD | `/api/admin/courses/` | Курстар башкаруу |
| CRUD | `/api/admin/categories/` | Категориялар |
| CRUD | `/api/admin/teachers/` | Окутуучулар |
| CRUD | `/api/admin/schedule/` | Расписание |
| CRUD | `/api/admin/feedbacks/` | Окуучу пикири + approve/reject |
| CRUD | `/api/admin/reviews/` | Жарыяланган отзывдар (ЖРТ) |
| CRUD | `/api/admin/achievements/` | Жетишкендиктер |
| CRUD | `/api/admin/news/` | Жаңылыктар |
| CRUD | `/api/admin/branches/` | Филиалдар |
| CRUD | `/api/admin/contacts/` | Кайрылуулар + mark_processed |

---

## Тесттер

### Backend тесттери (58 тест)

```bash
cd backend
source venv/bin/activate
python manage.py test --verbosity=2
```

Тесттер бардык апптарды камтыйт:
- `admin_api/tests.py` — JWT агымы, dashboard, сайт промосу, рейтинг валидациясы
- `courses/tests.py` — Курстар, категориялар, расписание (модель + API + админ)
- `teachers/tests.py` — Окутуучулар (модель + көрүнүштүлүк + админ уруксаттар)
- `reviews/tests.py` — Отзывдар, feedback жөнөтүү/жарыялоо/четке кагуу
- `news/tests.py` — Жаңылыктар жарыялоо, фильтрлөө
- `contacts/tests.py` — Кайрылуулар, филиалдар, **карта талаалары**, `resolve-map-link`, сайт промосу (коомдук API)

### Frontend тесттери (Vitest)

```bash
cd frontend
npm test -- --run
```

---

## CI/CD Pipeline (GitHub Actions)

Push кылганда автоматтуу иштейт (`.github/workflows/ci.yml`):

```
┌─────────────────┐     ┌─────────────────┐
│  test-backend   │     │  test-frontend   │
│  (Python 3.12)  │     │  (Node.js 20)    │
│  manage.py test │     │  vitest + build  │
└────────┬────────┘     └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
         ┌───────────────────────┐
         │   build-and-push      │
         │  (main branch гана)   │
         │  Docker Hub'ка push   │
         └───────────────────────┘
```

### Docker Hub Images

| Image | Тег |
|-------|-----|
| `alidin000/record-backend` | `latest`, `<commit-sha>` |
| `alidin000/record-frontend` | `latest`, `<commit-sha>` |

### Docker Hub орнотуу

1. [hub.docker.com/settings/security](https://hub.docker.com/settings/security) → **New Access Token** түзүү
2. GitHub репозиторийде: **Settings → Secrets → Actions** → `DOCKER_HUB_TOKEN` кошуу

### Docker Hub'дан иштетүү (серверде)

```bash
docker pull alidin000/record-backend:latest
docker pull alidin000/record-frontend:latest
docker compose up
```

---

## Render.com'до деплой кылуу (бекер)

### Автоматтык деплой (Blueprint)

1. [render.com/dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. GitHub репозиторийиңизди тандаңыз (`alidin000/record-education`)
3. Render автоматтуу `render.yaml` файлын окуп, 3 сервис түзөт:
   - **record-backend** — Django API (Python web service)
   - **record-frontend** — React статик сайт
   - **record-db** — PostgreSQL маалымат базасы (бекер)

4. Deploy бүткөндө, админ аккаунт түзүү:
   - Render Dashboard → **record-backend** → **Shell** табын ачуу
   - `python manage.py createsuperuser` жазуу

### Кол менен деплой (эгер Blueprint иштебесе)

**1. PostgreSQL түзүү:**
- Render Dashboard → New → PostgreSQL → Free plan
- `Internal Database URL` көчүрүү

**2. Backend (Web Service):**
- New → Web Service → GitHub репо тандоо
- Root Directory: `backend`
- Build Command: `./build.sh`
- Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
- Environment Variables:
  | Key | Value |
  |-----|-------|
  | `DATABASE_URL` | (PostgreSQL'ден көчүргөн URL) |
  | `SECRET_KEY` | (каалаган узун текст) |
  | `DEBUG` | `False` |
  | `ALLOWED_HOSTS` | `.onrender.com` |
  | `CORS_ALLOWED_ORIGINS` | `https://record-frontend.onrender.com` |
  | `PYTHON_VERSION` | `3.12.0` |

**3. Frontend (Static Site):**
- New → Static Site → GitHub репо тандоо
- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Redirect/Rewrite rules:
  | Source | Destination | Type |
  |--------|-------------|------|
  | `/api/*` | `https://record-backend.onrender.com/api/*` | Rewrite |
  | `/media/*` | `https://record-backend.onrender.com/media/*` | Rewrite |
  | `/*` | `/index.html` | Rewrite |

### Render маалымат

- Бекер план: сервис 15 мүнөт активсиздиктен кийин "уктайт", кийинки суроо 30-50 сек көбүрөөк алат
- PostgreSQL бекер пландын 90 күн мөөнөтү бар, андан кийин $7/ай
- Media файлдар (сүрөттөр) үчүн эгер көп сүрөт жүктөсө, Cloudinary же AWS S3 колдонуу сунушталат

---

## Продакшнго чыгаруу (башка варианттар)

### Docker менен

```bash
# .env файлында:
DEBUG=False
SECRET_KEY=<чыныгы-коопсуз-ачкыч>
DATABASE_URL=postgres://user:pass@host:5432/dbname
ALLOWED_HOSTS=record-edu.kg,www.record-edu.kg
CORS_ALLOWED_ORIGINS=https://record-edu.kg

# Email (Gmail мисал):
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
ADMIN_EMAIL=director@record-edu.kg

# Иштетүү
docker compose up -d
```

### Хостинг варианттары

| Вариант | Баасы | Жакшы жагы |
|---------|-------|------------|
| **Render.com** | Бекер | Blueprint менен автоматтык деплой |
| **Railway.app** | $5/ай | Backend + DB бирге, оңой |
| **DigitalOcean Droplet** | $6/ай | Толук контроль, Docker менен |
| **Vercel** (frontend) + **Railway** (backend) | $5/ай | Тез, масштабдуу |

---

## WhatsApp номерди өзгөртүү

`frontend/src/components/WhatsAppButton.jsx` файлында:

```javascript
const WHATSAPP_NUMBER = '996555000000'; // ← Бул жерди өзгөртүңүз
```

---

## Лицензия

MIT

## Автор

Abylkasym uulu Alidin — [@alidin000](https://github.com/alidin000)
