# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2026-01-16

### Fixed

- **Event Data Model**: Added `endDate` field to `CalendarEvent` interface to properly support multi-day events
- **Event Creation**: Events now correctly save both start date and end date
- **Event Editing**: Events now properly load and save the end date when editing
- **Date/Time Validation**: Added validation to ensure end time is after start time when on the same day
- **Date Validation**: Added validation to prevent end date from being before start date

### Changed

- **Migrated from expo-av to expo-video**: Replaced deprecated `expo-av` package with `expo-video` for video splash screen functionality (expo-av will be removed in SDK 54)

### Technical Details

- Updated `CalendarEvent` interface in `EventsContext.tsx`
- Updated `create-event.tsx` with proper `endDate` handling and validation
- Updated `edit-event.tsx` with proper `endDate` loading/saving and validation
- Refactored `VideoSplash.tsx` to use `expo-video`'s `VideoView` and `useVideoPlayer` APIs

## [1.0.0] - Initial Release

### Features

- Calendar event management with create, edit, and delete functionality
- Multi-day event support
- Recurring events (daily, weekly, monthly, annually)
- Event reminders with multiple notification options
- Color-coded events (red, purple, blue, green)
- Member assignment and sharing
- Location and notes support
- Video splash screen for onboarding
- User authentication flow
- Modern UI with NativeWind/Tailwind CSS styling
