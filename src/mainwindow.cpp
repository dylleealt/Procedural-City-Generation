#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "Databinding.h"
#include "Settings.h"
#include <QSettings>
#include <assert.h>
#include <QGridLayout>
#include <iostream>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    m_ui(new Ui::MainWindow)
{
    QGLFormat qglFormat;
    qglFormat.setVersion(4,0);
    qglFormat.setProfile(QGLFormat::CoreProfile);
    m_ui->setupUi(this);
    QGridLayout *gridLayout = new QGridLayout(m_ui->centralWidget);
    m_glWidget = new GLWidget(qglFormat, this);
    m_glWidget->setMinimumSize(100, 100);
    gridLayout->addWidget(m_glWidget, 0, 1);

    // Restore the UI settings
    QSettings qtSettings("CS123", "Lab05");
    restoreGeometry(qtSettings.value("geometry").toByteArray());
    restoreState(qtSettings.value("windowState").toByteArray());

    // Resize the window because the window is huge since all docks were visible.
    resize(1000, 600);

    // Bind the UI elements to their properties in the global Settings object, using binding
    // objects to simplify the code.  Each binding object connects to its UI elements and keeps
    // the UI and its setting in sync.

    QList<QAction*> actions;
#define SETUP_ACTION(dock, key) \
    actions.push_back(m_ui->dock->toggleViewAction()); \
    actions.back()->setShortcut(QKeySequence(key));
    SETUP_ACTION(cityDoc, "CTRL+1");
    m_ui->menuBar->addActions(actions);
#undef SETUP_ACTION
    m_ui->cityDoc->raise();
    dataBind();
}

MainWindow::~MainWindow()
{
    delete m_ui;
    delete m_glWidget;
}

void MainWindow::changeEvent(QEvent *e) {
    QMainWindow::changeEvent(e); // allow the superclass to handle this for the most part...

    switch (e->type()) {
        case QEvent::LanguageChange:
            m_ui->retranslateUi(this);
            break;
        default:
            break;
    }
}
void MainWindow::closeEvent(QCloseEvent *event) {
    QSettings qtSettings("CS123", "Lab05");
    qtSettings.setValue("geometry", saveGeometry());
    qtSettings.setValue("windowState", saveState());
    QMainWindow::closeEvent(event);
}

void MainWindow::settingsChanged(){
    //Do NOTHING
}

void MainWindow::dataBind() {
#define BIND(b) { \
    DataBinding *_b = (b); \
    m_bindings.push_back(_b); \
    assert(connect(_b, SIGNAL(dataChanged()), this, SLOT(settingsChanged()))); \
}

    QButtonGroup *cityButtonGroup = new QButtonGroup;
    m_buttonGroups.push_back(cityButtonGroup);

    // Filter dock
    BIND(BoolBinding::bindCheckbox(m_ui->treeTog_2, settings.treeTog))
    BIND(BoolBinding::bindCheckbox(m_ui->parkTog_2, settings.parkTog))
    BIND(BoolBinding::bindCheckbox(m_ui->grassTog, settings.grassTog))
    BIND(ChoiceBinding::bindRadioButtons(
            cityButtonGroup,
            NUM_CAMERA_TYPES,
            settings.viewType,
            m_ui->WalkTog,
            m_ui->spinTog))
    BIND(FloatBinding::bindSliderAndTextbox(
        m_ui->seedSlider, m_ui->seedEdit, settings.seed,
            0.f, 1.f))
    BIND(FloatBinding::bindSliderAndTextbox(
        m_ui->rotHSlider, m_ui->rotEditH, settings.rotH,
            0.f, 1.f))
    BIND(FloatBinding::bindSliderAndTextbox(
        m_ui->rotVSlider, m_ui->rotEditV, settings.rotV,
            0.f, 1.f))

#undef BIND
}

