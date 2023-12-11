Run Fciv.net on Windows Subsystem for Linux (WSL) 
=================================================

1. Install WSL on Windows 11:
https://learn.microsoft.com/en-us/windows/wsl/install  
Open a Powershell window, run as Administator, this command:
>  wsl --install

2. Git clone Fciv.net:
> git clone https://github.com/fciv-net/fciv-net.git --depth=10

3. Build Fciv.net:
> cd fciv-net  
> ./scripts/install/install.sh --mode=TEST  

4: Start Fciv.net:
> ./scripts/start-freeciv-web.sh

Open Fciv.net at http://localhost/
