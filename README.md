# README

Build your home profile by composing git directories

## Getting Started

For detailed example, see
[dineshdb/profile-template](https://github.com/dineshdb/profile-template).

```yaml
# config.yaml
profile:
  - url: https://github.com/dineshdb/profile-template
  - path: ./
```

```bash
deno install -g --allow-env --allow-read --allow-sys --allow-run jsr:@util/profbuilder
```

## License

MIT
