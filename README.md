3D Creator
==========

3D Creator is a prototype that shows how students (grades 7-12) can use block-based programming to create immersive 3D scenes. It's designed such that students only need knowledge of x, y, and z planes, and gently introduces more complex 3D topics over time.

It provides an immediate feedback loop (when a block is added, the scene automatically updates, with no render time) and uses PBR (Physically Based Rendering) to create realistic materials, reflections, and lighting.

Designed to run on minimal hardware, 3D Creator is fully browser-based and requires no installation. It runs well (at 60fps for most scenes) on most low-end laptops and Chromebooks.

3D Creator is made possible by [Google's Blockly](https://github.com/google/blockly) and [BabylonJS](https://github.com/BabylonJS/Babylon.js). All public domain materials and HDRIs sourced from [ambientCG](https://ambientcg.com/) and [Poly Haven](https://polyhaven.com/).

# Using 3D Creator

To launch 3D Creator, browse to https://simonguest.github.io/3dcreator. Drag blocks on to the workspace to build your scene:

![image](https://github.com/simonguest/3dcreator/assets/769225/9e44a78a-b3b0-4a27-a3ae-d21cf7a3a075)

The sample projects (fourth button from the right on the toolbar) demonstrate some of the more advanced features of 3D Creator:

![image](https://github.com/simonguest/3dcreator/assets/769225/90c41afb-343c-40b3-a8b2-909cf3eaf8dc)

# Toolbar Controls

![image](https://github.com/simonguest/3dcreator/assets/769225/7a0d0194-c774-4f57-ab2a-52e4a16bce09)

From left to right, use the toolbar to:

- **Reset:** Resets the camera view in the current scene.
- **Physics:** Enables the physics engine for the current scene.
- **Full:** Displays the current scene in full screen mode. Hit Esc to exit full screen.
- **VR:** Displays the current scene on an Oculus Quest (using WebXR) or Google Cardboard.
- **Debugger:** Enables the debug view for object debugging.

- **Examples:** Open an example project.
- **Upload:** Upload a previously saved workspace file.
- **Export:** Export the current workspace to a file.
- **Clear:** Clear the current workspace and scene.
- **Help:** Launch a short tutorial on how to use 3D Creator.

# Example Projects

Example projects can be opened via the toolbar (as shown above) or via direct URLs:

- [TV Room](https://simonguest.github.io/3dcreator/?sample=tv-room.json&phys=0)
- [Spinning Code.org](https://simonguest.github.io/3dcreator/?sample=spinning-codeorg.json&phys=0)
- [Solar System](https://simonguest.github.io/3dcreator/?sample=solar-system.json&phys=0)
- [Red Pill, Blue Pill](https://simonguest.github.io/3dcreator/?sample=redpill-bluepill.json&phys=1) (Click on the scene and press A to add more and B to release.)
- [Pegboard Game](https://simonguest.github.io/3dcreator/?sample=pegboard.json&phys=1) (Click on the scene and press A and D to move, S to release.)

# Browser Support

3D Creator has been tested on Firefox, Chrome, and Safari. It also is touch-responsive, so should work well on most tablets (tested on iPad Air), but is not responsive for an iPhone/smart phone form factor.

# Building and Running Locally

Clone the repo and run ```npm install``` to install the required dependencies.

To run the server, run ```npm run server```. After the build is complete, browse to http://localhost:55000.
