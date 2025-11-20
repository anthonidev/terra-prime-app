param (
    [Parameter(Mandatory=$false)]
    [string]$Command
)

if (-not $Command) {
    Write-Host "Usage: .\tasks.ps1 [command]"
    Write-Host "Commands:"
    Write-Host "  dev      - Run development server"
    Write-Host "  build    - Build the application"
    Write-Host "  start    - Start the production server"
    Write-Host "  lint     - Lint the code"
    Write-Host "  install  - Install dependencies"
    exit
}

switch ($Command) {
    "dev" { bun run dev }
    "build" { bun run build }
    "start" { bun run start }
    "lint" { bun run lint }
    "install" { bun install }
    Default {
        Write-Host "Unknown command '$Command'. Use no arguments to see available commands."
    }
}
