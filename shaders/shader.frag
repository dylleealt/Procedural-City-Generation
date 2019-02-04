#version 400 core

in float iPark, iTree, iGrass, iSeed, iCamera;

in vec2 iResolution;   // Viewport Resolution
in float iTime;
out vec4 fragColor;

#define SPHERE 0
#define PLANE 1
#define NO_INTERSECT 2
#define BOX 3
#define HEX 4
#define SIDEWALK 5
#define TERRAIN 6
#define TREE 7

#define STORY 0.125
#define BUILD_R 0.32
#define MID_SEC 0.1

//Section Heights
#define MAX_S1 8.0
#define MAX_S2 6.0
#define MAX_S3 6.0

#define D_RAD 6.0
#define SIDEWALK_H 0.001
#define SIDEWALK_W 0.01

#define YELLOW_MIN 0.48
#define YELLOW_MAX 0.49

#define DASH_MIN 0.36
#define DASH_MAX 0.39
#define DASH_LEN 0.03

#define CROSS_MIN 0.25
#define CROSS_MAX 0.35
#define CROSS_LEN 0.055

#define T0 0.0
#define T1 8.0
#define T2 20.0
#define T3 27.0
#define T4 34.0

#define M_PI 3.1415926535

vec3 parkLoc = vec3(5.0, 0.0, 3.8);

// -----------------------------------------------------------------------------
// Raymarching struct
struct PrimitiveDist {
    float dist;
    int primitive;
};

// Compare pd by distance
PrimitiveDist compPD(PrimitiveDist d1, PrimitiveDist d2)
{
    if(d1.dist<d2.dist){
        return d1;
    } else {
        return d2;
    }
}

// -----------------------------------------------------------------------------
// -----------------------------------SDFS--------------------------------------
// -----------------------------------------------------------------------------
//From http://www.iquilezles.org/www/articles/distfunctions/distfunctions.html

float sdFloor(vec3 p) {
    return p.y;
}

// http://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
mat3 rotate3d(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}

float sdHexPrism(vec3 pos, vec2 h)
{
    vec3 p = vec3(pos.x, pos.y - h.y, pos.z);
    p = rotate3d(vec3(1.0, 0.0, 0.0), M_PI/2.0) * p;
    const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
    p = abs(p);
    p.xy -= 2.0*min(dot(k.xy, p.xy), 0.0)*k.xy;
    vec2 d = vec2(
       length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x), h.x))*sign(p.y-h.x),
       p.z-h.y );
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdBox(vec3 pos, vec3 b)
{
  vec3 p = pos;
  p = vec3(pos.x, pos.y - b.y, pos.z);
  vec3 d = abs(p) - b;
  return length(max(d,0.0))
         + min(max(d.x,max(d.y,d.z)),0.0);
}

float sdSphere(vec3 p, float r){
    return length(p) - r;
}

float sdCylinder(vec3 p, vec2 h)
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec4 testing = vec4(p, 1.);
  p -= vec3(0.,h.y, 0);
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

// -----------------------------------------------------------------------------
// ---------------------------------TERRAIN-------------------------------------
// -----------------------------------------------------------------------------

// terrain hash
float hash( float n ) { return fract(sin(n)*43758.5453123); }


float hash(vec2 p)
{
          p  = fract(p / 0.2168);
    p += dot(p.xy, p.yx+19.19);
    return fract(p.x * p.y);
}

// Noise functions -------------------------------------------------------------

float noise(in vec2 x)
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                    mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
    return res;
}

float fractalNoise(in vec2 xy)
{
        float w = .7;
        float f = 0.0;

        for (int i = 0; i < 3; i++)
        {
                f += noise(xy) * w;
                w = w*0.6;
                xy = 2.0 * xy;
        }
        return f;
}


vec2 Voronoi( in vec2 x )
{
        vec2 p = floor(x);
        vec2 f = fract(x);
        float res = 100.0, id;
        for(int j = -1; j <= 1; j++)
        for(int i = -1; i <= 1; i++)
        {
                vec2 b = vec2(float(i), float(j));
                vec2 r = vec2(b) - f  + hash(p + b);
                float d = dot(r, r);
                if(d < res){
                        res = d;
                        id = hash(p+b);
    }
  }
        return vec2(max(.4-sqrt(res), 0.0),id);
}

// Terrain functions -----------------------------------------------------------

