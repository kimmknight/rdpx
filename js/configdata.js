var configjson = `{ "RemoteApps": { "Adobe Illustrator 2021": { "name": "Adobe Illustrator 2021", "path": "C:\\\\Program Files\\\\Adobe\\\\Adobe Illustrator 2021\\\\Support Files\\\\Contents\\\\Windows\\\\Illustrator.exe", "vpath": "C:\\\\Program Files\\\\Adobe\\\\Adobe Illustrator 2021\\\\Support Files\\\\Contents\\\\Windows\\\\Illustrator.exe", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Program Files\\\\Adobe\\\\Adobe Illustrator 2021\\\\Support Files\\\\Contents\\\\Windows\\\\Illustrator.exe", "iconindex": 0, "showintswa": 0 }, "Adobe Photoshop 2020": { "name": "Adobe Photoshop 2020", "path": "C:\\\\Program Files\\\\Adobe\\\\Adobe Photoshop 2020\\\\Photoshop.exe", "vpath": "C:\\\\Program Files\\\\Adobe\\\\Adobe Photoshop 2020\\\\Photoshop.exe", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Program Files\\\\Adobe\\\\Adobe Photoshop 2020\\\\Photoshop.exe", "iconindex": 0, "showintswa": 0 }, "Google Chrome": { "name": "Google Chrome", "path": "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe", "vpath": "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe", "iconindex": 0, "showintswa": 0 }, "Microsoft Excel": { "name": "Microsoft Excel", "path": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\EXCEL.EXE", "vpath": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\EXCEL.EXE", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\EXCEL.EXE", "iconindex": 0, "showintswa": 0 }, "Microsoft Outlook": { "name": "Microsoft Outlook", "path": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\OUTLOOK.EXE", "vpath": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\OUTLOOK.EXE", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\OUTLOOK.EXE", "iconindex": 0, "showintswa": 0 }, "Microsoft Visual Studio 2019": { "name": "Microsoft Visual Studio 2019", "path": "C:\\\\Program Files (x86)\\\\Microsoft Visual Studio\\\\2019\\\\Community\\\\Common7\\\\IDE\\\\devenv.exe", "vpath": "C:\\\\Program Files (x86)\\\\Microsoft Visual Studio\\\\2019\\\\Community\\\\Common7\\\\IDE\\\\devenv.exe", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Program Files (x86)\\\\Microsoft Visual Studio\\\\2019\\\\Community\\\\Common7\\\\IDE\\\\devenv.exe", "iconindex": 0, "showintswa": 0 }, "Microsoft Word": { "name": "Microsoft Word", "path": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\WINWORD.EXE", "vpath": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\WINWORD.EXE", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Program Files (x86)\\\\Microsoft Office\\\\root\\\\Office16\\\\WINWORD.EXE", "iconindex": 0, "showintswa": 0 }, "VMware Workstation": { "name": "VMware Workstation", "path": "C:\\\\Program Files (x86)\\\\VMware\\\\VMware Workstation\\\\vmware.exe", "vpath": "C:\\\\Program Files (x86)\\\\VMware\\\\VMware Workstation\\\\vmware.exe", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Program Files (x86)\\\\VMware\\\\VMware Workstation\\\\vmware.exe", "iconindex": 0, "showintswa": 0 }, "Windows Explorer": { "name": "Windows Explorer", "path": "C:\\\\Windows\\\\explorer.exe", "vpath": "C:\\\\Windows\\\\explorer.exe", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\Windows\\\\explorer.exe", "iconindex": 0, "showintswa": 0 }, "Windows PowerShell ISE": { "name": "Windows PowerShell ISE", "path": "C:\\\\WINDOWS\\\\system32\\\\WindowsPowerShell\\\\v1.0\\\\PowerShell_ISE.exe", "vpath": "C:\\\\WINDOWS\\\\system32\\\\WindowsPowerShell\\\\v1.0\\\\PowerShell_ISE.exe", "requiredcommandline": "", "commandlinesetting": 1, "iconpath": "C:\\\\WINDOWS\\\\system32\\\\WindowsPowerShell\\\\v1.0\\\\PowerShell_ISE.exe", "iconindex": 0, "showintswa": 0 } }, "Connection": { "address": "example.com", "altaddress": "alt.example.com", "gateway": { "usegateway": true, "gatewayaddress": true, "gatewayauto": true } } }`;

var configdata = JSON.parse(configjson);