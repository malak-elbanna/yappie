Invoke-RestMethod -Uri "http://localhost:8001/services/" -Method Post -Body @{name="user-service";url="http://user-service:5000"} -ContentType "application/json"
