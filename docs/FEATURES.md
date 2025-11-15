# Features Documentation

Detailed documentation of all application features, user flows, and business logic.

## 🔐 Authentication System

### Overview

Complete authentication system with login, signup, password reset, and protected routes.

### Features

#### 1. Login ("Prisijungti")

**Route**: `/login`

**Fields**:
- Email address
- Password (with show/hide toggle)

**Actions**:
- Primary login with email/password
- Social authentication (Google, Facebook)
- Email-only login option
- "Can't log in?" link to password reset

**User Flow**:
1. User enters credentials
2. Click "Prisijungti"
3. System validates credentials (mock)
4. Redirect to dashboard on success
5. Show error message on failure

**Implementation**: `src/features/auth/pages/LoginPage.tsx`

---

#### 2. Sign Up ("Sukurti paskyrą")

**Route**: `/signup`

**Fields**:
- First name (Vardas)
- Last name (Pavardė)
- Email address
- Password (with show/hide toggle)

**Actions**:
- Create account with email/password
- Social signup (Google, Facebook)
- Link to login page

**User Flow**:
1. User fills registration form
2. Click "Sukurti paskyrą"
3. Account created (mock)
4. Automatic login
5. Redirect to dashboard

**Implementation**: `src/features/auth/pages/SignupPage.tsx`

---

#### 3. Forgot Password

**Route**: `/forgot-password`

**Fields**:
- Email address

**User Flow**:
1. User enters email
2. Click "Siųsti atstatymo nuorodą"
3. System sends reset link (mock)
4. Success message displayed
5. User can return to login

**Implementation**: `src/features/auth/pages/ForgotPasswordPage.tsx`

---

#### 4. Reset Password

**Route**: `/reset-password`

**Fields**:
- 6-digit code
- New password
- Confirm password

**Actions**:
- Submit new password
- Clear form

**User Flow**:
1. User enters code from email
2. Enters new password twice
3. Click "Sukurti naują slaptažodį"
4. Password updated (mock)
5. Redirect to login

**Implementation**: `src/features/auth/pages/ResetPasswordPage.tsx`

---

### State Management

**Store**: `src/store/authStore.ts` (Zustand)

**State**:
```typescript
{
  user: User | null;
  isAuthenticated: boolean;
}
```

**Actions**:
- `login(email, password)`: Authenticate user
- `logout()`: Clear auth state
- `signup(email, password, firstName, lastName)`: Create account

**Persistence**: LocalStorage via Zustand persist middleware

---

## 📊 Dashboard ("Peržiūra")

### Overview

Main dashboard showing key metrics, recent activity, and statistics.

**Route**: `/dashboard`

### Components

#### 1. KPI Cards

Three metric cards showing:

**Card 1: Gautos pajamos**
- Label: "Šį mėnesį" (blue pill)
- Value: Total revenue (e.g., "€ 12 430")

**Card 2: Neapmokėta**
- Subtitle: "Vėluojančios sąskaitos"
- Value: Count and amount (e.g., "8 vnt. · € 3 210")

**Card 3: AI žinutės**
- Subtitle: "Išsiųsta priminimų"
- Value: Count and period (e.g., "24 per 7 d.")

#### 2. Recent Actions Table

**Columns**:
- Data (Date)
- Veiksmas (Action type)
- Klientas (Client name)
- Suma (Amount)

**Sample Actions**:
- Išrašyta sąskaita (Invoice issued)
- Išsiųstas AI priminimas (AI reminder sent)
- Gautas apmokėjimas (Payment received)

#### 3. Statistics Chart

**Type**: Multi-line chart

**Data**: 12 months of invoice statistics

