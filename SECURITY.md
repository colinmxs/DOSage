# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within DOSage, please send an email to the.sbmt.api@gmail.com. All security vulnerabilities will be promptly addressed.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

When reporting a vulnerability, please include:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours.
- **Initial Assessment**: We will send you a more detailed response within 7 days indicating the next steps in handling your report.
- **Fix & Disclosure**: After the initial assessment, we will keep you informed of the progress towards a fix and full announcement. We aim to resolve critical issues within 30 days.

### Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported releases
4. Release new versions and publicly announce the issue

We appreciate your efforts to responsibly disclose your findings and will make every effort to acknowledge your contributions.

## Security Best Practices for Users

When using DOSage in your projects:

- Always use the latest version to ensure you have the latest security patches
- Regularly update your dependencies
- Follow secure coding practices when implementing components
- Sanitize user input when using DOSage components with dynamic content
- Review our documentation for security-related configuration options

## Security Updates

Security updates will be documented in:
- [CHANGELOG.md](CHANGELOG.md) with a `[SECURITY]` prefix
- GitHub Security Advisories
- Release notes on GitHub Releases

## Contact

For any questions about this security policy, please contact the.sbmt.api@gmail.com.
