#version 400 core
layout(location = 0) in vec3 position;
uniform mat4 view;
uniform int width, height;
uniform float park, tree, grass, seed, camera, h, v;
uniform float time;

out vec2 iResolution;
out float iTime;
out float iPark, iTree, iGrass, iSeed, iCamera, iH, iV;

void main() {
    iTime = time;
    iPark = park;
    iTree = tree;
    iGrass = grass;
    iSeed = seed;
    iCamera = camera;
    iH = h;
    iV = v;
    iResolution = vec2(width, height);
    gl_Position = vec4(position, 1.0);
}



