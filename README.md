# Fast Icons (0.1.0)
Fast Icons is a plugin for Adobe XD that aims to help you with finding the right icons for your artboards by letting you search through an evergrowing library of icons taken from hand-picked free icon packs.

## Supported packs
Pack | Version | Regular | Solid | Brands
-|:-:|:-:|:-:|:-:
[Boxicons](https://boxicons.com/) | 1.7.1 | 472 | 294 | 35
[Feather](https://feathericons.com/) | 4.8.0 | 256 | 0 | 11
[Font Awesome](https://fontawesome.com/) | 5.5.0 | 152 | 869 | 391

## Install

**Fast Icons** is still in its infancy and has therefore not yet been submitted for review to Adobe XD. You can however install it on your local machine by following those simple steps.

**1. Clone this repository**
```
git clone https://github.com/RagePeanut/fast-icons.git
```
**2. Edit manifest.json**

The `manifest.json` file specifies a few settings for this plugin. You can change its ID by any other ID as long as it is the same length as the default one and contains only letters and numbers. The setting you may want to change is the user interface entry point for this plugin's command. By default, it will show *Insert Icons* in the plugins commands menu, you can change it to whatever you like by changing the value associated to the `label` property. Another setting that you can change is the shortcut for the *Insert Icons* command. By default it's set to `CTRL+SHIFT+W` on **Windows** and to `CMD+SHIFT+W` on **Mac**.

**3. Create the plugin installer**

Select all the files inside the `fast-icons` folder (not the folder itself) then right-click on them. Click on `Send to` and then `Compressed (zipped) folder`. Once the ZIP file has been created, rename it to `fast-icons.xdx`.

**4. Install the plugin**
Double-click on `fast-icons.xdx`, this should execute **Adobe XD** if it isn't already running. The installation doesn't usually happen immediately, wait a few minutes and you should see a pop-up asking you if you want to install the **Fast Icons** plugin. Click *Install* and voilà ! **Fast Icons** should now be visible in the plugins menu.

## How to use
To open the **Fast Icons** window, you have two options. You can either use the shortcut assigned to your system (`CTRL+SHIFT+W` for **Windows** and `CMD+SHIFT+W` for **Mac**) or click on the burger menu item then on *Plugins* and then on *Insert Icons*. Once the windo is opened you will be presented with a few fields, let's explore them one after another.
### The search bar
As expected, the search just below the *Fast Icons* title is used to type words related to the icons you want to find. For example, if you want to find icons related to birds, you can type *bird* and a list of icons will appear. The search bar is case insensitive and ignores hyphens and spaces.
### Pack
The *Pack* field is a drop-down list that lets you pick the pack you want the icons to come from. We can now for example refine our search for birds by selecting **Font Awesome** as the desired pack. The *All* option shows icons from all packs, it is not yet possible to show icons from some of the packs.
### Style
The *Style* field is a drop-down list that lets you pick the style you want the icons to have. Three options are available: *regular*, *solid* and *brands*. There is no plan to add another option to that list as most packs categorize their icons that way. Continuing on our example with bird icons, we can select *solid* and see that *brands* and *regular* icons are immediately removed from the icons lists.
### Height
The *Height* field lets you specify the height you want your icon to have when it gets added to your artboard. It accepts decimal numbers as long as the decimal point is represented by a point. By default, the height is set to 40px which is the same as the size of the icons being shown on the **Fast Icons** window.
### Max Width
The *Max Width* field lets you specify the maximum width you want your icon to have when it gets added to your artboard. If an icon has a width bigger than the maximum width after scaling based on the desired height, it will be scaled back to a size that matches the maximum width. By default, the maximum width is equal to the height.
### Selecting icons
Selecting an icon is as simple as clicking on it. Once clicked, the icon will appear at the bottom of the window in a list of selected icons.
### Unselecting icons
Unselecting an icon is as simple as clicking on it in the list of selected icons that can be found in the bottom left corner of the **Fast Icons** window.
### Add
The *Add* button will add the selected icons to your artboard. They should be presented in a row nicely spaced but it is not guaranteed as some bugs can happen making some of them appear one of top of another. Clicking on the *Add* button will set all the fields back to their default values except for *Height* and *Max Width* which will stay at the same values as before.
### Cancel
The *Cancel* button will close the **Fast Icons** window without affecting your artboard whatsoever. Fields are not set back to their default values on cancel and will have the same value the next time you open that window (assuming you don't close **Adobe XD** in between or refresh the plugins). A *Clear* button is to be expected soon.

## Social networks
**Steemit:** https://steemit.com/@ragepeanut <br>
**Busy:** https://busy.org/@ragepeanut <br>
**Twitter:** [https://twitter.com/RagePeanut_](https://twitter.com/RagePeanut_) <br>
**Steam:** http://steamcommunity.com/id/ragepeanut/

### Follow me on [Steemit](https://steemit.com/@ragepeanut) or [Busy](https://busy.org/@ragepeanut) to be informed on my new releases and projects.
