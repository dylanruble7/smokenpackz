# Load env vars from .env file if it exists
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#=]+)=(.*)$") {
            Set-Item -Path "env:$($Matches[1].Trim())" -Value $Matches[2].Trim()
        }
    }
}

$supabaseUrl = $env:VITE_SUPABASE_URL
$supabaseKey = $env:VITE_SUPABASE_ANON_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env" -ForegroundColor Red
    exit 1
}

$headers = @{
    apikey = $supabaseKey
    Authorization = "Bearer $supabaseKey"
}

$tables = @('chat_rooms', 'chat_messages', 'gp_prices')

foreach ($table in $tables) {
    $url = "$supabaseUrl/rest/v1/$table`?select=*&limit=1"
    try {
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        Write-Host "[OK] Table '$table' exists" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3)
    }
    catch {
        $status = $_.Exception.Response.StatusCode
        Write-Host "[FAIL] Table '$table' - Status: $status" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}
