3D Creator
==========

3D Creator is a prototype that enables students (grades 7-12) to use block-based programming to create immersive 3D scenes. It's designed such that students only need knowledge of x, y, and z planes, and it gently introduces more complex topics over time.

It provides an immediate feedback loop (when a block is added, the scene automatically updates, with no render time) and uses PBR (Physically Based Rendering) to create realistic materials, reflections, and lighting.

Designed to run on minimal hardware, 3D Creator is fully browser-based and requires no installation. It also runs well (at 60fps) on most low-end laptops and Chromebooks.

3D Creator is made possible by two incredible open source projects: [Google's Blockly](https://github.com/google/blockly) and [BabylonJS](https://github.com/BabylonJS/Babylon.js). All public domain materials and HDRIs sourced from [ambientCG](https://ambientcg.com/) and [Poly Haven](https://polyhaven.com/).

# Using 3D Creator

To launch 3D Creator, browse to https://simonguest.github.io/3dcreator

![image](https://user-images.githubusercontent.com/769225/212595846-73db5a6a-0179-446e-9ce8-0c03839ba885.png)

Drag blocks on to the workspace to build your scene:

![image](https://user-images.githubusercontent.com/769225/212596959-0d439e17-6e8c-4bca-b618-dca98529d1aa.png)

The example projects (fourth button from the right) demonstrate some of the more advanced features of 3D Creator:

![image](https://user-images.githubusercontent.com/769225/212597590-d016abe5-8880-47d6-b952-6bf68242f6bd.png)

# Toolbar Controls

![image](https://user-images.githubusercontent.com/769225/212596338-cd9e2802-eaf8-4cec-b4e6-9eb734541876.png)

From left to right, the toolbar offers the following functionality:

- **Reset:** Resets the camera view in the current scene.
- **Enable Physics:** Enables the Ammo physics engine for the current scene.
- **Full Screen:** Displays the current scene in full screen.
- **VR Mode:** Displays the current scene on an Oculus Quest (using WebXR) or Google Cardboard.
- **Scene Debug:** Enables the debug view for object debugging.

- **Examples:** Open an example project.
- **Open:** Open a previously saved workspace file.
- **Download:** Download the workspace to a file.
- **Clear:** Clear the current workspace and scene.

# Browser Support

3D Creator has been tested on Firefox, Chrome, and Safari. It also is touch-responsive, so should work well on most tablets (tested on iPad Air), but is not responsive for an iPhone/smart phone form factor.

# Building and Running 3D Creator Locally

Clone the repo and run ```npm install``` to install the required dependencies.

To run the server, run ```npm run server```. After the build is complete, browse to http://localhost:55000.
