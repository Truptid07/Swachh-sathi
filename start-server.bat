@echo off
echo Starting a local web server for your Swachh Sathi project...
echo.
echo To view your website, open this URL in your browser:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
cd %~dp0
python -m http.server
pause