Add-Type -AssemblyName System.Drawing

$imgDir = "src/assets/img"
$files = Get-ChildItem -Path $imgDir -Include *.jpeg, *.jpg -Recurse

foreach ($file in $files) {
    # Skip if backup exists
    $backupPath = "$($file.FullName).orig"
    if (-not (Test-Path $backupPath)) {
        Copy-Item $file.FullName $backupPath
    }

    $src = [System.Drawing.Image]::FromFile($backupPath)
    $origW = $src.Width
    $origH = $src.Height
    $maxDim = 1280

    if ($origW -gt $maxDim -or $origH -gt $maxDim) {
        if ($origW -ge $origH) {
            $newW = $maxDim
            $newH = [int]($origH * ($maxDim / $origW))
        } else {
            $newH = $maxDim
            $newW = [int]($origW * ($maxDim / $origH))
        }

        $dest = New-Object System.Drawing.Bitmap $newW, $newH
        $dest.SetResolution($src.HorizontalResolution, $src.VerticalResolution)
        $g = [System.Drawing.Graphics]::FromImage($dest)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

        $rect = New-Object System.Drawing.Rectangle 0, 0, $newW, $newH
        $g.DrawImage($src, $rect)

        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]88)

        $src.Dispose()
        $g.Dispose()

        $dest.Save($file.FullName, $jpegCodec, $encoderParams)
        $dest.Dispose()

        $newSize = (Get-Item $file.FullName).Length
        Write-Output "Optimized $($file.Name): ${origW}x${origH} -> ${newW}x${newH} ($([math]::round($newSize/1KB, 1)) KB)"
    } else {
        $src.Dispose()
        Write-Output "Skipped $($file.Name): already within limits (${origW}x${origH})"
    }
}
