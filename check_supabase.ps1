$headers = @{
    apikey = 'YOUR_SUPABASE_ANON_KEY'
    Authorization = 'Bearer YOUR_SUPABASE_ANON_KEY'
}

$tables = @('chat_rooms', 'chat_messages', 'gp_prices')

foreach ($table in $tables) {
    $url = "https://YOUR_SUPABASE_URL/rest/v1/$table`?select=*&limit=1"
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
