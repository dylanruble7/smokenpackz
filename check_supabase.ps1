$headers = @{
    apikey = 'sb_publishable_ZoCz1UOxHBjDNYrQopMlng_W9_XZpjf'
    Authorization = 'Bearer sb_publishable_ZoCz1UOxHBjDNYrQopMlng_W9_XZpjf'
}

$tables = @('chat_rooms', 'chat_messages', 'gp_prices')

foreach ($table in $tables) {
    $url = "https://vcujwekschxbopapkhsz.supabase.co/rest/v1/$table`?select=*&limit=1"
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
