# Fix supabase references in server actions
$files = @(
    "src\app\actions\purchases.ts",
    "src\app\actions\seed-data.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Updating $file"
        $content = Get-Content $file -Raw
        $content = $content -replace 'await supabase', 'await supabaseAdmin'
        Set-Content $file -Value $content -NoNewline
        Write-Host "Updated $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Done!"
