# Core Cutter 🔪
A GNOME Shell Extension which allows you to select active CPU cores. Made with the intention of improving battery life with my gaming laptop, which I use for school.

![](https://github.com/MKP157/Core-Cutter/blob/main/demo.gif)

Please note that this is **not a professional piece of software.** I made this on a whim purely to experiment. **It makes extensive use of root priveleges to change system files, as that is how cores are set as either online/offline in Linux.** Therefore:

## I AM NOT RESPONSIBLE FOR ANY DAMAGES MADE TO YOUR SYSTEM. BY USING THIS SOFTWARE, YOU ACCEPT THE RISKS THAT COME WITH MY WACKY PROGRAMMING PRINCIPLES.

# Installation
First and foremost, **please** try this in a virtual machine first. If something goes wrong and the GNOME Shell halts loading the extension, it can completely freeze your computer (or at least the screen). Normally, you could press `Alt`+`F2`, type `r` and hit enter to restart the GNOME Shell. But that method will reload this GNOME extension, and you'll get the same issue again. So trying this in a VM will make sure you figure out how to install this correctly in a test environment before screwing up your own system.

### Now, to install

Make sure Python is installed. You will need to install the `elevate` package, so that the underlying Python code can use root priveleges.

Drag the folder labelled ```corecutter@mpeters9.unb.ca``` into your GNOME Shell Extensions directory. 

For me, that was in:
```~/.local/share/gnome-shell/extensions/```

Finally, restart your computer, and voila! It should work.

# Compatibility
So far, I've only tested this on my own machine. However, if you're crazy enough to try this on your own hardware, let me know how it goes! You can email me at mpeters9@unb.ca with your results, and I'll post your results here.

| Platform | Operating System  | GNOME Version | Notes |
| ------------- | ------------- | ------------- | ------------- |
| Ryzen 5 5600H | Ubuntu 24.04 LTS  | 46 | ✅ Works as intended |
