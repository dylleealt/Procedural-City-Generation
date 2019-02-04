CS1230 Final Project Handin:
How to use the program, run qtCreator and open the lab5.pro file. Run using
qtCreators release mode.

3 New Features:
Fractal Terrain, L-systems Plants, Procedural City Generation

Design Choices:
This Procedural City Generation contribution was completed mainly by gbarboy.
Implemented multiple complex primitives for stories of buildings.Given a primitive,
 with some probability an extra primitive gets added to the building's geometry.
 In the code this extra primitive gets referred to as a "wing." The general
 approach to the procedural generation was exploitation of the floor and fract
 GLSL functions, that split the ground plane into a 1x1 grid. The fract of
 the original coordinates gave the position within the grid which made the problem
 "mappable." The floor of the original coordinates gave the position of the cell
 in the 1x1 grid allowing a basis to randomly index into a noise function.

The contribution of l-systems plants was mainly done by Giuse, gnguyen4. Chose
to implement an l-system that has multiple layers of branches for plants.
Important methods include: sdCappedCylinder and lindenCyl. Three helper methods
to create rotation/translation matrices were also implemented.

The Fractal Terrain was mainly completed by dtian2. Chose use a form of noise
function to distort a plane, creating hills in the park. There is also grass which
is created using Voronoi noise.

Old Feature: GPU Raymarching - Used the shadertoy code from lab 10.

Known Issues/Bugs:

Low FPS.
