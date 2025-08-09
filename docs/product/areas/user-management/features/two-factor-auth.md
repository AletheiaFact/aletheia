# Two-Factor Authentication (2FA)

## Overview
Two-Factor Authentication provides an additional layer of security using Time-based One-Time Passwords (TOTP) to protect user accounts.

## Implementation

### TOTP Support
- Time-based one-time passwords
- 6-digit verification codes
- 30-second validity window
- QR code setup

### Compatible Apps
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Any TOTP-compatible app

## Setup Process

### Enrollment
1. Navigate to security settings
2. Enable 2FA option
3. Scan QR code with authenticator app
4. Verify with test code
5. Save backup codes

### Backup Codes
- 10 single-use recovery codes
- Secure storage recommendation
- Regeneration capability
- Usage tracking

## Authentication Flow

### Login Process
1. Enter email and password
2. Prompt for 2FA code
3. Enter current TOTP code
4. Validate and create session
5. Remember device option

### Recovery Options
- Backup code usage
- Admin account recovery
- Email verification fallback
- Support ticket process

## Security Features

### Protection Against
- Password theft
- Phishing attacks
- Unauthorized access
- Account takeover

### Rate Limiting
- Failed attempt tracking
- Temporary account locking
- Progressive delays
- IP-based restrictions

## User Interface
- Setup wizard
- QR code display
- Code input field
- Recovery options
- Status indicators

## Technical Details
- **Component**: `Totp.tsx`
- **Integration**: Ory Kratos TOTP support
- **Algorithm**: TOTP (RFC 6238)
- **Secret Length**: 32 bytes
- **Code Length**: 6 digits