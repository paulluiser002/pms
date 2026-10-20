
$p='performance/dist/views.js'
$s=Get-Content $p -Raw
$s=$s.Replace("closed=currentCycle().status==='Closed'","closed=currentCycle().status!=='Active'")
$s=$s.Replace(' This cycle is closed; reviews are read only.',' This cycle is not active; reviews are read only.')
$s=$s.Replace('Sofia reports to Daniel Lim.', 'Sofia reports to Angela Reyes in this demo.')
$start=$s.IndexOf(' The Manager demo is Angela Reyes,')
$end=$s.IndexOf('</li>', $start)
if($start -ge 0 -and $end -gt $start){$s=$s.Substring(0,$start)+' Manager → Team Reviews → complete her evaluation. Return to Employee → My Reviews to acknowledge it.'+$s.Substring($end)}
Set-Content $p $s -Encoding utf8
$html=Get-Content performance/dist/index.html -Raw
$css=Get-Content performance/dist/style.css -Raw
$js=Get-Content performance/dist/app.js -Raw
$views=Get-Content performance/dist/views.js -Raw
$html=$html.Replace('<link rel="stylesheet" href="style.css">',('<style>'+$css+'</style>')).Replace('<script src="app.js"></script>',('<script>'+$js+'</script>')).Replace('<script src="views.js"></script>',('<script>'+$views+'</script>'))
Set-Content outputs/performance-mvp.html $html -Encoding utf8
Copy-Item performance/dist/* outputs/ -Force
Compress-Archive -Path performance/dist/* -DestinationPath outputs/performance-mvp.zip -Force