float smoothStep(float a, float b, float t)
{
        return clamp((t-a)/(b-a), 0.0, 1.0);
}

float heightMap( in vec2 p)
{
        vec2 pos = p*0.003;
        float w = 60.0;
        float f = .0;
        for (int i = 0; i < 3; i++)
        {
                f += noise(pos) * w;
                w = w * 0.62;
                pos *= 2.5;
        }

        return f;
}

vec3 grassHeight(vec3 p)
{
        float base = heightMap(p.xz) - 1.9;
        float height = noise(p.xz*2.0)*.7 + noise(p.xz)*.15 + noise(p.xz*.5)*.001;
        float y = p.y - base - height;
        y = y*y;
        vec2 ret = Voronoi((p.xz*2.5+sin(y*0.4+p.zx*0.3)*.12+vec2(sin(2.3+0.1*p.z),sin(3.6+0.1*p.x))*y*.5));
        float f = ret.x * .6 + y * .58;
        return vec3( y - f*1.4, clamp(f * 1.5, 0.0, 1.0), ret.y);
}

float CircleOfConfusion(float t)
{
        return max(t * 0.04, (2.0 / iResolution.y) * (1.0 + t));
}

vec3 grassBlades(in vec3 rO, in vec3 rD, in vec3 mat, in float dist)
{
        float d = 0.0;
        float rCoC = CircleOfConfusion(dist*2.7);
        float alpha = 0.0;

        vec4 col = vec4(mat*0.15, 0.0);

        for (int i = 0; i < 5; i++)
        {
                if (col.w > .99) break;
                vec3 p = rO + rD * d;

                vec3 ret = grassHeight(p);
                ret.x += .5 * rCoC;

                if (ret.x < rCoC)
                {
                        alpha = (1.0 - col.y) * smoothStep(-rCoC, rCoC, -ret.x);
                        // Mix material with white tips for grass
                        vec3 gra = mix(mat, vec3(.35, .35, min(pow(ret.z, 4.0)*35.0, .35)), pow(ret.y, 9.0)*.7) * ret.y;
                        col += vec4(gra * alpha, alpha);
                }
                d += max(ret.x * .7, .1);
        }
        if(col.w < .2)
                col.xyz = vec3(0.1, .19, 0.05);
        return col.xyz;
}

PrimitiveDist sdTerrain(in vec3 p, in float scale)
{
    float h = max(heightMap(p.xz * scale) / scale - 50.0 / scale, 0.0);
    return PrimitiveDist(p.y - h, TERRAIN);
}

vec3 terrainColour(vec3 pos, vec3 dir,  vec3 normal, float dis)
{
    vec3 mat = mix(vec3(.0,.3,.0), vec3(.2,.3,.0), noise(pos.xz*.25));
    float t = fractalNoise(pos.xz * .1)+.5;
    mat = grassBlades(pos, dir, mat, dis) * t;
        return mat;
}

// -----------------------------------------------------------------------------
// ---------------------------------L-SYSTEMS-----------------------------------
// -----------------------------------------------------------------------------

// transformation functions ----------------------------------------------------
mat4 Ry (float angle) {
    float c = cos(angle);
    float s = sin(angle);

return  mat4(
        vec4(c, 0, -s, 0),
        vec4(0, 1, 0, 0),
        vec4(s, 0, c, 0),
        vec4(0, 0, 0, 1)
);
}

mat4 Rz (float angle)
{
    float c = cos(angle);
    float s = sin(angle);

return  mat4(
        vec4(c, s, 0, 0),
        vec4(-s, c, 0, 0),
        vec4(0, 0, 1, 0),
        vec4(0, 0, 0, 1)
);
}

mat4 Disp (vec3 displacement)
{
return  mat4(
        vec4(1, 0, 0, 0),
        vec4(0, 1, 0, 0),
        vec4(0, 0, 1, 0),
        vec4(displacement, 1)
);
}

