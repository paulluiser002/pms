$html=Get-Content performance/dist/index.html -Raw
$css=Get-Content performance/dist/style.css -Raw
$js=Get-Content performance/dist/app.js -Raw
$views=Get-Content performance/dist/views.js -Raw
$reviewCss=Get-Content performance/dist/reviews.css -Raw
$reviewJs=Get-Content performance/dist/reviews.js -Raw
$revisionCss=Get-Content performance/dist/revisions.css -Raw
$revisionJs=Get-Content performance/dist/revisions.js -Raw
$tableCss=Get-Content performance/dist/tables.css -Raw
$tableJs=Get-Content performance/dist/tables.js -Raw
$dashboardCss=Get-Content performance/dist/dashboard.css -Raw
$dashboardJs=Get-Content performance/dist/dashboard.js -Raw
$html=$html.Replace('<link rel="stylesheet" href="style.css">',('<style>'+$css+'</style>')).Replace('<script src="app.js"></script>',('<script>'+$js+'</script>')).Replace('<script src="views.js"></script>',('<script>'+$views+'</script>'))
$html=$html.Replace('<link rel="stylesheet" href="reviews.css">',('<style>'+$reviewCss+'</style>')).Replace('<script src="reviews.js"></script>',('<script>'+$reviewJs+'</script>'))
$html=$html.Replace('<link rel="stylesheet" href="revisions.css">',('<style>'+$revisionCss+'</style>')).Replace('<script src="revisions.js"></script>',('<script>'+$revisionJs+'</script>'))
$html=$html.Replace('<link rel="stylesheet" href="tables.css">',('<style>'+$tableCss+'</style>')).Replace('<script src="tables.js"></script>',('<script>'+$tableJs+'</script>'))
$html=$html.Replace('<link rel="stylesheet" href="dashboard.css">',('<style>'+$dashboardCss+'</style>')).Replace('<script src="dashboard.js"></script>',('<script>'+$dashboardJs+'</script>'))
Set-Content outputs/performance-mvp.html $html -Encoding utf8
Copy-Item performance/dist/* outputs/ -Force
Compress-Archive -Path performance/dist/* -DestinationPath outputs/performance-mvp.zip -Force
