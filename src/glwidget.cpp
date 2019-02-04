#include "glwidget.h"
#include "QTimer"
#include "cs123_lib/resourceloader.h"
#include "cs123_lib/errorchecker.h"
#include <QMouseEvent>
#include <QWheelEvent>
#include <iostream>
#include "gl/shaders/ShaderAttribLocations.h"
#include "Settings.h"

#define PI 3.14159265f
#define CYLINDER 0
#define PLANE 1
#define NO_INTERSECT 2

GLWidget::GLWidget(QGLFormat format, QWidget *parent)
    : QGLWidget(format, parent), m_angleX(0), m_angleY(0.5f), m_zoom(10.f), m_timer(this),
      m_fps(60.0f),
      m_increment(0)
{
    connect(&m_timer, SIGNAL(timeout()), this, SLOT(tick()));
    m_timer.start(1000.0f / m_fps);
    m_tick = 1.0;
    m_angle = 0.f;
}

GLWidget::~GLWidget()
{}

void GLWidget::initializeGL() {
    ResourceLoader::initializeGlew();
    resizeGL(width(), height());

    glEnable(GL_DEPTH_TEST);
    glEnable(GL_CULL_FACE);

    // Set the color to set the screen when the color buffer is cleared.
    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
    std::vector<GLfloat> quadData;
    quadData = {-1.0f, 1.0f, 0.0f, 0.0f, 0.0f, -1.0f, -1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f, 0.0f, 1.0f, 0.0f,
                1.0f, -1.0f, 0.0f, 1.0f, 1.0f};
    m_quad = std::make_unique<OpenGLShape>();
    m_quad->setVertexData(&quadData[0], quadData.size(), VBO::GEOMETRY_LAYOUT::LAYOUT_TRIANGLE_STRIP, 4);
    m_quad->setAttribute(ShaderAttrib::POSITION, 3, 0, VBOAttribMarker::DATA_TYPE::FLOAT, false);
    m_quad->setAttribute(ShaderAttrib::TEXCOORD0, 2, 3*sizeof(GLfloat), VBOAttribMarker::DATA_TYPE::FLOAT, false);
    m_quad->buildVAO();
    m_program = ResourceLoader::createShaderProgram(":/shaders/shader.vert", ":/shaders/shader.frag");
//    m_terrain.init();

    rebuildMatrices();
}

void GLWidget::paintGL() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // Bind shader program.
    glUseProgram(m_program);

    // Set uniforms.
    float time = m_increment++ / (float) m_fps;
    glUniform1f(glGetUniformLocation(m_program, "time"), time);
    glUniformMatrix4fv(glGetUniformLocation(m_program, "view"), 1, GL_FALSE, glm::value_ptr(m_view));

    glUniform1i(glGetUniformLocation(m_program, "width"), width());
    glUniform1i(glGetUniformLocation(m_program, "height"), height());

    //Setting Reads
    glUniform1f(glGetUniformLocation(m_program, "tree"), static_cast<float>(settings.treeTog));
    glUniform1f(glGetUniformLocation(m_program, "park"), static_cast<float>(settings.parkTog));
    glUniform1f(glGetUniformLocation(m_program, "grass"), static_cast<float>(settings.grassTog));

    glUniform1f(glGetUniformLocation(m_program, "camera"), static_cast<float>(settings.viewType));
    glUniform1f(glGetUniformLocation(m_program, "seed"), settings.seed);

    glUniform1f(glGetUniformLocation(m_program, "rotH"), settings.rotH);
    glUniform1f(glGetUniformLocation(m_program, "rotV"), settings.rotV);
    m_quad->draw();
    // Unbind shader program.
    glUseProgram(0);
}

void GLWidget::resizeGL(int w, int h) {
    glViewport(0, 0, w, h);
    rebuildMatrices();
}

void GLWidget::mousePressEvent(QMouseEvent *event) {
    m_prevMousePos = event->pos();
}

void GLWidget::mouseMoveEvent(QMouseEvent *event) {
    m_angleX += 10 * (event->x() - m_prevMousePos.x()) / (float) width();
    m_angleY += 10 * (event->y() - m_prevMousePos.y()) / (float) height();
    m_prevMousePos = event->pos();
    rebuildMatrices();
}

void GLWidget::wheelEvent(QWheelEvent *event) {
    m_zoom -= event->delta() / 100.f;
    rebuildMatrices();
}

void GLWidget::rebuildMatrices() {
    m_model = glm::mat4(1.f);
    m_view = glm::translate(glm::vec3(0, 0, -m_zoom)) *
             glm::rotate(m_angleY, glm::vec3(1,0,0)) *
             glm::rotate(m_angleX, glm::vec3(0,1,0));
    m_projection = glm::perspective(0.8f, (float)width()/height(), 0.1f, 100.f);
    update();
}
void GLWidget::tick()
{
    m_tick += 1;

    m_angle += M_PI / 60.f;

    if(m_angle >= 2 * M_PI) {
        m_angle = 0.f;
    }

    update();
}

