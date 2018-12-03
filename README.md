# Iconomy (0.1.5)
**Iconomy** is a plugin for **Adobe XD** that aims to help you with finding the right icons for your artboards by letting you search through an ever growing library of icons coming from hand-picked free icon packs.

## Supported packs
Pack | Version | Regular | Solid | Brands
-|:-:|:-:|:-:|:-:
[Boxicons](https://boxicons.com/) | 1.8.0 | 480 | 289 | 35
[Essential Icons](https://dribbble.com/shots/4666022) | | 245 | 0 | 2
[Feather](https://feathericons.com/) | 4.8.0 | 256 | 0 | 11
[Font Awesome](https://fontawesome.com/icons?d=gallery&m=free) | 5.5.0 | 152 | 869 | 391
[Linearicons](https://linearicons.com/free) | 1.0.0 | 170 | 0 | 0

## Install

**Iconomy** is still in its infancy and has therefore not yet been submitted for review to **Adobe XD**. You can however install it on your local machine by following those simple steps.

### 1. Clone this repository
```
git clone https://github.com/RagePeanut/Iconomy.git
```
### 2. Edit manifest.json

The `manifest.json` file specifies a few settings for this plugin. You can change its ID by any other ID as long as it is the same length as the default one and only contains lowercase letters and numbers. The setting you may want to change is the user interface entry point for this plugin's command. By default, it will show *Insert Icons* in the plugins commands menu, you can change it to whatever you like by changing the value associated to the `label` property. Another setting that you can change is the shortcut for the *Insert Icons* command which is set by default to `CTRL+SHIFT+W` on **Windows** and to `CMD+SHIFT+W` on **Mac**.

### 3. Create the plugin installer

Select all the files inside the `iconomy` folder (don't select the folder itself) then right click on them. Click on `Send to` and then `Compressed (zipped) folder`. Once the files have been compressed to a ZIP file, rename that file to `iconomy.xdx`.

### 4. Install the plugin
Double-click on `iconomy.xdx`, this should execute **Adobe XD** if it isn't already running. The installation doesn't usually happen immediately, wait a few minutes and you should see a pop-up asking you if you want to install the **Iconomy** plugin. Click *Install* and voilà ! **Iconomy** should now be visible in the plugins menu.

## How to use
To open the **Iconomy** window, you have two options. You can either use the shortcut assigned to your system (`CTRL+SHIFT+W` for **Windows** and `CMD+SHIFT+W` for **Mac**) or click on the burger menu item then on *Plugins* and then on *Insert Icons*. Once the window is opened you will be presented with a few fields, let's explore them one after another.
<p align="center">
  <img src="https://cdn.steemitimages.com/DQme6JhMMxfPtDeLRPMQEjgBsJQAqqCWTR2FsG9BMCJmSMR/ui.png">
</p>

### 1. The search bar
As expected, the search bar just below the *Iconomy* title is used to type words related to the icons you want to find. For example, if you want to find icons related to birds, you can type *bird* and a list of icons will appear. The search bar is case insensitive and ignores hyphens and spaces.
### 2. The pack drop-down
The *Pack* drop-down lets you pick the pack you want the icons to come from. We can now for example refine our search for birds by selecting ***Font Awesome*** as the desired pack. The default *All* option shows icons from all packs, it is not yet possible to show icons from some of the packs.
### 3. The style drop-down
The *Style* drop-down lets you pick the style you want the icons to have. Three options are available: *regular*, *solid* and *brands*. There is no plan to add another option to that list as most packs categorize their icons that way. Continuing on with our birds example, we can select *solid* and see that *brands* and *regular* icons are immediately removed from the icons lists.
### 4. The height field
The *Height* field lets you specify the height you want your icon to have when it gets added to your artboard. It accepts decimal numbers as long as the decimal separator is represented by a point. By default, the height is set to 40px which is the same as the size of the icons being shown on the **Iconomy** window.
### 5. The max width field
The *Max Width* field lets you specify the maximum width you want your icon to have when it gets added to your artboard. If an icon has a width bigger than the maximum width after scaling based on the desired height, it will be scaled back to a size that matches the maximum width. By default, the maximum width is equal to the height.
### 6. The selectable icons
Selecting an icon is as simple as clicking on it in the list of selectable icons that get updated on every input. Once clicked, the icon will appear in the list of selected icons in the bottom left corner of the window.
### 7. The selected icons
The selected icons can be unselected at any time. Unselecting an icon is as simple as clicking on it in the list of selected icons that can be found in the bottom left corner of the **Iconomy** window.
### 8. The clear button
The *Clear* button removes all the user inputs from the **Iconomy** window and clears the selectable and selected icons lists. 
### 9. The cancel button
The *Cancel* button closes the **Iconomy** window. Fields are not set back to their default values on cancel and will have the same value the next time you open that window (assuming you don't close **Adobe XD** in between or refresh the plugins).
### 10. The add button
The *Add* button adds the selected icons to the current artboard. They should be presented in a row nicely spaced but it is not guaranteed as a bug can happen from time to time making some of them appear one on top of another. Clicking on the *Add* button sets all the fields back to their default values except for *Height* and *Max Width* which will stay at the same values as before.

## Known issues
* **The search bar can't always be set back to an empty string.** A workaround until this gets fixed is to type a space in the search bar field instead of an empty string since spaces are ignored when filtering icons.
* **The drop-down lists have a width bigger than the desired width.** This results in their right borders not being shown.
* **Icons added to the artboard sometimes fail to get properly spaced.**
* **Selectable icons load slowly on tiny searches.**

## Social networks
**Steemit:** https://steemit.com/@ragepeanut <br>
**Busy:** https://busy.org/@ragepeanut <br>
**Twitter:** [https://twitter.com/RagePeanut_](https://twitter.com/RagePeanut_) <br>
**Steam:** http://steamcommunity.com/id/ragepeanut/

### Follow me on [Steemit](https://steemit.com/@ragepeanut) or [Busy](https://busy.org/@ragepeanut) to be informed on my new releases and projects.