// SDF for tree
float lindenCyl(vec3 p) {
    //Depth of the recursion
    int depth = 4;
    //width of a cylinder
    float cylWidth = 0.06;
    //height of the stump of the cylinder
    float cylHeight = 0.3;
    float l = cylHeight;
    float smallFW = 0.7; //multiplicative factor to decrease width of branches
    vec2 first = vec2(cylWidth, cylHeight); // first cylinder dimensions
    vec3 pt_n = p; //This is the ray that might hit a sdCappedCyl.
    mat4 phi = Rz(40./360.*2.*M_PI); //This is the bend off the z axis.
     // this is the rotation on the y axis
    float stump = sdCappedCylinder(p, first); // This is the cylinder float of the stump.
      for (int i = 1; i <= depth; ++i) //On the base cylinder, draw 4 more cylinders
      {
        cylWidth *= smallFW;
        l *= 0.55;
        mat4 theta = Ry(-120./360.*2.*M_PI);
        mat4 mx1 = theta*phi*Disp(vec3(0,-2.*l - l/2.,0));

        mat4 mx2 = phi*theta*Disp(vec3(0,-2.*l,0));

        mat4 mx3 = Disp(vec3(0,-4.*l,0));
    theta = Ry(-240./360.*2.*M_PI);
        mat4 mx4 = phi*theta*Disp(vec3(0,-2.*l - l/4.,0));

        vec3 pt_1 = (mx1 * vec4(pt_n,1)).xyz;
        vec3 pt_2 = (mx2 * vec4(pt_n,1)).xyz;
        vec3 pt_3 = (mx3 * vec4(pt_n,1)).xyz;
        vec3 pt_4 = (mx4 * vec4(pt_n,1)).xyz;

        float z1 = sdSphere((Disp(vec3(0.,-l*2.,0.))*vec4(pt_1, 1.)).xyz,2.5*l);
        float z2 = sdSphere((Disp(vec3(0.,-l*2.,0.))*vec4(pt_2, 1.)).xyz,2.5*l);
        float z3 = sdSphere((Disp(vec3(0.,-l*2.,0.))*vec4(pt_3, 1.)).xyz,2.5*l);
        float z4 = sdSphere((Disp(vec3(0.,-l*2.,0.))*vec4(pt_4, 1.)).xyz,2.5*l);

        float y1= sdCappedCylinder(pt_1, vec2(cylWidth,l));
        float y2= sdCappedCylinder(pt_2, vec2(cylWidth,l));
        float y3= sdCappedCylinder(pt_3, vec2(cylWidth,l));
        float y4= sdCappedCylinder(pt_4, vec2(cylWidth,l));

        float mi = min(min(z1, min(z2,z3)), z4);
    vec3 pt;
        if (mi == z1){
             pt =pt_1;
        }else if(mi == z2){
             pt = pt_2;
        }else if(mi == z3) {
            pt = pt_3;
        }

        pt_n = (mi < z4) ? pt : pt_4;

        stump = min( stump, min(min(y1,min(y2,y3)), y4));
        float epsilon = .6;
        if (mi < epsilon) {continue;}
          //break;
          return min(mi,stump);

      }

    return stump;
}

// -----------------------------------------------------------------------------
// ---------------------------------BUILDINGS-----------------------------------
// -----------------------------------------------------------------------------

// Hash functions --------------------------------------------------------------
float rand_2_1(vec2 v) {
    return fract(iSeed * sin(v.x * 127.1 + v.y * 311.7) * 43758.5453123);
}
float rand_1_1(float f) {
    return fract(iSeed * sin(f * 435.23) * 5489.9847);
}

// Rotate ----------------------------------------------------------------------
// From TheBookOfShaders Rotation article
mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

