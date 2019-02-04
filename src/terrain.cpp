#include "terrain.h"

#include <math.h>
#include "gl/shaders/ShaderAttribLocations.h"
#include "iostream"

Terrain::Terrain() : m_numRows(100), m_numCols(m_numRows)
{
}


/**
 * Returns a pseudo-random value between -1.0 and 1.0 for the given row and column.
 */
float Terrain::randValue(int row, int col) {
    return -1.0 + 2.0 * glm::fract(sin(row * 127.1f + col * 311.7f) * 43758.5453123f);
}


/**
 * Returns the object-space position for the terrain vertex at the given row and column.
 */
glm::vec3 Terrain::getPosition(int row, int col) {
    glm::vec3 position;
    position.x = 10 * row/m_numRows - 5;
//    position.y = randValue(row, col);
    position.z = 10 * col/m_numCols - 5;

    // TODO: Adjust position.y using value noise.

    int nRow = floor(row/20);
    int nCol = floor(col/20);

    float upLeft = randValue(nRow, nCol);
    float upRight = randValue(nRow, nCol+1);
    float botLeft = randValue(nRow+1, nCol);
    float botRight = randValue(nRow+1, nCol+1);

    float y = glm::fract(row/20.0f);
    float x = glm::fract(col/20.0f);

    float topRow = glm::mix(upLeft, upRight, 3*x*x - 2*x*x*x);
    float botRow = glm::mix(botLeft, botRight,3*x*x - 2*x*x*x);
    float verti = glm::mix(topRow, botRow, 3*y*y- 2*y*y*y);

    position.y = verti;
    int octRow = floor(row/16);
    int octCol = floor(col/16);
    upLeft = randValue(octRow, octCol);
    upRight = randValue(octRow, octCol+1);
    botLeft = randValue(octRow+1, octCol);
    botRight = randValue(octRow+1, octCol+1);

    float y1 = glm::fract(row/16.0f);
    float x1 = glm::fract(col/16.0f);

    float topRow1 = glm::mix(upLeft, upRight, 3*x1*x1 - 2*x1*x1*x1);
    float botRow1 = glm::mix(botLeft, botRight,3*x1*x1 - 2*x1*x1*x1);
    float verti1 = glm::mix(topRow1, botRow1, 3*y1*y1- 2*y1*y1*y1);

    position.y += verti1;

    octRow = floor(row/8);
    octCol = floor(col/8);
    upLeft = randValue(octRow, octCol);
    upRight = randValue(octRow, octCol+1);
    botLeft = randValue(octRow+1, octCol);
    botRight = randValue(octRow+1, octCol+1);

    y1 = glm::fract(row/8.0f);
    x1 = glm::fract(col/8.0f);

    topRow1 = glm::mix(upLeft, upRight, 3*x1*x1 - 2*x1*x1*x1);
    botRow1 = glm::mix(botLeft, botRight,3*x1*x1 - 2*x1*x1*x1);
    verti1 = glm::mix(topRow1, botRow1, 3*y1*y1- 2*y1*y1*y1);

    position.y += verti1;

    octRow = floor(row/4);
    octCol = floor(col/4);
    upLeft = randValue(octRow, octCol);
    upRight = randValue(octRow, octCol+1);
    botLeft = randValue(octRow+1, octCol);
    botRight = randValue(octRow+1, octCol+1);

    y1 = glm::fract(row/4.0f);
    x1 = glm::fract(col/4.0f);

    topRow1 = glm::mix(upLeft, upRight, 3*x1*x1 - 2*x1*x1*x1);
    botRow1 = glm::mix(botLeft, botRight,3*x1*x1 - 2*x1*x1*x1);
    verti1 = glm::mix(topRow1, botRow1, 3*y1*y1- 2*y1*y1*y1);

    position.y += verti1;
    return position;
}


/**
 * Returns the normal vector for the terrain vertex at the given row and column.
 */
glm::vec3 Terrain::getNormal(int row, int col) {
    // TODO: Compute the normal at the given row and column using the positions of the
    //       neighboring vertices.

    glm::vec3 center = this->getPosition(row, col);
    glm::vec3 right = this->getPosition(row, col+1);
    glm::vec3 upRight = this->getPosition(row-1, col+1);
    glm::vec3 up = this->getPosition(row-1, col);
    glm::vec3 upLeft = this->getPosition(row-1, col-1);
    glm::vec3 left = this->getPosition(row, col-1);
    glm::vec3 downLeft = this->getPosition(row+1, col-1);
    glm::vec3 down = this->getPosition(row+1, col);
    glm::vec3 downRight = this->getPosition(row+1, col+1);

    glm::vec3 norm1 = glm::normalize(glm::cross(right-upRight, center-right));
    glm::vec3 norm2= glm::normalize(glm::cross(upRight-up, center-upRight));
    glm::vec3 norm3= glm::normalize(glm::cross(up-upLeft, center-up));
    glm::vec3 norm4= glm::normalize(glm::cross(upLeft-left, center-upLeft));
    glm::vec3 norm5= glm::normalize(glm::cross(left-downLeft, center-left));
    glm::vec3 norm6 = glm::normalize(glm::cross( downLeft-down, center-downLeft));
    glm::vec3 norm7 = glm::normalize(glm::cross(down-downRight, center-down));
    glm::vec3 norm8 = glm::normalize(glm::cross(downRight-right, center-downRight));
    glm::vec3 average = (norm1+norm2+norm3+norm4+norm5+norm6+norm7+norm8);



    return average;
}


/**
 * Initializes the terrain by storing positions and normals in a vertex buffer.
 */
void Terrain::init() {
    // TODO: Change from GL_LINE to GL_FILL in order to render full triangles instead of wireframe.
    glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);


    // Initializes a grid of vertices using triangle strips.
    int numVertices = (m_numRows - 1) * (2 * m_numCols + 2);
    std::vector<glm::vec3> data(2 * numVertices);
    int index = 0;
    for (int row = 0; row < m_numRows - 1; row++) {
        for (int col = m_numCols - 1; col >= 0; col--) {
            data[index++] = getPosition(row, col);
            data[index++] = getNormal  (row, col);
            data[index++] = getPosition(row + 1, col);
            data[index++] = getNormal  (row + 1, col);
        }
        data[index++] = getPosition(row + 1, 0);
        data[index++] = getNormal  (row + 1, 0);
        data[index++] = getPosition(row + 1, m_numCols - 1);
        data[index++] = getNormal  (row + 1, m_numCols - 1);
    }

    // Initialize OpenGLShape.
    m_shape = std::make_unique<OpenGLShape>();
    m_shape->setVertexData(&data[0][0], data.size() * 3, VBO::GEOMETRY_LAYOUT::LAYOUT_TRIANGLE_STRIP, numVertices);
    m_shape->setAttribute(ShaderAttrib::POSITION, 3, 0, VBOAttribMarker::DATA_TYPE::FLOAT, false);
    m_shape->setAttribute(ShaderAttrib::NORMAL, 3, sizeof(glm::vec3), VBOAttribMarker::DATA_TYPE::FLOAT, false);
    m_shape->buildVAO();
}


/**
 * Draws the terrain.
 */
void Terrain::draw()
{
    m_shape->draw();
}
