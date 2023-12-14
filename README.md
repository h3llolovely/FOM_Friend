# FOM Friend v2

- Dec 2023 - Modified by: Jason Schwarz - jay@hellolovely.tv

A time-saving, low-profile UI panel for frequently used elements and effects.
Based on Get-Sh*t-Done Palette by Markus Feder

![AfterFX_l9cYB14KSv](https://github.com/h3llolovely/FOM_Friend/assets/101287022/e8847008-390f-4937-bf39-0b1911c6ed67)

Moded to include:
-----------------
- Q Spans by Jason Schwarz
- rd_MergeProjects v3.2 by Jeffrey R. Almasol
- Simple Camera Rig by James Chiny

Added one-click options for:
----------------------------
Plexus, Optical Flares, RSMB Pro Vectors

------------------------------------------
-- Individual script notes listed below --
------------------------------------------

Get-Sh*t-Done Palette
Version: 0.95
Date:04.08.2010		
by Markus Feder
mail(at)markusfeder.com

This script helps me cut some corners with creating layers and 
applying effects in Adobe Aftereffects CS4.
For comments and suggestions definitly drop me a line.
	
Inspired by Lazy Layer Creator by Justin G and Quick_Fx_Palette 
by Fred Cretet. Thanks to Paul Tuersley for the try/catch part.

----------

 rd_MergeProjects.jsx
 Copyright (c) 2006-2013 Jeffrey R. Almasol. All rights reserved.
 portfolio: www.redefinery.com
 
 Name: rd_MergeProjects
 Version: 3.2
 
 Description:
 This script displays a palette with controls for merging a selected project folder's
 contents up to the root of the Project panel. Use this script when you have imported
 a project into another, and want to merge subfolders and their contents with existing
 same-named subfolders at the root-level of the project, keeping your Project panel 
 more organized.
 
 Prerequisites:
  -- This script requires After Effects CS4 or later.
 
 Usage:
  1. (Optional) Select a top-level folder (representing an imported project) in the 
     Project panel.
  2. Select if you want to consolidate all footage/folder items (equivalent to the
     File > Consolidate All Footage menu command) and remove unused footage/folder
     items (File > Remove Unused Footage) before folder are merged.
  3. Click the Merge Project button.
 
 If you did not select a folder in step 1, you are asked to select the project file to
 import (equivalent to File > Import > File). In either case, the project folder's
 contents are merged.
 
 Notes:
  -- Subfolder hierarchies are retained when "merged up", even if the contents include
     a folder with the same name as that of a root-level folder. However, if the
     source folder contains multiple subfolders of the same name, they will be
     combined in the target folder.
  -- Identical or identically named compositions are not merged or renumbered.
 
 Legal Notices:
 This script is provided "as is," without warranty of any kind, expressed or implied.
 In no event shall the script's author be held liable for any damages arising in any
 way from the use of this script.
 
 This script is excerpted from Adobe After Effects CC Visual Effects and Compositing Studio Techniques by Mark Christiansen.
 (c) 2013. Published by Adobe Press. All rights reserved. A complete chapter on scripting
 by Jeff Almasol is included with the book. Additional scripts are available at
 http:aescripts.com/rd-studio-techniques/

----------

 Q Spans
 ©2023 Jason Schwarz https:www.hellolovely.tv

  Sends either Composition marker spans or selected layer marker spans to the Render Queue and appends the marker comment to the filename.
  Useful for queueing multiple parts of a single comp, without having to rename each output.

 1.0 - Initial release - Dec 2023

----------

 SimpleCameraRig.jsx
 ©November 2009  James Chiny http:hypoly.com
 twitter.com/hypoly
 For more scripts and updates check out http:hypoly.com