// Create buildings ------------------------------------------------------------
PrimitiveDist section(vec3 p, float rad, int stories, vec2 id){
    float side = rad*0.75;
    float randForShape = rand_1_1(rand_2_1(id));
    if(randForShape < 0.6){
        float box = sdBox(p, vec3(side, float(stories) * STORY, side));
                PrimitiveDist boxPD = PrimitiveDist(box, BOX);

        float randForTower = rand_1_1(rand_1_1(id.x) + rand_1_1(id.y));
        if(randForTower > 0.7){
            float randTower = rand_1_1(randForTower);
            vec3 offsetPos;
            if(randTower < 0.25){
                offsetPos = p + vec3(side * 0.5, 0.0, 0.0);
            } else if((randTower > 0.25) && (randTower < 0.5)) {
                offsetPos = p + vec3(-side * 0.5, 0.0, 0.0);
            } else if((randTower > 0.5) && (randTower < 0.75)) {
                offsetPos = rotate3d(vec3(0.0, 1.0, 0.0), M_PI/2.0) * (p + vec3(0.0, 0.0, side * 0.5));
            } else {
                offsetPos = rotate3d(vec3(0.0, 1.0, 0.0), M_PI/2.0) * (p + vec3(0.0, 0.0, -side * 0.5));
            }
            float tower = sdHexPrism(offsetPos, vec2(side, float(stories) * STORY));
            PrimitiveDist towerPD = PrimitiveDist(tower, HEX);
            return compPD(boxPD, towerPD);
        } else {
            return boxPD;
        }
    } else {
        float hex = sdHexPrism(p, vec2(side, float(stories) * STORY));
                PrimitiveDist hexPD = PrimitiveDist(hex, HEX);

        float randForTower = rand_1_1(rand_1_1(id.x) + rand_1_1(id.y));
        if(randForTower > 0.5){
            float randTower = 0.9 * rand_1_1(randForTower); // Scale to make probabilities nicer
            vec3 offsetPos;
            mat3 rot = rotate3d(vec3(0.0, 1.0, 0.0), M_PI/3.0);
            vec3 dir1 = vec3(cos(M_PI/6.0),0.0, sin(M_PI/6.0));
            vec3 dir2 = vec3(cos(M_PI*5.0/6.0),0.0, sin(M_PI*5.0/6.0));
            float mag = side * sqrt(3.0)/2.0;
            if(randTower > 0.5){
                offsetPos = rot * (p + mag * dir1);
            } else if((randTower > 0.15) && (randTower < 0.3)) {
                offsetPos = rot * (p + mag * -dir1);
            } else if((randTower > 0.3) && (randTower < 0.45)) {
                offsetPos = rot * (p + mag * dir2);
            } else if((randTower > 0.45) && (randTower < 0.6)){
                offsetPos = rot * (p + mag * -dir2);
            } else if((randTower > 0.6) && (randTower < 0.75)){
                offsetPos = p + mag * vec3(0.0, 0.0, 1.0);
            } else {
                offsetPos = p - mag * vec3(0.0, 0.0, 1.0);
            }
                float tower = sdBox(offsetPos, vec3(side * 0.5, float(stories) * STORY, side * 0.5));
            PrimitiveDist towerPD = PrimitiveDist(tower, BOX);
            return compPD(hexPD, towerPD);
        } else {
            return hexPD;
        }
    }
}

PrimitiveDist building(vec3 p){
    vec2 block = floor(p.xz);
    vec3 blockPos = vec3(fract(p.x) - 0.5, p.y, fract(p.z)- 0.5);
    float randSections = rand_2_1(block);
    float sf1 = 2.0 + floor(rand_1_1(randSections) * MAX_S1 * D_RAD/length(block));
    if(sf1 > 15.0){
        sf1 = 15.0;
    }
    PrimitiveDist s1 = section(blockPos, BUILD_R, int(sf1), block);
    PrimitiveDist outSh = s1;
    if(randSections > 0.5) {
        //2nd section
        float sf2 = 1.0 + floor(rand_1_1(sf1) * MAX_S2 * D_RAD/length(block)/1.5);
        if(sf2 > 15.0){
                sf2 = 15.0;
        }
        PrimitiveDist s2 = section(blockPos + vec3(0.0, -2.0 * sf1 * STORY, 0.0), 0.5 * BUILD_R, int(sf2), 2.0 * block);
        outSh = compPD(outSh, s2);
        //Third section
        if(randSections > 0.75){
            float sf3 = 1.0 + floor(rand_1_1(sf2) * MAX_S3 * D_RAD/length(block)/1.5);
            PrimitiveDist s3 = section(blockPos + vec3(0.0, -2.0 * (sf1 + sf2 )* STORY, 0.0), 0.25 * BUILD_R, int(sf3), 3.0 * block);
            outSh = compPD(outSh, s3);
        }
    }
    float sideWalk = sdBox(blockPos, vec3(BUILD_R, SIDEWALK_H, BUILD_R));
    PrimitiveDist sw = PrimitiveDist(sideWalk, SIDEWALK);
    return compPD(outSh, sw);
}

