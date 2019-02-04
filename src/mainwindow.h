#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QList>
#include <memory>
#include <QButtonGroup>
#include "glwidget.h"

namespace Ui {
    class MainWindow;
}

class DataBinding;

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();
public slots:
    void settingsChanged();
protected:
    // Overridden from QWidget
    void closeEvent(QCloseEvent *event);
    void changeEvent(QEvent *e);
    void dataBind();

private:
    QList<DataBinding*> m_bindings;
    QList<QButtonGroup*> m_buttonGroups;

    Ui::MainWindow *m_ui;
    GLWidget *m_glWidget;

};

#endif // MAINWINDOW_H
