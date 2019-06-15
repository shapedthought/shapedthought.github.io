# shapedthought.github.io
Various Tools which I've developing to help with day-to-day technical work and help me learn to code.

Current tools:
* vSAN performance calculator, this translates current IO into vSAN IO based on 8KB blocks
* Front-end performance calculator, there are a million front-to-back calculotors for RAID but this does it the other way
* Disk Group calculator, this figures out how many RAID groups you need to meet a certain percentage of a pool. I've done this in both vue js and regular js
* vSAN Capaacity calculator, this is designed to help tweak vSAN ready node designs or figure out a design based on vSAN approved parts.
It is not designed to select the node so some knowledge of vSAN is needed.
* Physical Veeam proxy and backup server sizer, takes the formulas from Veeam's site and creates a sizing output. I mainly put this together to calculate disk performance.
* VNX Upgrade sizer, input the current shelves and disks then allows you to add additional disks, it will then tell you how many additional shelves are needed and if you go over configuration maximums. It does not warn you about hot-spare ratio best practice violations. This sizer has a save and load function which doesn't require a back-end.
* vSAN Capacity- Angular- this an updated version of the one above in Angular with a Firebase back-end so you are able to save configurations.
* VMware host calculator- New mini app written in Angular as an exercise in moving data in and out of forms that can be edited. This calculates the required host quantity based on VM requirements.
* VMware host calculator pure JS- same as above but has more detail in the deliverables. Quick weekend project.

Note that none of these tools have any assosication with the vendors responsible for the products and I take no responsibility for any issues resulting in their use.