float smoothRand(vec2 cellPos, vec2 cellId){
    float vecNoiseVal = rand_2_1(cellId);

    float topVal = rand_2_1(cellId);
    float botVal = rand_2_1(cellId + vec2(1.0, 0.0));
    float mixedH = mix(topVal, botVal, cellPos.x);

    float lVal = rand_2_1(cellId + vec2(0.0, 1.0));
    float rVal = rand_2_1(cellId + vec2(1.0, 1.0));
    float mixedW = mix(lVal, rVal, cellPos.x);

    float mixedFull = mix(mixedH, mixedW, cellPos.y);
    return mixedFull;
}

// -----------------------------------------------------------------------------
// --------------------------------RAYMARCHER-----------------------------------
// -----------------------------------------------------------------------------

PrimitiveDist map(vec3 p) {
    float planeDist = sdFloor(p);
    // closest PrimitiveDist
    PrimitiveDist res = PrimitiveDist(planeDist, PLANE);
    float parkRadius = 7.6;
    float inPark = sdCylinder(vec3(floor(p.x), p.y, floor(p.z)) - parkLoc, vec2(parkRadius, 10000));
    if ( iPark == 1.0 && inPark < 0.0001){
        PrimitiveDist terrain = sdTerrain(p, 98.0);
        res = compPD(res, terrain);
        vec2 block = floor(p.xz);
        if (iTree == 1.0 && rand_2_1(block) < 0.12){
            p.xz = fract(p.xz);
            float treeDist = lindenCyl(p - vec3(0.5,  p.y - terrain.dist, 0.5));
            res = compPD(res, PrimitiveDist(treeDist, TREE));
        }
    } else {
        PrimitiveDist building = building(p);
        res = compPD(res, building);
    }
    return res;
}

const float epsilon = 0.001;
vec2 e = vec2(epsilon, 0.0); // For swizzling
vec3 calcNormal(vec3 p) {
    float xCom = map(p + e.xyy).dist - map(p - e.xyy).dist;
    float yCom = map(p + e.yxy).dist - map(p - e.yxy).dist;
    float zCom = map(p + e.yyx).dist - map(p - e.yyx).dist;

    return normalize(vec3(xCom, yCom, zCom));
}

float shadow(vec3 ro, vec3 rd, float k) {
    float marchDist = 0.001;
    float boundingVolume = 25.0;
    float darkness = 1.0;
    float threshold = 0.001;

    for(int i = 0; i < 100; i++) {
        if(marchDist > boundingVolume) continue;
        float h = map(ro + rd * marchDist).dist;
        // TODO [Task 7] Modify the loop to implement soft shadows
        darkness = min(darkness, k*h/marchDist);
        marchDist += h * 0.7;
    }
    return darkness;
}

PrimitiveDist raymarch(vec3 ro, vec3 rd) {
    float marchDist = 0.001;
    float boundingDist = 50.0;
    float threshold = 0.001;

    for (int i = 0; i < 1000; i++) {
        vec3 currPos = ro + rd * marchDist;
        PrimitiveDist pd = map(currPos);

        if(pd.dist < threshold){
            return PrimitiveDist(marchDist, pd.primitive);
        }if(marchDist > boundingDist){
            return PrimitiveDist(-1.0, NO_INTERSECT);

        }
        marchDist += pd.dist*0.08;
    }

    return PrimitiveDist(-1.0, NO_INTERSECT);
}

// -----------------------------------------------------------------------------
// ---------------------------------RENDERING-----------------------------------
// -----------------------------------------------------------------------------

