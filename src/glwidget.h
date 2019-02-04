#ifndef GLWIDGET_H
#define GLWIDGET_H
#include "GL/glew.h"
#include <QGLWidget>
#include <QTimer>
#ifdef __APPLE__
#include <glu.h>
#else
#include <GL/glu.h>
#endif
#include "terrain.h"

#define GLM_FORCE_RADIANS
#include "glm/glm.hpp"            // glm::vec*, mat*, and basic glm functions
#include "glm/gtx/transform.hpp"  // glm::translate, scale, rotate
#include "glm/gtc/type_ptr.hpp"   // glm::value_ptr


class GLWidget : public QGLWidget {
    Q_OBJECT

public:
    GLWidget(QGLFormat format, QWidget *parent = 0);
    ~GLWidget();
protected:
    void initializeGL();
    void paintGL();
    void resizeGL(int w, int h);
    void mousePressEvent(QMouseEvent *e);
    void mouseMoveEvent(QMouseEvent *e);
    void wheelEvent(QWheelEvent *e);

protected slots:
    /** Repaints the canvas. Called 60 times per second by m_timer. */
    void tick();
private:
    void rebuildMatrices();

    /** ID for the shader program. */
    GLuint m_program;

//    Terrain m_terrain;
    std::unique_ptr<OpenGLShape> m_quad;
    glm::mat4 m_model, m_view, m_projection;

    /** For mouse interaction. */
    float m_angleX, m_angleY, m_zoom;
    QPoint m_prevMousePos;
    QTimer m_timer;
    float m_fps;

    float m_tick;
    float m_angle;
    int m_increment;
};

#endif // GLWIDGET_H
