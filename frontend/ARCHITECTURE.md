# 🏗️ VietSign - Kiến Trúc Dự Án

> Tài liệu này mô tả cấu trúc hiện tại và đề xuất cấu trúc mới cho dự án VietSign.

---

## 📋 Mục Lục

1. [Tổng Quan Dự Án](#tổng-quan-dự-án)
2. [Tech Stack](#tech-stack)
3. [Cấu Trúc Hiện Tại](#cấu-trúc-hiện-tại)
4. [Đánh Giá Cấu Trúc Hiện Tại](#đánh-giá-cấu-trúc-hiện-tại)
5. [Cấu Trúc Đề Xuất Mới](#cấu-trúc-đề-xuất-mới)
6. [Chi Tiết Từng Module](#chi-tiết-từng-module)
7. [Kế Hoạch Migration](#kế-hoạch-migration)
8. [Quy Tắc Đặt Tên](#quy-tắc-đặt-tên)

---

## 📌 Tổng Quan Dự Án

**VietSign** là một ứng dụng học ngôn ngữ ký hiệu Việt Nam, bao gồm các tính năng:

- 🎓 **Học tập (Learn)**: Tự học theo chủ đề, bài học
- 📚 **Lớp học (Study)**: Học theo lớp với giáo viên
- 🎮 **Trò chơi (Games)**: Học qua game tương tác
- 📖 **Từ điển (Dictionary)**: Tra cứu từ vựng ký hiệu
- 🏋️ **Luyện tập (Practice)**: Luyện từ, câu, đánh vần
- 📝 **Thi cử (Exams)**: Kiểm tra đánh giá
- 🏢 **Quản lý (Management)**: Admin quản lý hệ thống

---

## 🛠️ Tech Stack

| Công nghệ         | Phiên bản | Mục đích                       |
| ----------------- | --------- | ------------------------------ |
| **Next.js**       | 16.0.7    | Framework React với App Router |
| **React**         | 19.2.0    | UI Library                     |
| **TypeScript**    | ^5        | Type-safe JavaScript           |
| **Ant Design**    | ^6.1.1    | UI Component Library           |
| **TailwindCSS**   | ^4.1.18   | Utility-first CSS              |
| **Redux Toolkit** | ^2.11.2   | State Management               |
| **React Query**   | ^5.90.12  | Server State Management        |
| **Firebase**      | ^12.7.0   | Authentication & Backend       |
| **Axios**         | ^1.13.2   | HTTP Client                    |

---

## 🆕 Cấu Trúc Đề Xuất

### Nguyên Tắc Thiết Kế

1. **Feature-First**: Tổ chức code theo tính năng, không theo loại file
2. **Colocation**: Code liên quan đặt cùng nhau
3. **Separation of Concerns**: Tách biệt UI, logic, data
4. **Single Responsibility**: Mỗi module làm một việc
5. **DRY (Don't Repeat Yourself)**: Tái sử dụng code tối đa

### Cấu Trúc Chi Tiết

```
vietsign/
├── .env.local
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── ARCHITECTURE.md               # 📄 Tài liệu này
│
├── public/                       # Static assets
│   ├── images/
│   ├── videos/
│   └── icons/
│
└── src/
    │
    ├── app/                      # 🛣️ ROUTING ONLY
    │   │                         # Chỉ chứa page.tsx, layout.tsx, loading.tsx
    │   │
    │   ├── (public)/             # 🌐 Public routes (không cần login)
    │   │   ├── layout.tsx        # Public layout
    │   │   ├── page.tsx          # Landing page
    │   │   ├── about/
    │   │   └── contact/
    │   │
    │   ├── (auth)/               # 🔐 Authentication routes
    │   │   ├── layout.tsx        # Auth layout (centered, no sidebar)
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   ├── register/
    │   │   │   └── page.tsx
    │   │   └── forgot-password/
    │   │       └── page.tsx
    │   │
    │   ├── (main)/               # 🏠 Authenticated routes (cần login)
    │   │   ├── layout.tsx        # Main layout (sidebar, header)
    │   │   │
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   │
    │   │   ├── study/            # Học theo lớp
    │   │   │   ├── page.tsx
    │   │   │   └── [classId]/
    │   │   │       ├── page.tsx
    │   │   │       └── [lessonId]/
    │   │   │           ├── page.tsx
    │   │   │           └── [stepId]/
    │   │   │               └── page.tsx
    │   │   │
    │   │   ├── learn/            # Tự học
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── games/            # Trò chơi
    │   │   │   ├── page.tsx
    │   │   │   └── [gameId]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── practice/         # Luyện tập
    │   │   │   ├── page.tsx
    │   │   │   └── [mode]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── dictionary/       # Từ điển
    │   │   │   ├── page.tsx
    │   │   │   └── [wordId]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── messages/
    │   │   │   └── page.tsx
    │   │   │
    │   │   ├── notifications/
    │   │   │   └── page.tsx
    │   │   │
    │   │   └── settings/
    │   │       ├── page.tsx
    │   │       └── [...slug]/
    │   │           └── page.tsx
    │   │
    │   ├── (admin)/              # 👨‍💼 Admin routes
    │   │   ├── layout.tsx        # Admin layout (có thể khác main)
    │   │   │
    │   │   ├── users-management/
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── classes-management/
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── organizations-management/
    │   │   │   ├── page.tsx
    │   │   │   └── [id]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   ├── exams-management/
    │   │   ├── games-management/
    │   │   ├── dictionary-management/
    │   │   ├── learning-management/
    │   │   ├── questions-management/
    │   │   ├── grading-management/
    │   │   ├── tools-management/
    │   │   └── permissions-management/
    │   │
    │   ├── api/                  # API Routes (nếu cần)
    │   │   └── ...
    │   │
    │   ├── layout.tsx            # Root layout
    │   ├── loading.tsx           # Global loading
    │   ├── not-found.tsx         # 404 page
    │   ├── error.tsx             # Error boundary
    │   └── globals.css           # Global styles
    │
    │
    ├── features/                 # 🎯 FEATURE MODULES
    │   │                         # Mỗi feature là một module độc lập
    │   │
    │   ├── auth/                 # 🔐 Authentication Feature
    │   │   ├── components/
    │   │   │   ├── LoginForm.tsx
    │   │   │   ├── RegisterForm.tsx
    │   │   │   ├── ForgotPasswordForm.tsx
    │   │   │   └── index.ts      # Export tất cả
    │   │   ├── hooks/
    │   │   │   ├── useAuth.ts
    │   │   │   ├── useLogin.ts
    │   │   │   └── index.ts
    │   │   ├── services/
    │   │   │   └── authService.ts
    │   │   ├── types/
    │   │   │   └── index.ts
    │   │   └── index.ts          # Public API của feature
    │   │
    │   ├── study/                # 📚 Study Feature (Học theo lớp)
    │   │   ├── components/
    │   │   │   ├── ClassList/
    │   │   │   │   ├── ClassList.tsx
    │   │   │   │   ├── ClassCard.tsx
    │   │   │   │   └── index.ts
    │   │   │   ├── ClassDetail/
    │   │   │   │   ├── ClassDetail.tsx
    │   │   │   │   ├── ClassInfo.tsx
    │   │   │   │   ├── LessonList.tsx
    │   │   │   │   └── index.ts
    │   │   │   ├── LessonDetail/
    │   │   │   │   ├── LessonDetail.tsx
    │   │   │   │   ├── StepList.tsx
    │   │   │   │   └── index.ts
    │   │   │   ├── StepRenderer/
    │   │   │   │   ├── StepRenderer.tsx
    │   │   │   │   ├── steps/
    │   │   │   │   │   ├── VocabularyStep.tsx
    │   │   │   │   │   ├── SentenceStep.tsx
    │   │   │   │   │   ├── QuizStep.tsx
    │   │   │   │   │   └── ...
    │   │   │   │   └── index.ts
    │   │   │   ├── ClassRegistrationModal.tsx
    │   │   │   └── index.ts
    │   │   ├── hooks/
    │   │   │   ├── useClasses.ts
    │   │   │   ├── useLessons.ts
    │   │   │   ├── useSteps.ts
    │   │   │   └── index.ts
    │   │   ├── services/
    │   │   │   ├── classService.ts
    │   │   │   └── lessonService.ts
    │   │   ├── types/
    │   │   │   └── index.ts
    │   │   └── index.ts
    │   │
    │   ├── learn/                # 🎓 Self-Learning Feature (Tự học)
    │   │   ├── components/
    │   │   │   ├── TopicList/
    │   │   │   ├── TopicDetail/
    │   │   │   ├── LessonViewer/
    │   │   │   └── index.ts
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── types/
    │   │   └── index.ts
    │   │
    │   ├── games/                # 🎮 Games Feature
    │   │   ├── components/
    │   │   │   ├── GameList/
    │   │   │   ├── GameCard/
    │   │   │   ├── games/        # Từng loại game
    │   │   │   │   ├── GuessSignGame/
    │   │   │   │   ├── MatchingGame/
    │   │   │   │   ├── SpellingGame/
    │   │   │   │   └── ...
    │   │   │   └── index.ts
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── types/
    │   │   └── index.ts
    │   │
    │   ├── practice/             # 🏋️ Practice Feature
    │   │   ├── components/
    │   │   │   ├── PracticeRoom/
    │   │   │   ├── WordPractice/
    │   │   │   ├── SentencePractice/
    │   │   │   ├── SpellingPractice/
    │   │   │   └── index.ts
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── types/
    │   │   └── index.ts
    │   │
    │   ├── dictionary/           # 📖 Dictionary Feature
    │   │   ├── components/
    │   │   │   ├── WordList/
    │   │   │   ├── WordDetail/
    │   │   │   ├── SearchBar/
    │   │   │   └── index.ts
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── types/
    │   │   └── index.ts
    │   │
    │   ├── exams/                # 📝 Exams Feature
    │   │   ├── components/
    │   │   │   ├── ExamList/
    │   │   │   ├── ExamTaking/
    │   │   │   ├── ExamResult/
    │   │   │   └── index.ts
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── types/
    │   │   └── index.ts
    │   │
    │   ├── messages/             # 💬 Messages Feature
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── types/
    │   │   └── index.ts
    │   │
    │   ├── notifications/        # 🔔 Notifications Feature
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── types/
    │   │   └── index.ts
    │   │
    │   ├── settings/             # ⚙️ Settings Feature
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── types/
    │   │   └── index.ts
    │   │
    │   └── management/           # 👨‍💼 Management Features
    │       ├── users/
    │       │   ├── components/
    │       │   ├── hooks/
    │       │   ├── services/
    │       │   └── index.ts
    │       ├── classes/
    │       ├── organizations/
    │       ├── exams/
    │       ├── games/
    │       ├── dictionary/
    │       ├── questions/
    │       └── ...
    │
    │
    ├── shared/                   # 🔧 SHARED CODE
    │   │                         # Dùng chung cho nhiều features
    │   │
    │   ├── components/           # Shared UI Components
    │   │   │
    │   │   ├── ui/               # Primitive UI Components
    │   │   │   ├── Button/
    │   │   │   │   ├── Button.tsx
    │   │   │   │   ├── Button.styles.ts
    │   │   │   │   └── index.ts
    │   │   │   ├── Input/
    │   │   │   ├── Modal/
    │   │   │   ├── Card/
    │   │   │   ├── Badge/
    │   │   │   ├── Avatar/
    │   │   │   ├── Spinner/
    │   │   │   └── index.ts
    │   │   │
    │   │   ├── layout/           # Layout Components
    │   │   │   ├── Header/
    │   │   │   │   ├── Header.tsx
    │   │   │   │   ├── HeaderNav.tsx
    │   │   │   │   └── index.ts
    │   │   │   ├── Footer/
    │   │   │   ├── Sidebar/
    │   │   │   │   ├── Sidebar.tsx
    │   │   │   │   ├── SidebarNav.tsx
    │   │   │   │   ├── SidebarItem.tsx
    │   │   │   │   └── index.ts
    │   │   │   ├── MainLayout.tsx
    │   │   │   ├── AuthLayout.tsx
    │   │   │   ├── AdminLayout.tsx
    │   │   │   └── index.ts
    │   │   │
    │   │   ├── common/           # Common Components
    │   │   │   ├── VideoPlayer/
    │   │   │   │   ├── VideoPlayer.tsx
    │   │   │   │   ├── VideoControls.tsx
    │   │   │   │   └── index.ts
    │   │   │   ├── Pagination/
    │   │   │   ├── SearchBox/
    │   │   │   ├── EmptyState/
    │   │   │   ├── ErrorBoundary/
    │   │   │   ├── LoadingState/
    │   │   │   ├── ConfirmModal/
    │   │   │   └── index.ts
    │   │   │
    │   │   ├── forms/            # Form Components
    │   │   │   ├── FormInput/
    │   │   │   ├── FormSelect/
    │   │   │   ├── FormTextarea/
    │   │   │   ├── FormUpload/
    │   │   │   └── index.ts
    │   │   │
    │   │   └── index.ts          # Export all shared components
    │   │
    │   ├── hooks/                # Shared Hooks
    │   │   ├── useDebounce.ts
    │   │   ├── useLocalStorage.ts
    │   │   ├── useMediaQuery.ts
    │   │   ├── usePagination.ts
    │   │   ├── useClickOutside.ts
    │   │   └── index.ts
    │   │
    │   ├── utils/                # Utility Functions
    │   │   ├── format/
    │   │   │   ├── date.ts       # formatDate, formatTime, etc.
    │   │   │   ├── number.ts     # formatCurrency, formatPercent
    │   │   │   └── index.ts
    │   │   ├── validation/
    │   │   │   ├── schemas.ts    # Validation schemas
    │   │   │   └── index.ts
    │   │   ├── helpers/
    │   │   │   ├── string.ts
    │   │   │   ├── array.ts
    │   │   │   └── index.ts
    │   │   └── index.ts
    │   │
    │   ├── constants/            # App Constants
    │   │   ├── routes.ts         # Route paths
    │   │   ├── api.ts            # API endpoints
    │   │   ├── roles.ts          # User roles
    │   │   ├── status.ts         # Status enums
    │   │   └── index.ts
    │   │
    │   └── types/                # Shared Types
    │       ├── common.ts         # Pagination, Response, etc.
    │       ├── api.ts            # API types
    │       └── index.ts
    │
    │
    ├── core/                     # ⚙️ CORE INFRASTRUCTURE
    │   │                         # Cấu hình và setup hệ thống
    │   │
    │   ├── config/               # Configuration
    │   │   ├── env.ts            # Environment variables
    │   │   ├── api.ts            # API configuration
    │   │   ├── firebase.ts       # Firebase config
    │   │   ├── theme.ts          # Theme configuration
    │   │   └── index.ts
    │   │
    │   ├── providers/            # Context Providers
    │   │   ├── AuthProvider.tsx
    │   │   ├── ThemeProvider.tsx
    │   │   ├── QueryProvider.tsx
    │   │   ├── ToastProvider.tsx
    │   │   └── index.ts
    │   │
    │   ├── store/                # Redux Store
    │   │   ├── store.ts          # Store configuration
    │   │   ├── StoreProvider.tsx
    │   │   ├── slices/
    │   │   │   ├── authSlice.ts
    │   │   │   ├── uiSlice.ts
    │   │   │   └── index.ts
    │   │   ├── hooks.ts          # useAppDispatch, useAppSelector
    │   │   └── index.ts
    │   │
    │   ├── services/             # Base Services
    │   │   ├── api/
    │   │   │   ├── apiClient.ts  # Axios instance
    │   │   │   ├── apiError.ts   # Error handling
    │   │   │   └── index.ts
    │   │   ├── storage/
    │   │   │   ├── localStorage.ts
    │   │   │   └── index.ts
    │   │   └── index.ts
    │   │
    │   ├── lib/                  # External Libraries Setup
    │   │   ├── firebase.ts
    │   │   ├── gemini.ts
    │   │   └── index.ts
    │   │
    │   └── types/                # Core Types
    │       ├── env.d.ts          # Environment types
    │       └── index.ts
    │
    │
    ├── data/                     # 📊 MOCK DATA (Giữ nguyên)
    │   │                         # Dễ dàng thay thế bằng API sau này
    │   │
    │   ├── classesData.ts
    │   ├── lessonsData.ts
    │   ├── dictionaryData.ts
    │   ├── gamesData.ts
    │   ├── learnData.ts
    │   ├── selfLearnData.ts
    │   ├── examsData.ts
    │   ├── messagesData.ts
    │   ├── usersData.ts
    │   ├── organizationsData.ts
    │   └── index.ts
    │
    │
    └── domain/                   # 🏛️ DOMAIN MODELS (thay model/)
        │                         # Business entities và logic
        │
        ├── entities/             # Domain Entities
        │   ├── User.ts
        │   ├── Class.ts
        │   ├── Lesson.ts
        │   ├── Step.ts
        │   ├── Dictionary.ts
        │   ├── Game.ts
        │   ├── Exam.ts
        │   ├── Organization.ts
        │   └── index.ts
        │
        ├── enums/                # Domain Enums
        │   ├── UserRole.ts
        │   ├── StepType.ts
        │   ├── ExamStatus.ts
        │   └── index.ts
        │
        └── interfaces/           # Domain Interfaces
            ├── IUser.ts
            ├── IClass.ts
            └── index.ts
```

---

## 📦 Chi Tiết Từng Module

### 1. `app/` - Routing Layer

**Mục đích**: Chỉ xử lý routing, không chứa business logic.

```tsx
// app/(main)/study/page.tsx
import { StudyPage } from "@/features/study";

export default function Page() {
  return <StudyPage />;
}
```

**Quy tắc**:

- ✅ Chỉ chứa `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- ✅ Import components từ `features/`
- ❌ Không viết logic phức tạp ở đây
- ❌ Không định nghĩa components ở đây

---

### 2. `features/` - Feature Modules

**Mục đích**: Chứa code của từng tính năng, tổ chức độc lập.

**Cấu trúc mỗi feature**:

```
features/study/
├── components/           # UI components của feature
│   ├── ClassList.tsx
│   ├── ClassDetail.tsx
│   └── index.ts
├── hooks/                # Custom hooks của feature
│   ├── useClasses.ts
│   └── index.ts
├── services/             # API calls của feature
│   ├── classService.ts
│   └── index.ts
├── types/                # Types riêng của feature
│   └── index.ts
├── utils/                # Utils riêng của feature (nếu cần)
│   └── index.ts
└── index.ts              # Public API - chỉ export những gì cần thiết
```

**Ví dụ `index.ts`**:

```tsx
// features/study/index.ts

// Components
export { ClassList } from "./components/ClassList";
export { ClassDetail } from "./components/ClassDetail";
export { StudyPage } from "./components/StudyPage";

// Hooks
export { useClasses } from "./hooks/useClasses";

// Types
export type { Class, Lesson, Step } from "./types";
```

**Quy tắc**:

- ✅ Mỗi feature là một unit độc lập
- ✅ Feature A có thể import từ `shared/`
- ✅ Feature A có thể import public API từ Feature B
- ❌ Không import internal files từ feature khác
- ❌ Tránh circular dependencies

---

### 3. `shared/` - Shared Code

**Mục đích**: Chứa code dùng chung cho nhiều features.

**Khi nào đưa vào shared**:

- Component được dùng ở ≥ 2 features
- Hook có thể tái sử dụng
- Utility functions chung

**Import convention**:

```tsx
// Dùng barrel exports
import { Button, Modal, Card } from "@/shared/components";
import { useDebounce, useLocalStorage } from "@/shared/hooks";
import { formatDate, formatCurrency } from "@/shared/utils";
```

---

### 4. `core/` - Core Infrastructure

**Mục đích**: Setup và cấu hình hệ thống.

**Bao gồm**:

- API client configuration
- Firebase setup
- Redux store
- Context providers
- Environment variables

---

### 5. `domain/` - Domain Models

**Mục đích**: Định nghĩa business entities.

```tsx
// domain/entities/User.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
}

// domain/enums/UserRole.ts
export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}
```

---

## 🚀 Kế Hoạch Migration

### Phase 1: Chuẩn Bị (1-2 ngày)

1. [ ] Tạo cấu trúc thư mục mới (rỗng)
2. [ ] Setup path aliases trong `tsconfig.json`
3. [ ] Tạo các file `index.ts` barrel exports

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/core/*": ["./src/core/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/data/*": ["./src/data/*"]
    }
  }
}
```

### Phase 2: Core & Shared (2-3 ngày)

1. [ ] Di chuyển `config/` → `core/config/`
2. [ ] Di chuyển `providers/` → `core/providers/`
3. [ ] Di chuyển `store/` → `core/store/`
4. [ ] Di chuyển `components/layout/` → `shared/components/layout/`
5. [ ] Di chuyển `components/common/` → `shared/components/common/`
6. [ ] Di chuyển `utils/` → `shared/utils/`

### Phase 3: Domain (1 ngày)

1. [ ] Tạo `domain/entities/` từ `model/`
2. [ ] Tạo `domain/enums/`
3. [ ] Update imports

### Phase 4: Features (5-7 ngày)

Di chuyển từng feature một:

| Ưu tiên | Feature        | Components cần di chuyển    |
| ------- | -------------- | --------------------------- |
| 1       | `auth`         | `components/auth/*`         |
| 2       | `study`        | `components/study/*`        |
| 3       | `learn`        | `components/learn/*`        |
| 4       | `games`        | `components/games/*`        |
| 5       | `practice`     | `components/practice/*`     |
| 6       | `dictionary`   | `components/dictionary/*`   |
| 7       | `messages`     | `components/messages/*`     |
| 8       | `management/*` | `components/*-management/*` |

### Phase 5: Cleanup (1-2 ngày)

1. [ ] Xóa thư mục cũ
2. [ ] Update tất cả imports
3. [ ] Test toàn bộ ứng dụng
4. [ ] Update documentation

---

## 📝 Quy Tắc Đặt Tên

### Files & Folders

| Loại       | Convention                     | Ví dụ                  |
| ---------- | ------------------------------ | ---------------------- |
| Components | PascalCase                     | `UserProfile.tsx`      |
| Hooks      | camelCase, bắt đầu `use`       | `useAuth.ts`           |
| Utils      | camelCase                      | `formatDate.ts`        |
| Services   | camelCase, kết thúc `Service`  | `userService.ts`       |
| Types      | PascalCase                     | `User.ts`              |
| Constants  | camelCase hoặc SCREAMING_SNAKE | `routes.ts`, `API_URL` |
| Folders    | kebab-case hoặc camelCase      | `user-profile/`        |

### Component Structure

```tsx
// ComponentName.tsx

// 1. Imports
import { useState } from "react";
import { Button } from "@/shared/components";

// 2. Types
interface ComponentNameProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export function ComponentName({ title, onAction }: ComponentNameProps) {
  // 3a. Hooks
  const [state, setState] = useState(null);

  // 3b. Handlers
  const handleClick = () => {
    onAction();
  };

  // 3c. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
}

// 4. Default export (optional)
export default ComponentName;
```

### Import Order

```tsx
// 1. React & Next
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. Third-party libraries
import { Button, Modal } from "antd";
import { motion } from "framer-motion";

// 3. Core
import { useAppSelector } from "@/core/store";

// 4. Shared
import { VideoPlayer } from "@/shared/components";
import { formatDate } from "@/shared/utils";

// 5. Features
import { useClasses } from "@/features/study";

// 6. Local imports
import { StepRenderer } from "./StepRenderer";
import type { StepProps } from "./types";
```

---

## ✅ Checklist

Sử dụng checklist này khi tạo feature mới:

```markdown
## Feature: [Feature Name]

### Setup

- [ ] Tạo folder `features/[name]/`
- [ ] Tạo `index.ts` với public exports
- [ ] Tạo `types/index.ts`

### Components

- [ ] Tạo components cần thiết
- [ ] Export từ `components/index.ts`

### Hooks

- [ ] Tạo custom hooks
- [ ] Export từ `hooks/index.ts`

### Services

- [ ] Tạo service files
- [ ] Export từ `services/index.ts`

### Integration

- [ ] Tạo page trong `app/`
- [ ] Import từ feature's public API
- [ ] Test functionality
```

---

## 📚 Tài Liệu Tham Khảo

- [Next.js App Router](https://nextjs.org/docs/app)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

> 📅 **Cập nhật lần cuối**: 2026-01-20
>
> 👤 **Tác giả**: AI Assistant