vec3 roadColor(vec3 blockPos){
    vec3 material = vec3(0.0);
    if(abs(blockPos.x) > CROSS_MIN && abs(blockPos).z > CROSS_MIN) {
        //Intersections
        if(abs(blockPos.x) > CROSS_MIN && abs(blockPos.x) < CROSS_MAX){
            //Crosswalk
            material = vec3(0.8, 0.8, 0.8);
            float linePos = fract((blockPos.z + 0.5)/CROSS_LEN);
            if(linePos < 0.5 &&
               !(abs(blockPos.z) > CROSS_MIN && abs(blockPos.z) < CROSS_MAX)){
                material = vec3(0.8, 0.8, 0.8);
            } else {
                material = vec3(0.2, 0.2, 0.2);
            }
        } else if(abs(blockPos.z) > CROSS_MIN && abs(blockPos.z) < CROSS_MAX){
            //Crosswalk
            material = vec3(0.8, 0.8, 0.8);
            float linePos = fract((blockPos.x + 0.5)/CROSS_LEN);
            if(linePos < 0.5 &&
              !(abs(blockPos.x) > CROSS_MIN && abs(blockPos.x) < CROSS_MAX)){
                material = vec3(0.8, 0.8, 0.8);
            } else {
                material = vec3(0.2, 0.2, 0.2);
            }
        }else {
            material = vec3(0.2, 0.2, 0.2);
        }
    }else if(abs(blockPos.x) > DASH_MIN && abs(blockPos.x) < DASH_MAX){
        //White Dashes
        float linePos = fract((blockPos.z + 0.5)/DASH_LEN);
        if(linePos < 0.5){
            material = vec3(0.8, 0.8, 0.8);
        } else {
            material = vec3(0.2, 0.2, 0.2);
        }
    } else if(abs(blockPos.z) > DASH_MIN && abs(blockPos.z) < DASH_MAX){
        //White Dashes
        float linePos = fract((blockPos.x + 0.5)/DASH_LEN);
        if(linePos < 0.5){
            material = vec3(0.8, 0.8, 0.8);
        } else {
            material = vec3(0.2, 0.2, 0.2);
        }
    } else if((abs(blockPos.z) > YELLOW_MIN && abs(blockPos.z) < YELLOW_MAX)||
              (abs(blockPos.x) > YELLOW_MIN  && abs(blockPos.x)< YELLOW_MAX)){
        //Yellow Line(s)
        material = vec3(0.8, 0.6, 0.2);
    } else {
        material = vec3(0.2, 0.2, 0.2);
    }
    return material;
}

vec3 texCol(vec2 uv, vec2 id){
    float r1 = rand_2_1(id);
    float g1 = rand_1_1(r1);
    float b1 = rand_1_1(g1);

    float r2 = rand_1_1(b1);
    float g2 = rand_1_1(r2);
    float b2 = rand_1_1(g2);

    vec3 colFrom = vec3(0.4, 0.4, 0.4);
    vec3 colTo = vec3(1.0, 0.6, 0.5);
    vec3 col1 = colFrom + colTo*vec3(r1, g1, b1);
    vec3 col2 = colFrom + colTo*vec3(r2, g2, b2);
    if(uv.y < 0.333){
        return col1;
    } else if (uv.y < 0.999 && uv.y > 0.666){
        return col1;
    } else if(uv.x > 0.333 && uv.x < 0.666){
        return vec3(0.2, 0.2, 0.2);
    } else {
        return col2;
    }
}

//We assume a STORYxSTORY texMap
vec3 buildTex(vec3 pos, vec2 id, vec3 nor){
    vec2 uv;
    vec3 dir1 = vec3(cos(M_PI/6.0),0.0, sin(M_PI/6.0));
    vec3 dir2 = vec3(cos(M_PI*5.0/6.0),0.0, sin(M_PI*5.0/6.0));

    if(nor == vec3(0.0, 1.0, 0.0)){
        return vec3(0.1, 0.4, 0.8);
    }
    //CubeGriding

    else if (abs(nor) == vec3(1.0, 0.0, 0.0)){
        float yFr = fract(pos.y/STORY);
        float zFr = fract(pos.z/STORY);
        uv = vec2(zFr, yFr);
    }else if (abs(nor) == vec3(0.0, 0.0, 1.0)){
        float yFr = fract(pos.y/STORY);
        float xFr = fract(pos.x/STORY);
        uv = vec2(xFr, yFr);
    }
    //ExtraChecks for Hex
    else if (length(nor - dir1) < 0.001 || length(-nor - dir1) < 0.001){
        vec2 posRot = rotate2d(-M_PI/3.0) * vec2(pos.x, pos.z);
        float yFr = fract(pos.y/STORY);
        float xFr = fract(posRot.x/STORY);
        float zFr = fract(posRot.y/STORY);
        uv = vec2(xFr, yFr);
    } else if (length(nor - dir2) < 0.001 || length(-nor - dir2) < 0.001){
        vec2 posRot = rotate2d(M_PI/3.0) * vec2(pos.x, pos.z);
        float yFr = fract(pos.y/STORY);
        float xFr = fract(posRot.x/STORY);
        float zFr = fract(posRot.y/STORY);
        uv = vec2(xFr, yFr);
    }
    return texCol(uv, id);
}