**Lines**:
- Sumokėtos (Paid) - Green (#12E100)
- Nesumokėtos (Unpaid) - Purple (#664DFF)
- Terminas Nepasibaigęs (Pending) - Blue (#2B66FF)

**Features**:
- Dashed grid lines
- X-axis: Lithuanian month names
- Y-axis: Invoice counts
- Legend at bottom
- Responsive height

**Implementation**: `src/features/dashboard/pages/DashboardPage.tsx`

---

## 📄 Invoice Management ("Sąskaitos")

### Overview

Complete invoice management with list, detail, and filtering capabilities.

### 1. Invoice List

**Route**: `/invoices`

#### Filters

- **Suma nuo €**: Minimum amount filter
- **Suma iki €**: Maximum amount filter
- **Paieška pagal numerį**: Search by invoice number
- **Paieška pagal klientą**: Search by client name
- **Filtruoti button**: Apply filters

#### Table View (Desktop)

**Columns**:
- Nr. (Invoice number)
- Data (Issue date)
- Klientas (Client)
- Suma (Amount)
- Statusas (Status pill)
- Veiksmas ("Daugiau" button)

#### Card View (Mobile)

Each invoice displayed as a card with:
- Invoice number
- Date
- Client
- Amount
- Status pill
- "Daugiau" button

**Implementation**: `src/features/invoices/pages/InvoicesListPage.tsx`

---

### 2. Invoice Detail

**Route**: `/invoices/:id`

#### Information Sections

**Basic Info**:
- Užsakovas (Client)
- Sąskaitos numeris (Invoice number)
- Išrašymo data (Issue date)
- Apmokėjimo terminas (Due date)
- Statusas (Status pill)

**Amounts**:
- Bendra suma (Total amount)
- Sumokėta (Paid amount)
- Likusi suma (Remaining amount)

**Optional**:
- Prisegta sutartis (Attached contract with download)
- Pastabos (Notes/comments)

#### Actions

- **Siųsti AI pranešimą**: Send AI reminder
- **Atsisiųsti sąskaitą PDF**: Download invoice

#### AI Message Preview

Editable message preview with:
- Tema (Subject line)
- Žinutės turinys (Message body)
- Redaguoti (Edit button)
- Patvirtinti ir siųsti (Confirm and send)

**Implementation**: `src/features/invoices/pages/InvoiceDetailPage.tsx`

---

### Invoice Status

**Three statuses**:

1. **Apmokėta (Paid)** - Green pill
   - Invoice fully paid
   - No action needed

2. **Neapmokėta (Unpaid)** - Red pill
   - Payment overdue
   - AI reminders can be sent

3. **Terminas nepasibaigęs (Pending)** - Blue pill
   - Due date not reached
   - Partial payment possible

---

## 📤 CSV Upload ("CSV Įkėlimas")

### Overview

Import data from CSV/Excel files with progress tracking.

**Route**: `/csv-upload`

### Features

#### 1. Step Indicator

Three-step process:
1. Įkelti failą (Upload file)
2. Patikrinti duomenis (Verify data)
3. Baigta (Complete)

#### 2. File Upload

**Methods**:
- Drag and drop
- Click to browse

**Accepted formats**:
- CSV (.csv)
- Excel (.xlsx, .xls)

**Features**:
- Multiple file selection
- File type badges (CSV, Excel, PDF)
- Remove individual files
- File list preview

#### 3. File Type Selection

**Dropdown options**:
- Sąskaitos (Invoices)
- Klientai (Clients)
- Produktai (Products)

**Hint**: "PVZ: Pasirinkite 'Sąskaitos' jei importuojate sąskaitų duomenis"

#### 4. Import Progress

**During import**:
- Progress bar (0-100%)
- Percentage display
- "Vykdomas importas" message

**Success state**:
- Green checkmark icon
- "Importas sėkmingas!" message
- "Įkelti kitą failą" button

**Error state**:
- Red X icon
- "Įkėlimas nesėkmingas" message
- Error description
- "Bandyti dar kartą" button
- "Atšaukti" button

**Implementation**: `src/features/csv-upload/pages/CsvUploadPage.tsx`

---

## 🤖 AI Automation ("AI Automatizacijos")

### Overview

Configure automated reminder sequences with timing and analytics.

**Route**: `/ai-automation/:tab`

### Tab 1: Sequences ("Sekos")

#### Sequence Steps

**List view**:
- Step number and title
- "+ Pridėti variantą" button per step
- "+ Pridėti naują žingsnį" button at bottom

**Configuration form**:
- **Tema**: Subject line
- **Žinutės turinys**: Message body (textarea)
- **Žinutės tonas**: Tone dropdown (Neutralus/Draugiškas)
- **AI "strength"**: Slider (0-100%)
- **Vėlavimas**: Delay time (e.g., "24 val.")
- **Papildoma taisyklė**: Additional rule text
- **Išsaugoti žingsnį**: Save button

**Sample steps**:
1. Priminimas dėl mokėjimo
2. Vėlavimo žinutė
3. Galutinis priminimas

**Implementation**: `src/features/ai-automation/components/SequencesTab.tsx`

---

### Tab 2: Time Configuration ("Laikas")

#### Settings

**Day selection**:
- Toggle buttons for each weekday
- Pirm, Antr, Treb, Ketv, Penkt, Šešt, Sekm

**Time interval**:
- Start time (HH:MM)
- End time (HH:MM)

**Limits**:
- Maksimalus žinučių kiekis per dieną
- Minimalus tarpas tarp žinučių (val.)

**Holiday handling**:
- Checkbox: "Nesiųsti šventinėmis dienomis"

**Save button**: "Išsaugoti"

**Implementation**: `src/features/ai-automation/components/TimeConfigTab.tsx`

---

### Tab 3: Analytics ("Analitika")

#### Metrics Cards

Three KPI cards:
- **87%**: Atidarytų žinučių (Open rate)
- **64%**: Paspaudimų rodiklis (Click rate)
- **29%**: Konversijos (Conversion rate)

#### Recent Messages Table

**Columns**:
- Data (Date)
- Žingsnis (Step)
- Klientas (Client)
- Statusas (Status badge)

**Status types**:
- Išsiųsta (Sent) - Blue
- Atidaryta (Opened) - Green
- Nepristatyta (Not delivered) - Red

**Shows**: Last 10 AI messages

**Implementation**: `src/features/ai-automation/components/AnalyticsTab.tsx`

---

## ⚙️ Settings ("Nustatymai")

### Overview

User and company settings management.

**Route**: `/settings`

### Section 1: Personal Information

**Fields**:
- Vardas (First name)
- Pavardė (Last name)
- El. paštas (Email)
- Telefono numeris (Phone)

**Layout**: 2-column grid on desktop, single column on mobile

---

### Section 2: Company Information

**Fields**:
- Įmonės pavadinimas (Company name)
- Įmonės tipas (Company type: UAB, MB, IĮ)
- Įmonės kodas (Company code)
- PVM/VAT numeris (VAT number)
- Banko sąskaita (IBAN)
- Bankas (Bank name)
- Adresas (Address) - full width

**Layout**: 2-column grid, address spans both columns

---

### Section 3: Password Settings

**Separate form with fields**:
- Dabartinis slaptažodis (Current password)
- Naujas slaptažodis (New password)
- Pakartoti slaptažodį (Confirm password)

**Validation**:
- Passwords must match
- Minimum 6 characters
- Current password required

**Button**: "Išsaugoti pakeitimus"

---

### Save Actions

**Main form**: "Išsaugoti visus pakeitimus" button
- Saves personal and company info together

**Password form**: Separate "Išsaugoti pakeitimus" button
- Only updates password

**Implementation**: `src/features/settings/pages/SettingsPage.tsx`

---

## 🎯 User Flows

### New User Journey

1. **Landing** → `/login`
2. Click "Sukurti" → `/signup`
3. Fill registration form
4. Auto-login after signup
5. Redirect to `/dashboard`
6. See welcome state with sample data

### Invoice Management Flow

1. Navigate to "Sąskaitos"
2. View invoice list
3. Apply filters if needed
4. Click "Daugiau" on invoice
5. View full invoice details
6. Send AI reminder if needed
7. Download PDF if needed
8. Return to list

### CSV Import Flow

1. Navigate to "CSV Įkėlimas"
2. Drag file or click to browse
3. Select file type from dropdown
4. Click "Pradėti importą"
5. Watch progress bar
6. See success/error message
7. Import another file or navigate away

### AI Automation Setup Flow

1. Navigate to "AI Automatizacijos"
2. **Sekos tab**: Configure message steps
3. **Laikas tab**: Set sending schedule
4. **Analitika tab**: Monitor performance
5. Messages send automatically based on config

---

## 🔄 State Management

### Global State (Zustand)

**Auth Store**: `src/store/authStore.ts`
- User information
- Authentication status
- Login/logout actions

### Local State (useState)

Each feature manages its own local state:
- Form inputs
- Filter values
- UI state (modals, loading, etc.)

### Mock Data

**Location**: `src/lib/mockData.ts`

**Includes**:
- Sample invoices
- Recent actions
- Chart data
- AI messages
- Sequence steps

**Usage**: Replace with real API calls in production

---

## 🚀 Future Enhancements

### Planned Features

1. **Real API Integration**
   - Replace mock data with backend API
   - Implement proper authentication
   - Real-time updates via WebSockets

2. **Advanced Filtering**
   - Date range filters
   - Multi-status selection
   - Saved filter presets

3. **Bulk Operations**
   - Select multiple invoices
   - Bulk status updates
   - Batch AI message sending

4. **Reporting**
   - Custom date range reports
   - Export to PDF/Excel
   - Email report scheduling

5. **Notifications**
   - In-app notifications
   - Email notifications
   - Push notifications

6. **Multi-language Support**
   - English translation
   - Language switcher
   - i18n integration

---

## 📱 Mobile Considerations

### Mobile-Specific Features

1. **Simplified Navigation**
   - Hamburger menu
   - Bottom navigation option
   - Swipe gestures

2. **Touch Optimizations**
   - Larger tap targets
   - Swipe to delete
   - Pull to refresh

3. **Performance**
   - Lazy loading
   - Image optimization
   - Reduced animations

4. **Offline Support** (Future)
   - Service worker
   - Offline data caching
   - Sync when online

---

## 🔒 Security Considerations

### Current Implementation

1. **Client-side validation**
2. **Protected routes**
3. **LocalStorage for auth token**

### Production Requirements

1. **HTTPS only**
2. **JWT tokens with refresh**
3. **CSRF protection**
4. **Rate limiting**
5. **Input sanitization**
6. **SQL injection prevention**
7. **XSS protection**
8. **Secure password hashing (backend)**

