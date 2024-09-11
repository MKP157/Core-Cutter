#!/bin/python

import subprocess
import sys
from elevate import elevate

def get_core_count():
    GET_TOTAL_CORES = "lscpu --all --parse=CPU | grep -v '^#' -c"

    process = subprocess.Popen(GET_TOTAL_CORES, stdout=subprocess.PIPE, shell=True)
    temp = process.communicate()[0]

    core_count = int(temp.decode())
    return core_count
    
    
def set_online_cores(num):
    core_count = get_core_count()
    
    if (num < 1):
        print(f"Invalid core count given. Must be between 1 and {core_count}.")
        return 0;
    
    elif (num > core_count):
        print(f"*** Only {core_count} logical cores are present on this system. Enabling all...\n")
    
    print("Note: Core 0 always remains enabled.")
    print("Enabling all CPU cores first...")
    for i in range(1, core_count):
        GET_TOTAL_CORES = f"echo \"1\" > /sys/devices/system/cpu/cpu{i}/online"
        process = subprocess.Popen(GET_TOTAL_CORES, stdout=subprocess.PIPE, shell=True)
        temp = process.communicate()[0]
        print(f"Logical core {i}" + temp.decode(), end=", ")
    
    print("\n\nNow disabling requested cores...")
    for i in range(num, core_count):
        GET_TOTAL_CORES = f"echo \"0\" > /sys/devices/system/cpu/cpu{i}/online"
        process = subprocess.Popen(GET_TOTAL_CORES, stdout=subprocess.PIPE, shell=True)
        temp = process.communicate()[0]
        print(f"Logical core {i}" + temp.decode(), end=", ")
    
    print("\n\nSuccess!")
    return 0
    
if __name__ == '__main__':
    elevate()
    set_online_cores(int(sys.argv[1]))
