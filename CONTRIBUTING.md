# Contributing to Texo

Thank you for your interest in contributing to Texo! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct.

## How to Contribute

### 1. Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/AadiS27/Texo
   cd Texo
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a `.env.local` file following the template in `.env.template`

### 2. Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes thoroughly
4. Follow the coding style guidelines:
   - Use TypeScript
   - Follow ESLint rules
   - Use Prettier for formatting
   - Write meaningful commit messages

### 3. Submitting Changes

1. Push to your fork
2. Submit a Pull Request (PR)
3. In your PR description:
   - Describe the changes
   - Link any related issues
   - Include screenshots for UI changes

### 4. Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Follow the PR template

## Development Guidelines

### Code Style

- Use TypeScript strictly
- Follow the existing code structure
- Use meaningful variable and function names
- Comment complex logic
- Keep functions small and focused

### Component Guidelines

- Use functional components
- Implement proper error handling
- Use ShadcN UI components when possible
- Maintain responsive design

### Testing (not necessary until your feature is stable)

- Write tests for new features
- Ensure existing tests pass
- Check mobile responsiveness

## Getting Help

- Create an issue for bugs
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the GNU General Public License v3.0.
