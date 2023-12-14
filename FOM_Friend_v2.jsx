{
    function myScript(thisObj) {

        // Globals

        // Store all constants in a global object, for consolidated organization in ExtendScript Toolkit's Data Browser
        var rd_MergeProjectsData = new Object();
        rd_MergeProjectsData.scriptName = "rd: Merge Projects";
        rd_MergeProjectsData.scriptTitle = rd_MergeProjectsData.scriptName + " v3.2";

        // Various text strings are defined as associative arrays (dictionaries) to support localizability via rd_localize() function
        rd_MergeProjectsData.strConsolidateFootage = {
            en: "Consolidate All"
        };
        rd_MergeProjectsData.strRemoveUnusedFootage = {
            en: "Remove Unused"
        };
        rd_MergeProjectsData.strMergeOK = {
            en: "Selected project folder \"%s\" merged successfully."
        };
        rd_MergeProjectsData.strMergeFail = {
            en: "Selected project folder \"%s\" could not be merged completely."
        };
        rd_MergeProjectsData.strConsolidatedResult = {
            en: "%d footage or folder items were consolidated."
        };
        rd_MergeProjectsData.strRemovedResult = {
            en: "%d footage or folder items were removed."
        };
        rd_MergeProjectsData.strMerge = {
            en: "Merge Project"
        };
        rd_MergeProjectsData.strHelp = {
            en: "?"
        }
        rd_MergeProjectsData.strErrNoTopFolderSel = {
            en: "Cannot perform operation. Please select a single top-level folder in the Project panel, and try again."
        };
        rd_MergeProjectsData.strMinAE90 = {
            en: "This script requires Adobe After Effects CS4 or later."
        };
        rd_MergeProjectsData.strHelpText = {
            en: "Copyright (c) 2006-2013 Jeffrey R. Almasol. All rights reserved.\n" +
                "portfolio: www.redefinery.com\n\n" +

                "Description:\n" +
                "This script displays a palette with controls for merging a selected project folder's contents up to the root of the Project panel. Use this script when you have imported a project into another, and want to merge subfolders and their contents with existing same-named subfolders at the root-level of the project, keeping your Project panel more organized.\n\n" +

                "Prerequisites:\n" +
                " -- This script requires After Effects CS4 or later.\n\n" +

                "Usage:\n" +
                " 1. (Optional) Select a top-level folder (representing an imported project) in the Project panel.\n" +
                " 2. Select if you want to consolidate all footage/folder items (equivalent to the File > Consolidate All Footage menu command) and remove unused footage/folder items (File > Remove Unused Footage) before folder are merged.\n" +
                " 3. Click the Merge Project button.\n\n" +

                "If you did not select a folder in step 1, you are asked to select the project file to import (equivalent to File > Import > File). In either case, the project folder's contents are merged.\n\n" +

                "Notes:\n" +
                " -- Subfolder hierarchies are retained when \"merged up\", even if the contents include a folder with the same name as that of a root-level folder. However, if the source folder contains multiple subfolders of the same name, they will be combined in the target folder.\n" +
                " -- Identical or identically named compositions are not merged or renumbered.\n\n" +

                "Legal Notices:\n" +
                "This script is provided \"as is,\" without warranty of any kind, expressed or implied. In no event shall the script's author be held liable for any damages arising in any way from the use of this script.\n\n" +

                "This script is excerpted from Adobe After Effects CS6 Visual Effects and Compositing Studio Techniques by Mark Christiansen. (c) 2013. Published by Adobe Press. All rights reserved. Additional scripts and a complete chapter on scripting by Jeff Almasol are included in the book, available at http://www.peachpit.com/store/adobe-after-effects-cs6-visual-effects-and-compositing-9780321834591"
        };




        // rd_localize()
        // 
        // Description:
        // This function localizes the given string variable based on the current locale.
        // 
        // Parameters:
        //   strVar - The string variable's name.
        // 
        // Returns:
        // String.
        //
        function rd_localize(strVar) {
            return strVar["en"];
        }




        // rd_MergeProjects_buildUI()
        // 
        // Description:
        // This function builds the user interface. Coordinates of various controls are relative
        // to others so that they can adapt if spacing is adjusted.
        // 
        // Parameters:
        // thisObj - Panel object (if using a dockable panel) or Window object (if using a traditional palette). 
        // 
        // Returns:
        // Panel or Window object representing the built user interface.
        //

        function myScript_buildUI(thisObj) {
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "FOM Friend", undefined, { resizeable: true });

            if (myPanel !== null) {

                // Define UI Elements ---
                res = """group{orientation:'row', alignment:['left', 'top'], spacing:'5',\
					butDrpdwnlst00: DropDownList{size:[70,30], properties:{items:['Basic', 'Null', 'Solid', 'Text', 'Adjustmemt Layer', '-', 'Espi Rig', 'Camera Rig','Two-Node Camera', 'One-Node Camera', 'Light', '-', 'Project Setup']}},\
					butDrpdwnlst01: DropDownList{size:[95,30], properties:{items:['Adjust / FX', 'Color Correction', 'HighPass Filter', 'Tritone', 'Magic Bullet Looks', '-', 'RSMB Pro', 'RSMB Pro Vectors', 'FL Depth of Field', '-', 'Optical Flares', 'Plexus', 'Fast Blur', 'Expression Slider']}},\
					butDrpdwnlst02: DropDownList{size:[85,30], properties:{items:['Trapcode', 'Particular', 'Form', 'Shine', 'Starglow', '-', '3D Stroke', 'Echospace', 'Horizon', 'Lux', '-', 'Sound Keys']}},\
					butDrpdwnlst03: DropDownList{size:[90,30], properties:{items:['Generate', 'Fill', 'Gradient Ramp', '4-Color Gradient', 'Fractal Noise', 'Checkerboard', 'Grid', '-', 'Solid (black)', 'Solid (white)', '-', 'Comp-BG Black', 'Comp-BG White', 'Comp-BG Red']}},\
					butAbout: Button{size:[15,30], text:'?' },\
				SEP:  Panel{text:'', orientation:'row', width:'0', alignment:['center', 'fill']},\
					btnQueueComp: Button{size:[120,30], text:'Q Comp Spans' },\
                    btnQueueLayer: Button{size:[120,30], text:'Q Layer Spans' },\
				SEP:  Panel{text:'', orientation:'row', width:'0', alignment:['center', 'fill']},\
					MP: Group {alignment:['left','top'], orientation:'row', spacing:'5',\
						header: Group {alignment:['left','top'], orientation:'column', spacing:'5',\
							consolidateFootage: Checkbox {alignment:'left', margin:[0,2,0,0], text:'""" + rd_localize(rd_MergeProjectsData.strConsolidateFootage) + """', value:false },\
							removeFootage: Checkbox {alignment:'left', margin:[-4,2,0,0], text:'""" + rd_localize(rd_MergeProjectsData.strRemoveUnusedFootage) + """', value:false },\
						},\
						footer: Group {orientation:'row', spacing:'5',\
							mergeBtn: Button {size:[100,30], text:'""" + rd_localize(rd_MergeProjectsData.strMerge) + """' },\
							helpBtn: Button {size:[15,30], text:'""" + rd_localize(rd_MergeProjectsData.strHelp) + """' },\
						},\
					},\
				}""";

                // Add UI Items to myPanel ---
                myPanel.grp = myPanel.add(res);

                // Set UI Defaults ---		
                myPanel.grp.butDrpdwnlst00.selection = 0;
                myPanel.grp.butDrpdwnlst00.onChange = Mylist00;
                myPanel.grp.butDrpdwnlst00.helpTip = "Select From List";

                myPanel.grp.butDrpdwnlst01.selection = 0;
                myPanel.grp.butDrpdwnlst01.onChange = Mylist01;
                myPanel.grp.butDrpdwnlst01.helpTip = "Select From List";

                myPanel.grp.butDrpdwnlst02.selection = 0;
                myPanel.grp.butDrpdwnlst02.onChange = Mylist02;
                myPanel.grp.butDrpdwnlst02.helpTip = "Select From List";

                myPanel.grp.butDrpdwnlst03.selection = 0;
                myPanel.grp.butDrpdwnlst03.onChange = Mylist03;
                myPanel.grp.butDrpdwnlst03.helpTip = "Select From List";

                myPanel.grp.btnQueueComp.onClick = queueCompMarkerSpans;
                myPanel.grp.btnQueueLayer.onClick = queueLayerMarkerSpans;
                myPanel.grp.butAbout.onClick = my_About;

                myPanel.grp.MP.footer.mergeBtn.onClick = rd_MergeProjects_doMergeFolders; // Call the rd_MergeProjects_doMergeFolders function when the Merge Project button is clicked
                myPanel.grp.MP.footer.helpBtn.onClick = function() // Call this function to display the About box and help
                {
                    alert(rd_MergeProjectsData.scriptTitle + "\n" + rd_localize(rd_MergeProjectsData.strHelpText), rd_MergeProjectsData.scriptName);
                }

                // Layout Panel
                myPanel.layout.layout(true);
                myPanel.layout.resize();
                myPanel.onResizing = myPanel.onResize = function() {
                    this.layout.resize();
                }

            }

            return myPanel;

            // Begin Functions ---

            //// Functions: Basic ... // Start // 
            function Mylist00() {
                if (((app.project.activeItem == null) || ((app.project.activeItem != null) && !(app.project.activeItem instanceof CompItem))) && (myPanel.grp.butDrpdwnlst00.selection != 12)) {
                    if (myPanel.grp.butDrpdwnlst00.selection != 0) {

                        alert("No Composition selected! You have to select a Composition in the Composition Panel first.");
                        myPanel.grp.butDrpdwnlst00.selection = 0;
                    }
                } else {
                    var selctd = myPanel.grp.butDrpdwnlst00.selection.index;
                    switch (selctd) {

                        case 1:
                            app.beginUndoGroup("Create Null Object");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_null = comp.layers.addNull(comp.duration);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_null.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 2:
                            app.beginUndoGroup("Create Solid");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_solid = comp.layers.addSolid([0, 0, 0], "Solid", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 3:
                            app.beginUndoGroup("Create Text");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_text = comp.layers.addText(sourceText = "Text");

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_text.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 4:
                            app.beginUndoGroup("Create Adjustment Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and set Adjustment Layer Flag 
                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "Adjustment Layer", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            // Set the DropDownMenu back to initial State 
                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 6:
                            app.beginUndoGroup("Adam's Camera Rig");

                            var myComp = app.project.activeItem;
                            if (myComp != null && (myComp instanceof CompItem)) {

                                var w = myComp.width / 2;
                                var h = myComp.height / 2;
                                var newCamera = myComp.layers.addCamera("Camera", [w, h]); //make a new camera
                                newCamera.position.setValue([w, h, -1500]);
                                var myLayer = myComp.selectedLayers;
                                if (myLayer) {
                                    var PosNull = myComp.layers.addNull();
                                    PosNull.source.name = "Cam_Pos";
                                    PosNull.threeDLayer = true;
                                    PosNull.position.setValue([w, h]);
                                    PosNull.enabled = true;

                                    var RotNull = myComp.layers.addNull();
                                    RotNull.source.name = "Cam_Rot";
                                    RotNull.threeDLayer = true;
                                    RotNull.position.setValue([w, h]);
                                    RotNull.enabled = true;

                                    newCamera.parent = PosNull;
                                    PosNull.parent = RotNull;

                                    var Lock3D = '[0,0,0]'; //lock unwanted properties
                                    var Lock1D = '[0]';
                                    var LockScale = '[100,100,100]';

                                    RotNull.anchorPoint.expression = Lock3D;
                                    RotNull.position.expression = Lock3D;
                                    RotNull.scale.expression = LockScale;

                                    PosNull.anchorPoint.expression = Lock3D;
                                    PosNull.scale.expression = LockScale;
                                    PosNull.orientation.expression = Lock3D;
                                    PosNull.xRotation.expression = Lock1D;
                                    PosNull.yRotation.expression = Lock1D;
                                    PosNull.zRotation.expression = Lock1D;

                                    app.endUndoGroup();

                                } else {
                                    alert("Please select at least one layer");
                                }
                            } else {
                                alert("Please select an active comp to use this script");
                            }

                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 7:
                            app.beginUndoGroup("Simple Camera Rig");

                            var myComp = app.project.activeItem;
                            if (myComp != null && (myComp instanceof CompItem)) {

                                var w = myComp.width / 2;
                                var h = myComp.height / 2;
                                var newCamera = myComp.layers.addCamera("Rigged Camera", [w, h]); //make a new camera
                                newCamera.position.setValue([w, h]);
                                var myLayer = myComp.selectedLayers;
                                if (myLayer) {
                                    var bankNull = myComp.layers.addNull();
                                    bankNull.source.name = "CamBank";
                                    bankNull.threeDLayer = true;
                                    bankNull.shy = true;
                                    bankNull.enabled = false;

                                    var pitchNull = myComp.layers.addNull();
                                    pitchNull.source.name = "CamPitch";
                                    pitchNull.threeDLayer = true;
                                    pitchNull.shy = true;
                                    pitchNull.enabled = false;

                                    var headingNull = myComp.layers.addNull(myComp.duration);
                                    headingNull.source.name = "CamHeading";
                                    headingNull.threeDLayer = true;
                                    headingNull.shy = true;
                                    headingNull.enabled = false;

                                    var controlNull = myComp.layers.addNull();
                                    controlNull.source.name = "Camera Control";
                                    controlNull.threeDLayer = true;
                                    controlNull.shy = false;
                                    myComp.hideShyLayers = true;
                                    newCamera.parent = bankNull;
                                    bankNull.parent = pitchNull;
                                    pitchNull.parent = headingNull;
                                    headingNull.parent = controlNull;

                                    var pitch = controlNull("Effects").addProperty("Angle Control");
                                    pitch.name = 'Pitch (X)';

                                    var heading = controlNull("Effects").addProperty("Angle Control");
                                    heading.name = 'Heading (Y)';

                                    var bank = controlNull("Effects").addProperty("Angle Control");
                                    bank.name = 'Bank (Z)';

                                    var tracking = controlNull("Effects").addProperty("ADBE Slider Control");
                                    tracking.name = 'Tracking Control';
                                    tracking.slider.setValue(0);

                                    var xPosition = controlNull("Effects").addProperty("ADBE Slider Control");
                                    xPosition.name = '(X) Position';
                                    xPosition.slider.setValue([w]);

                                    var yPosition = controlNull("Effects").addProperty("ADBE Slider Control");
                                    yPosition.name = '(Y) Position';
                                    yPosition.slider.setValue([h]);

                                    var zPosition = controlNull("Effects").addProperty("ADBE Slider Control");
                                    zPosition.name = '(Z) Position';
                                    zPosition.slider.setValue(0);

                                    var camPositionExpression = 'x = effect("(X) Position")("Slider");y = effect("(Y) Position")("Slider");z = effect("(Z) Position")("Slider");[x, y,z];';
                                    controlNull.position.expression = camPositionExpression;

                                    var CamBankZ = 'value - [thisComp.layer("Camera Control").effect("Bank (Z)")("Angle")];';
                                    bankNull.zRotation.expression = CamBankZ;

                                    var CamPitchX = 'value - [thisComp.layer("Camera Control").effect("Pitch (X)")("Angle")];';
                                    pitchNull.xRotation.expression = CamPitchX;

                                    var CamHeadingY = 'value - [thisComp.layer("Camera Control").effect("Heading (Y)")("Angle")];';
                                    pitchNull.yRotation.expression = CamHeadingY;

                                    var positionExpression = 'value - [0,0,cameraOption.zoom] + [0,0,thisComp.layer("Camera Control").effect("Tracking Control")("Slider")];';
                                    newCamera.position.expression = positionExpression;
                                    app.endUndoGroup();

                                } else {
                                    alert("Please select at least one layer");
                                }
                            } else {
                                alert("Please select an active comp to use this script");
                            }

                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 8:
                            app.beginUndoGroup("Create Camera");
                            // Selected Composition
                            var comp = app.project.activeItem;

                            var new_camera = comp.layers.addCamera("Two-Node Camera", [comp.width / 2, comp.height / 2]);

                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 9:
                            app.beginUndoGroup("Create Camera");
                            // Selected Composition
                            var comp = app.project.activeItem;

                            var new_camera = comp.layers.addCamera("One-Node Camera", [comp.width / 2, comp.height / 2]);

                            new_camera.autoOrient = AutoOrientType.NO_AUTO_ORIENT;

                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;

                        case 10:
                            app.beginUndoGroup("Create Light");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_light = comp.layers.addLight("Light 1", [comp.width / 2, comp.height / 2]);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_light.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;



                        case 12:
                            app.beginUndoGroup("Setup Project");

                            // Project Setup: Create Default Folders

                            var_Collects = 0;
                            var_Output = 0;
                            var_MainComps = 0;
                            var_PreComps = 0;
                            var_Assets = 0;
                            var_Ref = 0;
                            var_Solids = 0;

                            var_Sub_AEC = 0;
                            var_Sub_Raster = 0;
                            var_Sub_Vector = 0;
                            var_Sub_Stills = 0;
                            var_Sub_Footage = 0;
                            var_Sub_3dRenders = 0;
                            var_Sub_PreRenders = 0;
                            var_Sub_Audio = 0;
                            var_Sub_Misc = 0;

                            for (i = 1; i <= app.project.items.length; i++) {
                                current_name = app.project.item(i).name;

                                if (current_name == "***Collects-MoveToTree") {
                                    var_Collects = 1;
                                }
                                if (current_name == "1.Output") {
                                    var_Output = 1;
                                }
                                if (current_name == "2.MainComps") {
                                    var_MainComps = 1;
                                }
                                if (current_name == "3.PreComps") {
                                    var_PreComps = 1;
                                }
                                if (current_name == "4.Assets") {
                                    var_Assets = 1;
                                }
                                if (current_name == "5.Reference") {
                                    var_Ref = 1;
                                }
                                if (current_name == "Solids") {
                                    var_Solids = 1;
                                }

                                if (current_name == "_misc") {
                                    var_Sub_Misc = 1;
                                }
                            }

                            // Generate Folders
                            if (var_Collects == 0) {
                                my_collects_folder = app.project.items.addFolder("***Collects-MoveToTree");
                                my_collects_folder.label = (0);
                            }
                            if (var_Output == 0) {
                                my_output_folder = app.project.items.addFolder("1.Output");
                                my_output_folder.label = (8);
                            }
                            if (var_MainComps == 0) {
                                my_maincomp_folder = app.project.items.addFolder("2.MainComps");
                                my_maincomp_folder.label = (13);
                            }
                            if (var_PreComps == 0) {
                                my_precomp_folder = app.project.items.addFolder("3.PreComps");
                                my_precomp_folder.label = (14);
                            }
                            if (var_Assets == 0) {
                                my_assets_folder = app.project.items.addFolder("4.Assets");
                                for (i = 1; i <= my_assets_folder.items.length; i++) {
                                    if (current_name == "0_AECs") {
                                        var_Sub_AEC = 1;
                                    }
                                    if (current_name == "1_Raster") {
                                        var_Sub_Raster = 1;
                                    }
                                    if (current_name == "2_Vector") {
                                        var_Sub_Vector = 1;
                                    }
                                    if (current_name == "3_Stills") {
                                        var_Sub_Stills = 1;
                                    }
                                    if (current_name == "4_Footage") {
                                        var_Sub_Footage = 1;
                                    }
                                    if (current_name == "5_3D_Renders") {
                                        var_Sub_3dRenders = 1;
                                    }
                                    if (current_name == "6_PreRenders") {
                                        var_Sub_PreRenders = 1;
                                    }
                                    if (current_name == "7_Audio") {
                                        var_Sub_Audio = 1;
                                    }
                                }
                                if (var_Sub_AEC == 0) {
                                    my_aec = my_assets_folder.items.addFolder("0_AECs");
                                    my_aec.label = (11);
                                }
                                if (var_Sub_Raster == 0) {
                                    my_rast = my_assets_folder.items.addFolder("1_Raster");
                                    my_rast.label = (11);
                                }
                                if (var_Sub_Vector == 0) {
                                    my_vec = my_assets_folder.items.addFolder("2_Vector");
                                    my_vec.label = (11);
                                }
                                if (var_Sub_Stills == 0) {
                                    my_stills = my_assets_folder.items.addFolder("3_Stills");
                                    my_stills.label = (11);
                                }
                                if (var_Sub_Footage == 0) {
                                    my_footage = my_assets_folder.items.addFolder("4_Footage");
                                    my_footage.label = (11);
                                }
                                if (var_Sub_3dRenders == 0) {
                                    my_3d = my_assets_folder.items.addFolder("5_3D_Renders");
                                    my_3d.label = (11);
                                }
                                if (var_Sub_PreRenders == 0) {
                                    my_pre = my_assets_folder.items.addFolder("6_PreRenders");
                                    my_pre.label = (11);
                                }
                                if (var_Sub_Audio == 0) {
                                    my_aud = my_assets_folder.items.addFolder("7_Audio");
                                    my_aud.label = (11);
                                }

                                my_assets_folder.label = (11);
                                my_assets_folder.items;

                            }
                            if (var_Ref == 0) {
                                my_ref_folder = app.project.items.addFolder("5.Reference");
                                my_ref_folder.label = (10);
                            }
                            if (var_Solids == 0) {
                                my_solids_folder = app.project.items.addFolder("Solids");
                                my_solids_folder.label = (1);
                                my_sub_solids_folder = my_solids_folder.items.addFolder("_misc");
                                my_sub_solids_folder.label = (1);
                            }

                            // Return List Selection to 0
                            myPanel.grp.butDrpdwnlst00.selection = 0;
                            app.endUndoGroup();
                            break;

                    }
                }
            }
            //// Functions: Basic ... // End //

            //// Functions: Adjustment ... // Start // 
            function Mylist01() {
                if (((app.project.activeItem == null) || ((app.project.activeItem != null) && !(app.project.activeItem instanceof CompItem))) && (myPanel.grp.butDrpdwnlst01.selection != 13)) {
                    if (myPanel.grp.butDrpdwnlst01.selection != 0) {
                        alert("No Composition selected! You have to select a Composition in the Composition Panel first.");
                        myPanel.grp.butDrpdwnlst01.selection = 0;
                    }
                } else {

                    var selctd = myPanel.grp.butDrpdwnlst01.selection.index;
                    switch (selctd) {

                        case 1:
                            app.beginUndoGroup("Create ColorCorrection Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "ColorCorrection", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;
                            new_adjustment.Effects.addProperty("Exposure");
                            new_adjustment.Effects.addProperty("Levels");
                            new_adjustment.Effects.addProperty("Curves");
                            new_adjustment.Effects.addProperty("Hue/Saturation");

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 2:
                            app.beginUndoGroup("Create HighPass Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "HighPass", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;
                            new_adjustment.Effects.addProperty("Gaussian Blur");
                            new_adjustment.Effects.addProperty("Invert");
                            new_adjustment.Effects.addProperty("CC Composite");

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }

                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 3:
                            app.beginUndoGroup("Create Tritone Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "Tritone", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;
                            new_adjustment.Effects.addProperty("Tritone");

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;

                        case 4:
                            app.beginUndoGroup("Create MB Looks Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "MB Looks", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_adjustment.Effects.addProperty("Looks");
                            } catch (e) {
                                new_adjustment.remove();
                                alert("Magic Bullet Looks is not available!");
                                myPanel.grp.butDrpdwnlst01.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 6:
                            app.beginUndoGroup("Create RSMB Pro Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "RSMB Pro", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_adjustment.Effects.addProperty("RSMB Pro");
                            } catch (e) {
                                new_adjustment.remove();
                                alert("ReelSmart Motion Blur Pro is not available!");
                                myPanel.grp.butDrpdwnlst01.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 7:
                            app.beginUndoGroup("Create RSMB Pro Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "RSMB Pro Vectors", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_adjustment.Effects.addProperty("RSMB Pro Vectors");
                            } catch (e) {
                                new_adjustment.remove();
                                alert("ReelSmart Motion Blur Pro Vectors is not available!");
                                myPanel.grp.butDrpdwnlst01.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;

                        case 8:
                            app.beginUndoGroup("Create FL Depth of Field Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "FL Depth of Field", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_adjustment.Effects.addProperty("FL Depth of Field");
                            } catch (e) {
                                new_adjustment.remove();
                                alert("Frischluft Depth of Field is not available!");
                                myPanel.grp.butDrpdwnlst01.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;

                        case 10:
                            app.beginUndoGroup("Create Optical Flares Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Particular
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Optical Flare", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_solid.Effects.addProperty("Optical Flares");
                            } catch (e) {
                                new_solid.remove();
                                alert("Optical Flares is not available!");
                                myPanel.grp.butDrpdwnlst01.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one(s)
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;

                        case 11:
                            app.beginUndoGroup("Create Plexus Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Particular
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Plexus", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_solid.Effects.addProperty("Plexus");
                            } catch (e) {
                                new_solid.remove();
                                alert("Plexus is not available!");
                                myPanel.grp.butDrpdwnlst01.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one(s)
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;

                        case 12:
                            app.beginUndoGroup("Create FastBlur Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;
                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "FastBlur", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;
                            new_adjustment.Effects.addProperty("Fast Blur").property("Repeat Edge Pixels").setValue(true);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 13:
                            app.beginUndoGroup("Add Slider Control");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            if (slctd_layer.length == 0) {
                                alert("You have to select a layer to add a Slider Control.")
                            } else {
                                for (idx = 0; idx < slctd_layer.length; idx++)
                                    slctd_layer[idx].Effects.addProperty("Slider Control");
                            }

                            myPanel.grp.butDrpdwnlst01.selection = 0;
                            app.endUndoGroup();
                            break;


                            /*							case 14:	app.beginUndoGroup("Burn Timecode");
                            											// Selected Composition
                            											var comp = app.project.activeItem;
                            									
                            											var new_adjustment = comp.layers.addSolid([1,1,1], "Burn Timecode", comp.width,comp.height,comp.pixelAspect,comp.duration);
                            											new_adjustment.adjustmentLayer  = true;
                            											my_timecode = new_adjustment.Effects.addProperty("Timecode");
                            											my_timecode.property(1).setValue(2);				        // Set Unit to frames
                            											my_timecode.property(2).setValue(comp.frameRate);	// Set framerate to framerate of the Composition
                            											my_x = comp.width - comp.width/10;
                            											my_y = comp.height -comp.height/10;
                            											my_timecode.property(5).setValue([my_x, my_y]);		// Set Position
                            											my_timecode.property(6).setValue(30);	                    // Set Fontsize
                            									 
                            											myPanel.grp.butDrpdwnlst01.selection=0;
                            											app.endUndoGroup();
                            											break;
                            */

                    }
                }
            }
            //// Functions: Adjustment ... // End // 

            //// Functions: Trapcode ... // Start // 
            function Mylist02() {
                if ((app.project.activeItem == null) || ((app.project.activeItem != null) && !(app.project.activeItem instanceof CompItem))) {
                    if (myPanel.grp.butDrpdwnlst02.selection != 0) {
                        alert("No Composition selected! You have to select a Composition in the Composition Panel first.");
                        myPanel.grp.butDrpdwnlst02.selection = 0;
                    }

                } else {

                    var selctd = myPanel.grp.butDrpdwnlst02.selection.index;
                    switch (selctd) {

                        case 1:
                            app.beginUndoGroup("Create Particular Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Particular
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Particular", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_solid.Effects.addProperty("Particular");
                            } catch (e) {
                                new_solid.remove();
                                alert("Trapcode Particular is not available!");
                                myPanel.grp.butDrpdwnlst02.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one(s)
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 2:
                            app.beginUndoGroup("Create Form Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Form
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Form", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_solid.Effects.addProperty("Form");
                            } catch (e) {
                                new_solid.remove();
                                alert("Trapcode Form is not available!");
                                myPanel.grp.butDrpdwnlst02.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 3:
                            app.beginUndoGroup("Create Shine Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Adjustment Layer and apply Shine
                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "Shine", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_adjustment.Effects.addProperty("Shine");
                            } catch (e) {
                                new_adjustment.remove();
                                alert("Trapcode Shine is not available!");
                                myPanel.grp.butDrpdwnlst02.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 4:
                            app.beginUndoGroup("Create Starglow Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Adjustment Layer and apply Starglow
                            var new_adjustment = comp.layers.addSolid([1, 1, 1], "Starglow", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_adjustment.adjustmentLayer = true;

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_adjustment.Effects.addProperty("Starglow");
                            } catch (e) {
                                new_adjustment.remove();
                                alert("Trapcode Starglow is not available!");
                                myPanel.grp.butDrpdwnlst02.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_adjustment.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 6:
                            app.beginUndoGroup("Create 3D Stroke Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply 3D Stroke
                            var new_solid = comp.layers.addSolid([0, 0, 0], "3D Stroke", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_solid.Effects.addProperty("3D Stroke");
                            } catch (e) {
                                new_solid.remove();
                                alert("Trapcode 3D Stroke is not available!");
                                myPanel.grp.butDrpdwnlst02.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 7:
                            app.beginUndoGroup("Apply Echospace Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            if (slctd_layer.length == 0) {
                                alert("You have to select a layer to apply the Trapcode Echospace Effect.")
                            } else {
                                for (idx = 0; idx < slctd_layer.length; idx++)

                                    // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                                    try {
                                        var theEffect = slctd_layer[idx].Effects.addProperty("Echospace");
                                    }
                                catch (e) {
                                    alert("Trapcode Echospace is not available!");
                                    myPanel.grp.butDrpdwnlst02.selection = 0;
                                    app.endUndoGroup();
                                }

                                //slctd_layer[idx].Effects.addProperty("Echospace");
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 8:
                            app.beginUndoGroup("Create Horizon Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Horizon
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Horizon", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_solid.Effects.addProperty("Horizon");
                            } catch (e) {
                                new_solid.remove();
                                alert("Trapcode Horizon is not available!");
                                myPanel.grp.butDrpdwnlst02.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 9:
                            app.beginUndoGroup("Create Lux Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Lux
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Lux", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_solid.Effects.addProperty("Lux");
                            } catch (e) {
                                new_solid.remove();
                                alert("Trapcode Lux is not available!");
                                myPanel.grp.butDrpdwnlst02.selection = 0;
                                app.endUndoGroup();
                            }

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 11:
                            app.beginUndoGroup("Create SoundKeys Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Lux
                            var new_solid = comp.layers.addSolid([0, 0, 0], "SoundKeys", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Try to apply the selected Effect, if an error occurs the new layer will be deleted
                            try {
                                var theEffect = new_solid.Effects.addProperty("Sound Keys");
                            } catch (e) {
                                new_solid.remove();
                                alert("Trapcode Sound Keys is not available!");
                                myPanel.grp.butDrpdwnlst02.selection = 0;
                                app.endUndoGroup();
                            }

                            // Solo the Soundkeys Layer
                            new_solid.solo = 1;

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst02.selection = 0;
                            app.endUndoGroup();
                            break;
                    }
                }
            }
            //// Functions: Trapcode ... // End // 

            //// Functions: Generate ... // Start // 
            function Mylist03() {
                if ((app.project.activeItem == null) || ((app.project.activeItem != null) && !(app.project.activeItem instanceof CompItem))) {
                    if (myPanel.grp.butDrpdwnlst03.selection != 0) {
                        alert("No Composition selected! You have to select a Composition in the Composition Panel first.");
                        myPanel.grp.butDrpdwnlst03.selection = 0;
                    }

                } else {

                    var selctd = myPanel.grp.butDrpdwnlst03.selection.index;
                    switch (selctd) {

                        case 1:
                            app.beginUndoGroup("Create Fill Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Fill Effect
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Fill", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_solid.Effects.addProperty("Fill");
                            new_solid.Effects.Fill.property("Color").setValue([0.5, 0.5, 0.5]);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 2:
                            app.beginUndoGroup("Create Gradient Ramp Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Ramp Effect
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Gradient Ramp", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_solid.Effects.addProperty("Gradient Ramp");

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 3:
                            app.beginUndoGroup("Create 4-Color Gradient Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply 4-Color Gradient
                            var new_solid = comp.layers.addSolid([0, 0, 0], "4-Color Gradient", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            my_4colorgradient = new_solid.Effects.addProperty("4-Color Gradient");
                            my_4colorgradient.property("Color 1").setValue([1, 1, 0.5]);
                            my_4colorgradient.property("Color 2").setValue([0.5, 1, 0.5]);
                            my_4colorgradient.property("Color 3").setValue([1, 0.5, 1]);
                            my_4colorgradient.property("Color 4").setValue([0.5, 0.5, 1]);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 4:
                            app.beginUndoGroup("Create Fractal Noise Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Fractal Noise
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Fractal Noise", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_solid.Effects.addProperty("Fractal Noise");

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;

                        case 5:
                            app.beginUndoGroup("Create Checkerboard Layer");

                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Checkerboard
                            var new_solid = comp.layers.addSolid([1, 1, 1], "Checkerboard", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_solid.Effects.addProperty("Checkerboard");
                            new_solid.Effects.Checkerboard.property("Width").setValue(comp.width / 20);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 6:
                            app.beginUndoGroup("Create Grid Layer");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid and apply Grid
                            var new_solid = comp.layers.addSolid([0, 0, 0], "Grid", comp.width, comp.height, comp.pixelAspect, comp.duration);
                            new_solid.Effects.addProperty("Grid");
                            new_solid.Effects.Grid.property("Size From").setValue(2)
                            new_solid.Effects.Grid.property("Width").setValue(comp.width / 20);
                            new_solid.Effects.Grid.property("Border").setValue(3);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 8:
                            app.beginUndoGroup("Create Solid (black)");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid (black)
                            var new_solid = comp.layers.addSolid([0, 0, 0], " Solid", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }
                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 9:
                            app.beginUndoGroup("Create Solid (white)");
                            // Selected Composition
                            var comp = app.project.activeItem;
                            // Selected Layers
                            var slctd_layer = comp.selectedLayers;

                            // Create new Solid (white)
                            var new_solid = comp.layers.addSolid([1, 1, 1], " Solid", comp.width, comp.height, comp.pixelAspect, comp.duration);

                            // Position of the new Layer
                            // Check if at least one Layer is Selected
                            // if so move the new Layer on top of the selected one
                            if (slctd_layer[0] != null) {

                                // Search for the Layer with the lowest index
                                i = 0; // Set Counter
                                lowest_index = slctd_layer[i].index; // Initilize the placeholder for the index of the lowest layer to the first layer in the array
                                top_layer = slctd_layer[i]; // Set the Output to the layer of the placeholder								   								

                                // Go through the array of the selected layers
                                while (i < slctd_layer.length) {

                                    // If the placeholder is bigger than the current layer set the placeholder to the value of the current layer
                                    if (lowest_index > slctd_layer[i].index) {
                                        lowest_index = slctd_layer[i].index;
                                        top_layer = slctd_layer[i];
                                    }
                                    i++;
                                }
                                // Move the new Layer on top of the layer with the lowest index
                                new_solid.moveBefore(top_layer);
                            }
                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 11:
                            app.beginUndoGroup("Set Composition Background Black");

                            app.project.activeItem.bgColor = [0, 0, 0];

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 12:
                            app.beginUndoGroup("Set Composition Background White");

                            app.project.activeItem.bgColor = [1, 1, 1];

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;


                        case 13:
                            app.beginUndoGroup("Set Composition Background Red");

                            app.project.activeItem.bgColor = [1, 0, 0];

                            myPanel.grp.butDrpdwnlst03.selection = 0;
                            app.endUndoGroup();
                            break;
                    }
                }
            }
            //// Functions: Generate ... // End // 

            //// Functions: About // Start // 
            function my_About() {
                about_Str = "FOM Friend\n" +
                    "Based on Get-Sh*t_Done - Palette 0.95\n" +
                    "(c) 2010 markusfeder.com\n" +
                    // Q Spans
                    //  Sends either Composition marker spans or selected layer marker spans to the Render Queue and appends the marker comment to the filename.
                    //  Useful for queueing multiple parts of a single comp, without having to rename each output.
                    "\n" +
                    "Q Spans\n" +
                    "Sends either Composition marker spans or selected layer marker spans to the Render Queue and appends the marker comment to the filename.\n" +
                    "Useful for queueing multiple parts of a single comp, without having to rename each output.\n" +
                    "Known Issue: Markers must be spans. A non-span marker wil break script.\n" +
                    "Original script by Matt Volp @Tack_Studio www.tackstudio.co\n" +
                    "---- Scripts Modified and UI Consolidated ---- Dec 2023 ----\n" +
                    "Jason Schwarz - hellolovely.tv\n";

                alert(about_Str);
            }

            //// Functions: About // End //

            //// Functions: Q Spans // Start //
            function queueCompMarkerSpans() {
                // Selected Composition
                var comp = app.project.activeItem;
    
                // Check if a composition is selected
                if (!comp || !(comp instanceof CompItem)) {
                    alert("Please select a composition.");
                    return;
                }

                // Composition markers
                var compMarkers = comp.markerProperty;

	            // Project file path
                var projPath = app.project.file.path;

                // Check if the composition has markers
                if (compMarkers.numKeys > 0) {
                    for (var i = 1; i <= compMarkers.numKeys; i++) {
                        var item = app.project.renderQueue.items.add(comp);
                        item.timeSpanStart = compMarkers.keyTime(i);
                        item.timeSpanDuration = compMarkers.keyValue(i).duration;

                        var output = item.outputModules[1];
                        var outputFilePath = projPath + "/_Renders/" + comp.name + "_" + compMarkers.keyValue(i).comment;
                        output.file = new File(outputFilePath);
                    }
                } else {
                    alert("The selected composition has no markers.");
                }
            }
            function queueLayerMarkerSpans() {
                // Selected Composition
                var comp = app.project.activeItem;

                // Check if a composition is selected
                if (!comp || !(comp instanceof CompItem)) {
                    alert("Please select a composition.");
                    return;
                }

                // Selected Layer
                var spanLayer = comp.selectedLayers[0]; // Assuming you want the first selected layer

                // Check if a layer is selected
                if (!spanLayer) {
                    alert("Please select a layer.");
                    return;
                }

                // Project file path
                var projPath = app.project.file.path;

                var layerMarkers = spanLayer.property("Marker");

                if (layerMarkers.numKeys > 0) {
                    for (var i = 1; i <= layerMarkers.numKeys; i++) {
                        var item = app.project.renderQueue.items.add(comp);
                        item.timeSpanStart = layerMarkers.keyTime(i);
                        item.timeSpanDuration = layerMarkers.keyValue(i).duration;

                        var output = item.outputModules[1];
                        var outputFilePath = projPath + "/_Renders/" + comp.name + "_" + layerMarkers.keyValue(i).comment;
                        output.file = new File(outputFilePath);
                    }
                } else {
                    alert("The selected layer has no markers.");
                }
            } 
            //// Functions: Q Spans // End // 

            // rd_MergeProjects_mergeFolderContents()
            // 
            // Description:
            // This function merges the source folder's hierarchy with that of the target folder's.
            // 
            // Parameters:
            //   srcFolder - FolderItem object whose contents will be merged.
            //   targetFolder - FolderItem object where merged contents will be placed.
            // 
            // Returns:
            // Nothing.
            //
            function rd_MergeProjects_mergeFolderContents(srcFolder, targetFolder) {
                var item;

                // Loop through srcFolder.items in reverse (so that any removal of folders doesn't mess up the looping)
                for (var i = srcFolder.numItems; i >= 1; i--) {
                    item = srcFolder.item(i);

                    if (!(item instanceof FolderItem)) // Move non-folder items to srcFolder
                        item.parentFolder = targetFolder;
                    else // For folders, check for matching named folder in targetFolder and merge if exists
                    {
                        // Look for first matching named subfolder in targetFolder
                        matchingSubFolder = null;
                        for (j = 1; j <= targetFolder.numItems; j++) {
                            targetSubItem = targetFolder.item(j);
                            if ((targetSubItem instanceof FolderItem) && (targetSubItem.name === item.name)) {
                                matchingSubFolder = targetSubItem;
                                break;
                            }
                        }

                        // If found a matching subfolder, merge recursively, else merge up directly
                        if (matchingSubFolder !== null) {
                            // Merge subfolder recursively
                            rd_MergeProjects_mergeFolderContents(item, matchingSubFolder);

                            // Remove folder (which should be empty, but just checking)
                            if (item.numItems === 0)
                                item.remove();
                        } else
                            item.parentFolder = targetFolder;
                    }
                }
            }




            // rd_MergeProjects_doMergeFolders()
            // 
            // Description:
            // This function handles the merge operation.
            // 
            // Parameters:
            // None.
            // 
            // Returns:
            // Nothing.
            //
            function rd_MergeProjects_doMergeFolders() {
                // Check that a project exists
                if (app.project === null)
                    return;

                // Perform operation as a single undoable event
                app.beginUndoGroup(rd_MergeProjectsData.scriptName);

                // Check that only one top-level folder is selected; if not, ask user for project to import
                var masterFolder = app.project.activeItem;

                if (masterFolder === null) {
                    // Ask user for project file to import
                    app.project.importFileWithDialog();
                    masterFolder = app.project.activeItem;
                    if (masterFolder === null)
                        return;
                }

                if (!(masterFolder instanceof FolderItem) || (masterFolder.parentFolder !== app.project.rootFolder)) {
                    alert(rd_localize(rd_MergeProjectsData.strErrNoTopFolderSel), rd_MergeProjectsData.scriptName);
                    return;
                }

                // Do any pre-merge operations

                // If removing unused items, check if selected folder is empty;
                // if so, have this script delete the empty folder instead of removeUnusedFootage() to avoid deleting the selected folder
                var removedItems = -1; // Assume not removing any unused items
                var consolidatedItems = -1; // Assume not consolidating any items

                if (eval(myScriptPal.grp.MP.header.removeFootage.value) && (masterFolder.numItems !== 0))
                    removedItems = app.project.removeUnusedFootage();

                // Check if wanting to consolidate items beforehand
                if (eval(myScriptPal.grp.MP.header.consolidateFootage.value))
                    consolidatedItems = app.project.consolidateFootage();

                // Merge the master folder's contents with that of the project's root folder
                rd_MergeProjects_mergeFolderContents(masterFolder, app.project.rootFolder);

                // Build additional status info, if selected to do any pre-merge operations
                var msg = "";

                if (consolidatedItems !== -1) // Identify the number of items consolidated
                    msg = msg + " " + rd_localize(rd_MergeProjectsData.strConsolidatedResult).replace("%d", consolidatedItems);
                if (removedItems !== -1) // Identify the number of unused items removed
                    msg = msg + " " + rd_localize(rd_MergeProjectsData.strRemovedResult).replace("%d", removedItems);

                // Delete the master folder (which should be empty, but just checking)
                if (masterFolder.numItems === 0) {
                    var statusMsg = rd_localize(rd_MergeProjectsData.strMergeOK).replace("%s", masterFolder.name);

                    masterFolder.remove();
                    alert(statusMsg + msg, rd_MergeProjectsData.scriptName);
                } else
                    alert(rd_localize(rd_MergeProjectsData.strMergeFail).replace("%s", masterFolder.name) + msg, rd_MergeProjectsData.scriptName);

                // End of undo event
                app.endUndoGroup();
            }





            // End Functions ---
        }

        // Prerequisite check for After Effects CS4 or later
        if (parseFloat(app.version) < 9.0)
            alert(rd_localize(rd_MergeProjectsData.strMinAE90), rd_MergeProjectsData.scriptName);
        else {

            var myScriptPal = myScript_buildUI(thisObj);

            // If myScript returns a Window, it will Center & Show ---
            if (myScriptPal != null) {
                // Update UI values, if saved in the settings
                if (app.settings.haveSetting("redefinery", "rd_MergeProjects_consolidateFootage"))
                    myScriptPal.grp.MP.header.consolidateFootage.value = eval(app.settings.getSetting("redefinery", "rd_MergeProjects_consolidateFootage"));
                if (app.settings.haveSetting("redefinery", "rd_MergeProjects_removeFootage"))
                    myScriptPal.grp.MP.header.removeFootage.value = eval(app.settings.getSetting("redefinery", "rd_MergeProjects_removeFootage"));

                // Save current UI settings upon closing the palette
                myScriptPal.onClose = function() {
                    app.settings.saveSetting("redefinery", "rd_MergeProjects_consolidateFootage", myScriptPal.grp.MP.header.consolidateFootage.value);
                    app.settings.saveSetting("redefinery", "rd_MergeProjects_removeFootage", myScriptPal.grp.MP.header.removeFootage.value);
                }


                if (myScriptPal instanceof Window) {
                    myScriptPal.center();
                    myScriptPal.show();
                } else
                    myScriptPal.layout.layout(true);
            }
        }
    }
    myScript(this);
}
