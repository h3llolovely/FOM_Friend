# FOM Friend v2

- Dec 2023 - Modified by: Jason Schwarz - jay@hellolovely.tv

A time-saving, low-profile UI panel for frequently used elements and effects in After Effects.
Based on Get-Sh*t-Done Palette by Markus Feder

![FOMfriend](https://github.com/h3llolovely/FOM_Friend/assets/101287022/ce521e91-e403-4e5e-9cf7-955585fde95c)

Moded to include:
-----------------
- Get-Sh*t-Done Palette by Markus Feder
- Q Spans by Jason Schwarz
- rd_MergeProjects v3.2 by Jeffrey R. Almasol

Get-Sh*t-Done:
----------------------------

Basic: (Basic layers and elements)
----------------------------
![AfterFX_6aVPbiZFla](https://github.com/h3llolovely/FOM_Friend/assets/101287022/6f185788-6cda-4052-aabb-893a3590ad9f)
- Null layer
- Solid Layer
- Text layer
- Adjustment layer

- Espi Rig
- Camera Rig
- Two-Node Camera\
- On-Node Camera
- Light

- Project Setup (Create Project folder heirarchy)
![AfterFX_y7Jp2PYXyd](https://github.com/h3llolovely/FOM_Friend/assets/101287022/94145abf-0a2f-4c3f-b27d-e649e320c83f)

Adjust/FX: (Commonly used adjustment and Effects layers)
----------------------------
![AfterFX_1a2V8974QD](https://github.com/h3llolovely/FOM_Friend/assets/101287022/fcb61949-259f-4632-bf16-2a66ba15e1d8)
- Color Correction
- HighPass Filter
- Tritone
- Magic Bullet Looks

- RSMB Pro
- RSMB Pro Vectors
- FL Depth of Field

- Optical Flares
- Plexus
- Fast Blur
- Expression Slider

Trapcode: (Commonly used RedGiant Effect layers)
----------------------------
![AfterFX_vL6XrRqACI](https://github.com/h3llolovely/FOM_Friend/assets/101287022/e62719dd-a373-40d7-9729-244fd8ad8743)
- Particular
- Form
- Shine
- Starglow

- 3D Stroke
- Echospace
- Horizon
- Lux

- Sound Keys

Generate: (Commonly used generators and viewport assistance)
----------------------------
![AfterFX_6sgiSroGdr](https://github.com/h3llolovely/FOM_Friend/assets/101287022/bcc5d800-53da-4fde-b3dd-99b70fd1bd3c)
- Fill
- Gradient Ramp
- 4-Color Gradient
- Fractal Noise
- Checkerboard
- Grid

- Solid (black)
- Solid (white)

- Comp-BG Black (Change Comp viewport background color)
- Comp-BG White
- Comp-BG Red

----------------------------
![AfterFX_l9cYB14KSv](https://github.com/h3llolovely/FOM_Friend/assets/101287022/870d53c5-e135-4e32-9627-3856308315fe)

Q Spans:
----------------------------
- Q Comp Spans (Queues compositions' Marker Spans)
- Q Layer Spans (Queues selected layers' Marker Spans)

rd_MergeProjects:
----------------------------
- consult Help button


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
Dec 2023 Original script by Matt Volp @TackStudio www.tackstudio.co
Dec 2023 Jason Schwarz www.hellolovely.tv

Sends either Composition marker spans or selected layer marker spans to the Render Queue and appends the marker comment to the filename.
Useful for queueing multiple parts of a single comp, without having to rename each output.

1.0 - Initial release - Dec 2023

----------

SimpleCameraRig.jsx
©November 2009  James Chiny https:hypoly.com
twitter.com/hypoly
For more scripts and updates check out https:hypoly.com
