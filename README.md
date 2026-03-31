# Claude Code — Build from Source

Сборка Claude Code CLI из утёкших исходников (March 31, 2026). Репозиторий содержит полный `src/` (~1900 файлов TypeScript), build-конфигурацию и все необходимые stubs для компиляции.

## Требования

- **Bun** >= 1.3 ([bun.sh](https://bun.sh))
- **ripgrep** (для Grep/Glob tools)
- Linux или macOS
- 4GB RAM, 2GB диска

```bash
# Установка Bun
curl -fsSL https://bun.sh/install | bash

# Установка ripgrep
sudo apt install ripgrep        # Ubuntu/Debian
brew install ripgrep             # macOS
```

## Быстрый старт

```bash
git clone https://github.com/vvirtr/claude-code.git
cd claude-code
bun install
bun run build
```

## Запуск

```bash
# С API ключом Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."
bun dist/cli.js

# Pipe-режим (ответ и выход)
bun dist/cli.js -p "Hello"

# С кастомным провайдером (OpenRouter, Z.AI, etc.)
export ANTHROPIC_API_KEY="your-key"
export ANTHROPIC_BASE_URL="https://openrouter.ai/api/v1"
export ANTHROPIC_MODEL="anthropic/claude-sonnet-4"
bun dist/cli.js
```

### Полезные флаги

```bash
bun dist/cli.js --version              # Версия
bun dist/cli.js --help                 # Все опции
bun dist/cli.js --model opus           # Выбор модели (sonnet/opus/haiku)
bun dist/cli.js -p "prompt" --json     # JSON output
bun dist/cli.js -c                     # Продолжить последнюю сессию
bun dist/cli.js -d                     # Debug mode
```

### Обход проверки версии

Если CLI блокирует запуск (remote version check от Anthropic):

```bash
# Вариант 1: пересобрать с высокой версией
VERSION=99.0.0 bun run build

# Вариант 2: отключить assertMinVersion()
NODE_ENV=test bun dist/cli.js
```

## Структура репозитория

```
├── src/                  # 1900+ TypeScript исходников Claude Code
│   ├── entrypoints/      # Entry points (cli.tsx, mcp.ts, init.ts)
│   ├── tools/            # Инструменты (Bash, Edit, Read, Grep, Glob, Agent, ...)
│   ├── commands/         # Slash-команды (/commit, /review, /compact, ...)
│   ├── services/         # API, MCP, OAuth, LSP, аналитика
│   ├── components/       # React/Ink UI (~140 компонентов)
│   ├── hooks/            # React hooks
│   ├── bridge/           # IDE интеграция (VS Code, JetBrains)
│   └── utils/            # Утилиты
├── stubs/                # Type declarations для внутренних Anthropic пакетов
├── build.ts              # Bun build script с feature flags и MACRO defines
├── package.json          # Зависимости (~80 пакетов)
└── tsconfig.json         # TypeScript конфигурация
```

## Что такое stubs/

Внутренние пакеты Anthropic (`@ant/*`, `@anthropic-ai/sandbox-runtime`, `color-diff-napi`, etc.) недоступны на npm. Для них созданы заглушки:

- **`stubs/`** — `.d.ts` файлы для TypeScript type checking
- **`node_modules/` stubs** — создаются при `bun install` через `postinstall` или вручную (см. `setup-stubs.sh`)

Также ~24 `.ts` файла в `src/` — stubs для feature-gated кода, который был вырезан при сборке оригинала (внутренние инструменты, generated SDK types).

## Сборка вручную

```bash
# Установить зависимости
bun install

# Собрать (результат в dist/)
bun run build

# Или напрямую:
bun build.ts
```

### Build параметры

| Параметр | Описание |
|----------|----------|
| `VERSION` env var | Версия в выводе `--version` (по умолчанию 2.1.88) |
| Entry point | `src/entrypoints/cli.tsx` |
| Target | `bun` |
| Feature flags | 88 флагов, все `false` для external build |
| MACRO defines | VERSION, BUILD_TIME, BUILD_TIMESTAMP, FEEDBACK_CHANNEL, ISSUES_EXPLAINER, PACKAGE_URL, NATIVE_PACKAGE_URL, VERSION_CHANGELOG |

## Ограничения

- **Syntax highlighting диффов** — `color-diff-napi` заменён заглушкой (нативный C++ модуль Anthropic)
- **Feature flags** — `bun:bundle` `feature()` возвращает `false`. Голосовой режим, BRIDGE_MODE, PROACTIVE и ~80 фич отключены
- **Sandbox** — `SandboxManager.isSupportedPlatform()` возвращает `false`
- **Внутренние инструменты** (TungstenTool, REPLTool, etc.) — null-заглушки
- **Native attestation** — `cch` header не вычисляется (встроен в Bun binary Anthropic)

## Disclaimer

Исходный код является собственностью [Anthropic](https://www.anthropic.com). Репозиторий создан в исследовательских целях.