vec3 render(vec3 ro, vec3 rd, float t, int which) {

    // Col is the final color of the current pixel.
    vec3 col = vec3(0.);
    vec3 pos = ro + rd * t;
    // Light vector
    vec3 lig = normalize(vec3(1.0,0.8,0.7));

    // Normal vector
    vec3 nor = calcNormal(pos);

    // Ambient
    float ambient = 0.1;
    // Diffuse
    float diffuse = clamp(dot(nor, lig), 0.0, 1.0);
    // Specular
    float shineness = 32.0;
    float specular = pow(clamp(dot(rd, reflect(lig, nor)), 0.0, 1.0), 32.0);

    float darkness = shadow(pos, lig, 18.0);
    // Applying the phong lighting model to the pixel.
    col += vec3(((ambient + diffuse + specular) * darkness));

    vec2 block = floor(pos.xz);
    vec3 blockPos = vec3(fract(pos.x) - 0.5, pos.y, fract(pos.z)- 0.5);

    vec3 material = vec3(0.0);
    if (which == PLANE) {
        material = roadColor(blockPos);
    } else if (which == SIDEWALK){
        if (fract(pos.x / SIDEWALK_W) < 0.08 || fract(pos.z / SIDEWALK_W) < 0.08){
          material = vec3(0.5);
        } else {
          material = vec3(0.8, 0.8, 0.6);
        }
    } else if (which == HEX || which == BOX) {
        material = buildTex(blockPos, block, nor);
    } else if (which == TERRAIN){
        if (iGrass == 1.0){
            material = terrainColour(1.8 * pos, rd, nor, t);
        } else {
            material = vec3(0.213, 0.349, 0.0812);
        }
        return min(vec3(1.0), (darkness + 0.3) * (diffuse + 0.3) * material);
    } else if (which == TREE){
        float closeToTrunk = length(fract(pos.xz) - vec2(0.5));
        // mix between brown and green based on distance from center
        material = mix(vec3(0.219, 0.184, 0.156), vec3(0.231, 0.549, 0.1255), closeToTrunk + 0.05);
        return darkness * diffuse * material;
    } else {
        material = vec3(0.5);
    }
    // Blend the material color with the original color.
    col = mix(col, material, 0.4);
    return col;
}

void main(){
    vec3 rayOrigin;
    if (iCamera == 0.0){
        rayOrigin = vec3(16.0 * sin(iTime * .3), 7.8, 16.0 * cos(iTime * .3));
    } else {
        float localTime = fract(iTime / T4) * T4;
        if (localTime < T1){
            rayOrigin = vec3(localTime, 0.6, 3.0);
        } else if (localTime < T2){
            rayOrigin = vec3(16.0, localTime + 0.6, 3.0);
        } else if (localTime < T3){
            rayOrigin = parkLoc - vec3(5.0, 0.6, localTime);
        } else if (localTime < T4){
            rayOrigin = parkLoc - vec3(localTime, 0.6, 3.8);
        }
    }

    float focalLength = 2.0;

    // The target we are looking at
    vec3 target = vec3(0.0);
    // Look vector
    vec3 look = normalize(rayOrigin - target);
    // Up vector
    vec3 up = vec3(0.0, 1.0, 0.0);

    // Set up camera matrix
    vec3 cameraForward = -look;
    vec3 cameraRight = normalize(cross(cameraForward, up));
    vec3 cameraUp = normalize(cross(cameraRight, cameraForward));

    vec2 uv = 2.0 * gl_FragCoord.xy / iResolution.xy - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    vec3 rayDirection = vec3(uv, focalLength);

    rayDirection = normalize(cameraRight * rayDirection.x + cameraUp * rayDirection.y + cameraForward * rayDirection.z);

    PrimitiveDist rayMarchResult = raymarch(rayOrigin, rayDirection);
    vec3 col = vec3(0.0);
    if (rayMarchResult.primitive != NO_INTERSECT) {
        col = render(rayOrigin, rayDirection, rayMarchResult.dist, rayMarchResult.primitive);
    } else {
        vec2 cellPos = fract(gl_FragCoord.xy/iResolution.xy * 10.);
        vec2 cellId = floor(gl_FragCoord.xy/iResolution.xy * 10.);

        float mixedFull = smoothRand(cellPos, cellId);
        col = mixedFull * vec3(1.0, 1.0, 1.0) + vec3(0.2, 0.45, 0.650);
    }
    fragColor = vec4(col, 1.0);
}
